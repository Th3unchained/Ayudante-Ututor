from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.services.gemini_service import generate_tutor_answer

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


class ChatAskRequest(BaseModel):
    course_id: str
    question: str
    conversation_id: str | None = None
    folder_id: str | None = None


def build_title(question: str) -> str:
    clean_question = question.strip()

    if len(clean_question) <= 42:
        return clean_question

    return f"{clean_question[:42]}..."


def get_student_course(course_id: str, student_id, db: Session):
    query = text("""
        SELECT
            c.id,
            c.name
        FROM student_courses sc
        JOIN courses c ON c.id = sc.course_id
        WHERE sc.student_id = :student_id
          AND sc.course_id = :course_id
        LIMIT 1;
    """)

    course = db.execute(
        query,
        {
            "student_id": student_id,
            "course_id": course_id,
        },
    ).fetchone()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no está inscrito en este curso.",
        )

    return course


def validate_folder(folder_id: str | None, course_id: str, student_id, db: Session):
    if not folder_id:
        return None

    query = text("""
        SELECT id
        FROM folders
        WHERE id = :folder_id
          AND course_id = :course_id
          AND student_id = :student_id
        LIMIT 1;
    """)

    folder = db.execute(
        query,
        {
            "folder_id": folder_id,
            "course_id": course_id,
            "student_id": student_id,
        },
    ).fetchone()

    if not folder:
        raise HTTPException(
            status_code=404,
            detail="Carpeta no encontrada para este estudiante y curso.",
        )

    return folder


def get_or_create_conversation(
    conversation_id: str | None,
    course_id: str,
    folder_id: str | None,
    question: str,
    student_id,
    db: Session,
):
    if conversation_id:
        query = text("""
            SELECT
                id,
                title,
                folder_id,
                is_saved,
                created_at,
                updated_at
            FROM conversations
            WHERE id = :conversation_id
              AND student_id = :student_id
              AND course_id = :course_id
            LIMIT 1;
        """)

        conversation = db.execute(
            query,
            {
                "conversation_id": conversation_id,
                "student_id": student_id,
                "course_id": course_id,
            },
        ).fetchone()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversación no encontrada.",
            )

        return conversation, False

    insert_query = text("""
        INSERT INTO conversations (
            student_id,
            course_id,
            folder_id,
            title,
            is_saved
        )
        VALUES (
            :student_id,
            :course_id,
            :folder_id,
            :title,
            TRUE
        )
        RETURNING
            id,
            title,
            folder_id,
            is_saved,
            created_at,
            updated_at;
    """)

    conversation = db.execute(
        insert_query,
        {
            "student_id": student_id,
            "course_id": course_id,
            "folder_id": folder_id,
            "title": build_title(question),
        },
    ).fetchone()

    return conversation, True


def create_message(
    conversation_id: str,
    role: str,
    content: str,
    db: Session,
    model_name: str | None = None,
):
    query = text("""
        INSERT INTO messages (
            conversation_id,
            role,
            content,
            model_name,
            tokens_input,
            tokens_output
        )
        VALUES (
            :conversation_id,
            :role,
            :content,
            :model_name,
            0,
            0
        )
        RETURNING
            id,
            conversation_id,
            role,
            content,
            model_name,
            created_at;
    """)

    message = db.execute(
        query,
        {
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "model_name": model_name,
        },
    ).fetchone()

    return message


def get_context_chunks(course_id: str, db: Session):
    query = text("""
        SELECT
            dc.id AS chunk_id,
            dc.document_id,
            d.file_name AS document_name,
            dc.chunk_index,
            dc.content,
            dc.page_number,
            dc.section_title
        FROM document_chunks dc
        JOIN documents d ON d.id = dc.document_id
        WHERE dc.course_id = :course_id
          AND d.status = 'processed'
        ORDER BY dc.chunk_index ASC
        LIMIT 6;
    """)

    result = db.execute(
        query,
        {"course_id": course_id},
    )

    chunks = []

    for row in result:
        chunks.append({
            "chunk_id": str(row.chunk_id),
            "document_id": str(row.document_id),
            "document_name": row.document_name,
            "chunk_index": row.chunk_index,
            "content": row.content,
            "page_number": row.page_number,
            "section_title": row.section_title,
        })

    return chunks


def save_message_sources(message_id: str, context_chunks: list[dict], db: Session):
    if not context_chunks:
        return

    insert_query = text("""
        INSERT INTO message_sources (
            message_id,
            document_id,
            chunk_id,
            document_name,
            page_number,
            section_title,
            similarity_score
        )
        VALUES (
            :message_id,
            :document_id,
            :chunk_id,
            :document_name,
            :page_number,
            :section_title,
            NULL
        );
    """)

    for chunk in context_chunks:
        db.execute(
            insert_query,
            {
                "message_id": message_id,
                "document_id": chunk["document_id"],
                "chunk_id": chunk["chunk_id"],
                "document_name": chunk["document_name"],
                "page_number": chunk["page_number"],
                "section_title": chunk["section_title"],
            },
        )


@router.post("/ask")
def ask_tutor(
    payload: ChatAskRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    question = payload.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="La pregunta es obligatoria.",
        )

    try:
        course = get_student_course(
            course_id=payload.course_id,
            student_id=current_user.id,
            db=db,
        )

        validate_folder(
            folder_id=payload.folder_id,
            course_id=payload.course_id,
            student_id=current_user.id,
            db=db,
        )

        conversation, was_created = get_or_create_conversation(
            conversation_id=payload.conversation_id,
            course_id=payload.course_id,
            folder_id=payload.folder_id,
            question=question,
            student_id=current_user.id,
            db=db,
        )

        user_message = create_message(
            conversation_id=str(conversation.id),
            role="user",
            content=question,
            db=db,
        )

        context_chunks = get_context_chunks(
            course_id=payload.course_id,
            db=db,
        )

        answer = generate_tutor_answer(
            question=question,
            course_name=course.name,
            context_chunks=context_chunks,
        )

        assistant_message = create_message(
            conversation_id=str(conversation.id),
            role="assistant",
            content=answer,
            model_name="gemini-2.5-flash",
            db=db,
        )

        save_message_sources(
            message_id=str(assistant_message.id),
            context_chunks=context_chunks,
            db=db,
        )

        update_query = text("""
            UPDATE conversations
            SET updated_at = NOW()
            WHERE id = :conversation_id;
        """)

        db.execute(
            update_query,
            {"conversation_id": conversation.id},
        )

        db.commit()

    except HTTPException:
        db.rollback()
        raise

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo generar la respuesta del tutor: {str(error)}",
        )

    sources = []

    for chunk in context_chunks:
        sources.append({
            "document_id": chunk["document_id"],
            "chunk_id": chunk["chunk_id"],
            "document_name": chunk["document_name"],
            "page_number": chunk["page_number"],
            "section_title": chunk["section_title"],
        })

    return {
        "conversation": {
            "id": str(conversation.id),
            "title": conversation.title,
            "folder_id": str(conversation.folder_id)
            if conversation.folder_id
            else None,
            "is_saved": conversation.is_saved,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
            "was_created": was_created,
        },
        "user_message": {
            "id": str(user_message.id),
            "role": user_message.role,
            "content": user_message.content,
            "created_at": user_message.created_at,
        },
        "assistant_message": {
            "id": str(assistant_message.id),
            "role": assistant_message.role,
            "content": assistant_message.content,
            "model_name": assistant_message.model_name,
            "created_at": assistant_message.created_at,
            "sources": sources,
        },
    }