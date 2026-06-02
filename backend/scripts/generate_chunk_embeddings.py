import json
import sys
from pathlib import Path

from sqlalchemy import text

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from app.database import SessionLocal
from app.services.embedding_service import generate_embedding


def format_vector(values: list[float]) -> str:
    return "[" + ",".join(str(value) for value in values) + "]"


def main():
    db = SessionLocal()

    try:
        chunks = db.execute(
            text("""
                SELECT
                    id,
                    content
                FROM document_chunks
                WHERE embedding_vector IS NULL
                ORDER BY created_at ASC;
            """)
        ).fetchall()

        print(f"Chunks pendientes: {len(chunks)}")

        for index, chunk in enumerate(chunks, start=1):
            print(f"Generando embedding {index}/{len(chunks)}: {chunk.id}")

            embedding = generate_embedding(chunk.content)
            vector_text = format_vector(embedding)

            db.execute(
                text("""
                    UPDATE document_chunks
                    SET
                        embedding_vector = CAST(:embedding AS vector),
                        embedding_json = CAST(:embedding_json AS jsonb)
                    WHERE id = :chunk_id;
                """),
                {
                    "chunk_id": chunk.id,
                    "embedding": vector_text,
                    "embedding_json": json.dumps(embedding),
                },
            )

            db.commit()

        print("Embeddings generados correctamente.")

    except Exception as error:
        db.rollback()
        raise error

    finally:
        db.close()


if __name__ == "__main__":
    main()