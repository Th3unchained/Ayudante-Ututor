from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user

router = APIRouter(
    tags=["Documents"],
)


@router.get("/courses/{course_id}/documents")
def get_course_documents(
    course_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollment_query = text("""
        SELECT id
        FROM student_courses
        WHERE student_id = :student_id
          AND course_id = :course_id
        LIMIT 1;
    """)

    enrollment = db.execute(
        enrollment_query,
        {
            "student_id": current_user.id,
            "course_id": course_id,
        },
    ).fetchone()

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no está inscrito en este curso.",
        )

    query = text("""
        SELECT
            id,
            file_name,
            file_path,
            mime_type,
            status,
            created_at,
            updated_at
        FROM documents
        WHERE course_id = :course_id
        ORDER BY created_at DESC;
    """)

    result = db.execute(
        query,
        {"course_id": course_id},
    )

    documents = []

    for row in result:
        documents.append({
            "id": str(row.id),
            "file_name": row.file_name,
            "file_path": row.file_path,
            "mime_type": row.mime_type,
            "status": row.status,
            "created_at": row.created_at,
            "updated_at": row.updated_at,
        })

    return {
        "course_id": course_id,
        "documents": documents,
    }


@router.get("/documents/{document_id}")
def get_document_detail(
    document_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT
            d.id,
            d.course_id,
            c.name AS course_name,
            d.file_name,
            d.file_path,
            d.mime_type,
            d.status,
            d.created_at,
            d.updated_at
        FROM documents d
        JOIN courses c ON c.id = d.course_id
        JOIN student_courses sc ON sc.course_id = d.course_id
        WHERE d.id = :document_id
          AND sc.student_id = :student_id
        LIMIT 1;
    """)

    document = db.execute(
        query,
        {
            "document_id": document_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado para este estudiante.",
        )

    return {
        "id": str(document.id),
        "course_id": str(document.course_id),
        "course_name": document.course_name,
        "file_name": document.file_name,
        "file_path": document.file_path,
        "mime_type": document.mime_type,
        "status": document.status,
        "created_at": document.created_at,
        "updated_at": document.updated_at,
    }


@router.get("/documents/{document_id}/chunks")
def get_document_chunks(
    document_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document_query = text("""
        SELECT d.id
        FROM documents d
        JOIN student_courses sc ON sc.course_id = d.course_id
        WHERE d.id = :document_id
          AND sc.student_id = :student_id
        LIMIT 1;
    """)

    document = db.execute(
        document_query,
        {
            "document_id": document_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado para este estudiante.",
        )

    chunks_query = text("""
        SELECT
            id,
            chunk_index,
            content,
            page_number,
            section_title,
            created_at
        FROM document_chunks
        WHERE document_id = :document_id
        ORDER BY chunk_index ASC;
    """)

    result = db.execute(
        chunks_query,
        {"document_id": document_id},
    )

    chunks = []

    for row in result:
        chunks.append({
            "id": str(row.id),
            "chunk_index": row.chunk_index,
            "content": row.content,
            "page_number": row.page_number,
            "section_title": row.section_title,
            "created_at": row.created_at,
        })

    return {
        "document_id": document_id,
        "chunks": chunks,
    }