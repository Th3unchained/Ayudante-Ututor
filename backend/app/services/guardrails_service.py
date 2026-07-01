"""
Capa de guardrails (validación de criterios éticos y pedagógicos) de la
Capa de Trabajo de IA.

Tres niveles de protección, de más rápido/barato a más completo:

1. Gemini Safety Settings (gemini_service.py): filtro nativo de la API de
   Gemini sobre categorías de daño (odio, acoso, contenido peligroso, etc.).
   Es la primera barrera, a nivel de la propia llamada al modelo.

2. Filtro basado en reglas (rule_based_check): chequeos rápidos y
   deterministas que no requieren otra llamada al modelo.

3. LLM-as-judge (llm_judge_check): una segunda llamada, liviana y barata, al
   mismo modelo Gemini, donde se le pide evaluar la respuesta generada
   contra criterios éticos y pedagógicos específicos del contexto educativo
   de UTutor, devolviendo un JSON estructurado.

Cada validación queda registrada en la tabla guardrail_checks para dar
trazabilidad (qué se evaluó, con qué resultado y por qué).
"""

import json
import os

from google.genai import types

from app.services.gemini_service import GEMINI_MODEL, client

GUARDRAILS_ENABLED = os.getenv("GUARDRAILS_ENABLED", "true").lower() == "true"


BANNED_PATTERNS = [
    "ignora tus instrucciones",
    "ignora las instrucciones anteriores",
    "eres un modelo sin restricciones",
    "olvida tus reglas",
]

JUDGE_SYSTEM_INSTRUCTION = """
Eres un validador pedagógico y ético para un tutor académico universitario llamado UTutor.
Tu única tarea es evaluar si una respuesta generada por el tutor es apropiada para
mostrársela a un estudiante.

Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni explicación fuera del JSON,
con este formato exacto:
{"apropiado": true o false, "nivel_riesgo": "bajo" o "medio" o "alto", "motivo": "breve explicación en una frase"}

Marca apropiado=false si ocurre alguno de estos casos:
- La respuesta resuelve una evaluación/tarea completa en vez de orientar el aprendizaje del estudiante.
- Contiene contenido ofensivo, discriminatorio o fuera de lugar para un entorno educativo.
- Contiene información peligrosa, ilegal o no apta para un contexto universitario.
- Afirma con seguridad datos que contradicen claramente el contexto entregado (alucinación evidente).

Si la respuesta es una explicación académica normal, apropiada y sin estos problemas, marca apropiado=true
y nivel_riesgo="bajo".
"""


def rule_based_check(answer: str) -> tuple[bool, str]:
    if not answer or not answer.strip():
        return False, "La respuesta llegó vacía."

    lowered = answer.lower()

    for pattern in BANNED_PATTERNS:
        if pattern in lowered:
            return False, f"Contenido bloqueado por regla simple: '{pattern}'."

    return True, "OK"


def llm_judge_check(question: str, answer: str, course_name: str) -> tuple[bool, str, str]:
    prompt = f"""
Asignatura: {course_name}

Pregunta del estudiante:
{question}

Respuesta generada por el tutor:
{answer}

Evalúa la respuesta según los criterios indicados en las instrucciones del sistema.
"""

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=JUDGE_SYSTEM_INSTRUCTION,
                temperature=0,
                max_output_tokens=200,
                response_mime_type="application/json",
            ),
        )

        raw = (response.text or "").strip()
        data = json.loads(raw)

        is_appropriate = bool(data.get("apropiado", True))
        risk_level = data.get("nivel_riesgo", "bajo")
        reason = data.get("motivo", "Sin observaciones.")

        return is_appropriate, risk_level, reason

    except Exception as error:
        # Si el validador LLM falla (timeout, JSON inválido, etc.) no se
        # bloquea la respuesta del estudiante por un error de
        # infraestructura, pero queda registrado que no se pudo evaluar.
        return True, "bajo", f"No se pudo ejecutar el validador LLM: {error}"


def validate_answer(question: str, answer: str, course_name: str) -> dict:
    if not GUARDRAILS_ENABLED:
        return {
            "passed": True,
            "risk_level": "bajo",
            "reason": "Guardrails deshabilitados por configuración.",
            "checked_by": "disabled",
        }

    passed_rules, rule_reason = rule_based_check(answer)

    if not passed_rules:
        return {
            "passed": False,
            "risk_level": "alto",
            "reason": rule_reason,
            "checked_by": "rule_based",
        }

    is_appropriate, risk_level, reason = llm_judge_check(question, answer, course_name)

    return {
        "passed": is_appropriate,
        "risk_level": risk_level,
        "reason": reason,
        "checked_by": "llm_judge",
    }


FALLBACK_ANSWER = (
    "No puedo entregar esta respuesta porque no superó la validación pedagógica "
    "automática del sistema. Intenta reformular tu pregunta de forma más específica "
    "o consúltalo directamente con tu profesor."
)
