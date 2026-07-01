from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user

router = APIRouter(
    tags=["messages"],
)


class CreateMessageRequest(BaseModel):
    role: str
    content: str
    model_name: str | None = None
    tokens_input: int = 0
    tokens_output: int = 0


def validate_message_role(role: str):
    valid_roles = ["user", "assistant", "system"]

    if role not in valid_roles:
        raise HTTPException(
            status_code=400,
            detail="Rol de mensaje inválido. Usa: user, assistant o system.",
        )


def get_conversation_for_user(
    conversation_id: str,
    student_id,
    db: Session,
):
    query = text("""
        SELECT
            id,
            student_id,
            course_id,
            title,
            is_saved
        FROM conversations
        WHERE id = :conversation_id
          AND student_id = :student_id
        LIMIT 1;
    """)

    conversation = db.execute(
        query,
        {
            "conversation_id": conversation_id,
            "student_id": student_id,
        },
    ).fetchone()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversación no encontrada para este estudiante.",
        )

    return conversation


@router.get("/conversations/{conversation_id}/messages")
def get_conversation_messages(
    conversation_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    get_conversation_for_user(
        conversation_id=conversation_id,
        student_id=current_user.id,
        db=db,
    )

    query = text("""
        SELECT
            id,
            role,
            content,
            model_name,
            tokens_input,
            tokens_output,
            created_at
        FROM messages
        WHERE conversation_id = :conversation_id
        ORDER BY created_at ASC;
    """)

    result = db.execute(
        query,
        {"conversation_id": conversation_id},
    )

    messages = []

    for row in result:
        sources_result = db.execute(
            text("""
                SELECT
                    document_id,
                    chunk_id,
                    document_name,
                    page_number,
                    section_title,
                    similarity_score
                FROM message_sources
                WHERE message_id = :message_id
                ORDER BY similarity_score DESC NULLS LAST;
            """),
            {"message_id": row.id},
        )

        sources = [
            {
                "document_id": str(source.document_id) if source.document_id else None,
                "chunk_id": str(source.chunk_id) if source.chunk_id else None,
                "document_name": source.document_name,
                "page_number": source.page_number,
                "section_title": source.section_title,
                "similarity_score": float(source.similarity_score)
                if source.similarity_score is not None
                else None,
            }
            for source in sources_result
        ]

        messages.append({
            "id": str(row.id),
            "conversation_id": conversation_id,
            "role": row.role,
            "content": row.content,
            "model_name": row.model_name,
            "tokens_input": row.tokens_input,
            "tokens_output": row.tokens_output,
            "created_at": row.created_at,
            "sources": sources,
        })

    return {
        "conversation_id": conversation_id,
        "messages": messages,
    }


@router.post("/conversations/{conversation_id}/messages")
def create_conversation_message(
    conversation_id: str,
    payload: CreateMessageRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    role = payload.role.strip()
    content = payload.content.strip()

    validate_message_role(role)

    if not content:
        raise HTTPException(
            status_code=400,
            detail="El contenido del mensaje es obligatorio.",
        )

    conversation = get_conversation_for_user(
        conversation_id=conversation_id,
        student_id=current_user.id,
        db=db,
    )

    insert_query = text("""
        INSERT INTO messages (
            conversation_id,
            role,
            content,
            model_name,
            tokens_input,
            tokens_output,
            created_at
        )
        VALUES (
            :conversation_id,
            :role,
            :content,
            :model_name,
            :tokens_input,
            :tokens_output,
            clock_timestamp()
        )
        RETURNING
            id,
            role,
            content,
            model_name,
            tokens_input,
            tokens_output,
            created_at;
    """)

    update_conversation_query = text("""
        UPDATE conversations
        SET updated_at = NOW()
        WHERE id = :conversation_id;
    """)

    try:
        new_message = db.execute(
            insert_query,
            {
                "conversation_id": conversation.id,
                "role": role,
                "content": content,
                "model_name": payload.model_name,
                "tokens_input": payload.tokens_input,
                "tokens_output": payload.tokens_output,
            },
        ).fetchone()

        db.execute(
            update_conversation_query,
            {"conversation_id": conversation.id},
        )

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el mensaje.",
        )

    return {
        "id": str(new_message.id),
        "conversation_id": str(conversation.id),
        "role": new_message.role,
        "content": new_message.content,
        "model_name": new_message.model_name,
        "tokens_input": new_message.tokens_input,
        "tokens_output": new_message.tokens_output,
        "created_at": new_message.created_at,
    }