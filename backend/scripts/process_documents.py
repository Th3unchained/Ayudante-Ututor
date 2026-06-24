"""
Procesa los documentos en estado 'pending': extrae su texto y lo divide en
fragmentos (chunks) usando app/services/chunking_service.py.

Uso:
    python scripts/process_documents.py

Después de correr este script, ejecuta generate_chunk_embeddings.py para
generar los embeddings de los chunks recién creados.
"""

import sys
from pathlib import Path

from sqlalchemy import text

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from app.database import SessionLocal
from app.services.chunking_service import chunk_document


def get_pending_documents(db):
    return db.execute(
        text("""
            SELECT
                id,
                course_id,
                file_name,
                file_path,
                mime_type
            FROM documents
            WHERE status = 'pending'
            ORDER BY created_at ASC;
        """)
    ).fetchall()


def main():
    db = SessionLocal()

    try:
        documents = get_pending_documents(db)
        print(f"Documentos pendientes de fragmentar: {len(documents)}")

        for document in documents:
            absolute_path = PROJECT_ROOT / document.file_path

            print(f"Procesando: {document.file_name}")

            try:
                db.execute(
                    text("""
                        UPDATE documents
                        SET status = 'processing'
                        WHERE id = :id;
                    """),
                    {"id": document.id},
                )
                db.commit()

                if not absolute_path.exists():
                    raise FileNotFoundError(
                        f"No se encontró el archivo: {absolute_path}"
                    )

                chunks = chunk_document(absolute_path, document.mime_type)

                if not chunks:
                    raise ValueError("No se extrajo texto del documento.")

                db.execute(
                    text("""
                        DELETE FROM document_chunks
                        WHERE document_id = :id;
                    """),
                    {"id": document.id},
                )

                insert_query = text("""
                    INSERT INTO document_chunks (
                        document_id,
                        course_id,
                        chunk_index,
                        content,
                        page_number,
                        section_title
                    )
                    VALUES (
                        :document_id,
                        :course_id,
                        :chunk_index,
                        :content,
                        :page_number,
                        :section_title
                    );
                """)

                for chunk in chunks:
                    db.execute(
                        insert_query,
                        {
                            "document_id": document.id,
                            "course_id": document.course_id,
                            "chunk_index": chunk["chunk_index"],
                            "content": chunk["content"],
                            "page_number": chunk["page_number"],
                            "section_title": chunk["section_title"],
                        },
                    )

                db.execute(
                    text("""
                        UPDATE documents
                        SET status = 'processed'
                        WHERE id = :id;
                    """),
                    {"id": document.id},
                )

                db.commit()

                print(f"  -> {len(chunks)} fragmentos generados.")

            except Exception as error:
                db.rollback()

                db.execute(
                    text("""
                        UPDATE documents
                        SET status = 'failed'
                        WHERE id = :id;
                    """),
                    {"id": document.id},
                )
                db.commit()

                print(f"  -> ERROR al procesar '{document.file_name}': {error}")

        print(
            "Fragmentación finalizada. "
            "Ejecuta generate_chunk_embeddings.py para generar los embeddings."
        )

    finally:
        db.close()


if __name__ == "__main__":
    main()
