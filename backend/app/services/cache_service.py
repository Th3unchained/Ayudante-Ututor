"""
Capa de caché de la Capa de Trabajo de IA.

Diseño de dos niveles:

L1 - Redis (opcional): coincidencia EXACTA sobre la pregunta normalizada.
     Solo se activa si la variable de entorno REDIS_URL está configurada.
     Es la capa más rápida y barata, pero solo sirve para preguntas
     repetidas casi textualmente.

L2 - PostgreSQL + pgvector (siempre disponible): coincidencia SEMÁNTICA.
     Compara el embedding de la nueva pregunta contra preguntas ya
     respondidas para el mismo curso, usando similitud coseno. Reutiliza
     la infraestructura de pgvector que ya usa el sistema para el RAG, por
     lo que no agrega infraestructura nueva.

Solo se cachean respuestas que pasaron el guardrail (ver guardrails_service),
para evitar cachear y reutilizar respuestas bloqueadas o de baja calidad.
"""

import hashlib
import os
import re
import unicodedata

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.embedding_service import generate_embedding

CACHE_SIMILARITY_THRESHOLD = float(os.getenv("CACHE_SIMILARITY_THRESHOLD", "0.93"))
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", str(60 * 60 * 24)))
REDIS_URL = os.getenv("REDIS_URL")

_redis_client = None

if REDIS_URL:
    try:
        import redis

        _redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        _redis_client.ping()
    except Exception:
        # Si Redis no está disponible, el sistema sigue funcionando solo
        # con la caché semántica de PostgreSQL (L2).
        _redis_client = None


def normalize_question(question: str) -> str:
    clean = question.strip().lower()
    clean = unicodedata.normalize("NFKD", clean)
    clean = "".join(char for char in clean if not unicodedata.combining(char))
    clean = re.sub(r"\s+", " ", clean)
    return clean


def build_exact_cache_key(course_id: str, question: str) -> str:
    normalized = normalize_question(question)
    digest = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
    return f"ututor:cache:{course_id}:{digest}"


def format_vector(values: list[float]) -> str:
    return "[" + ",".join(str(value) for value in values) + "]"


def get_cached_answer(course_id: str, question: str, db: Session) -> dict:
    """Busca una respuesta cacheada para la pregunta.

    Devuelve siempre un dict con:
      - "hit": dict con la respuesta encontrada, o None si no hubo coincidencia.
      - "question_embedding": el embedding ya calculado (para reutilizarlo al
        guardar en caché si corresponde), o None si no se pudo calcular.
    """

    if _redis_client:
        cache_key = build_exact_cache_key(course_id, question)

        try:
            cached_answer = _redis_client.get(cache_key)
        except Exception:
            cached_answer = None

        if cached_answer:
            return {
                "hit": {
                    "answer": cached_answer,
                    "cache_layer": "redis_exact",
                    "similarity_score": 1.0,
                },
                "question_embedding": None,
            }

    try:
        question_embedding = generate_embedding(question)
    except Exception:
        return {"hit": None, "question_embedding": None}

    question_vector = format_vector(question_embedding)

    query = text("""
        SELECT
            id,
            answer,
            1 - (question_embedding <=> CAST(:question_embedding AS vector)) AS similarity_score
        FROM qa_cache
        WHERE course_id = :course_id
        ORDER BY question_embedding <=> CAST(:question_embedding AS vector)
        LIMIT 1;
    """)

    row = db.execute(
        query,
        {
            "course_id": course_id,
            "question_embedding": question_vector,
        },
    ).fetchone()

    if not row or row.similarity_score is None:
        return {"hit": None, "question_embedding": question_embedding}

    if row.similarity_score < CACHE_SIMILARITY_THRESHOLD:
        return {"hit": None, "question_embedding": question_embedding}

    db.execute(
        text("""
            UPDATE qa_cache
            SET hit_count = hit_count + 1,
                last_used_at = NOW()
            WHERE id = :id;
        """),
        {"id": row.id},
    )

    return {
        "hit": {
            "answer": row.answer,
            "cache_layer": "postgres_semantic",
            "similarity_score": float(row.similarity_score),
        },
        "question_embedding": question_embedding,
    }


def store_answer_in_cache(
    course_id: str,
    question: str,
    answer: str,
    db: Session,
    question_embedding: list[float] | None = None,
) -> None:
    if _redis_client:
        cache_key = build_exact_cache_key(course_id, question)

        try:
            _redis_client.set(cache_key, answer, ex=CACHE_TTL_SECONDS)
        except Exception:
            pass

    if question_embedding is None:
        try:
            question_embedding = generate_embedding(question)
        except Exception:
            return

    question_vector = format_vector(question_embedding)

    db.execute(
        text("""
            INSERT INTO qa_cache (
                course_id,
                question,
                question_embedding,
                answer
            )
            VALUES (
                :course_id,
                :question,
                CAST(:question_embedding AS vector),
                :answer
            );
        """),
        {
            "course_id": course_id,
            "question": question,
            "question_embedding": question_vector,
            "answer": answer,
        },
    )
