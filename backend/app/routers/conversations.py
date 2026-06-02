from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user

router = APIRouter(
    tags=["Conversations"],
)


class CreateConversationRequest(BaseModel):
    title: str = "Nueva consulta"
    folder_id: str | None = None
    is_saved: bool = True


@router.get("/courses/{course_id}/conversations")
def get_course_conversations(
    course_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT
            conv.id,
            conv.title,
            conv.folder_id,
            f.name AS folder_name,
            conv.is_saved,
            conv.created_at,
            conv.updated_at
        FROM conversations conv
        LEFT JOIN folders f ON f.id = conv.folder_id
        WHERE conv.course_id = :course_id
          AND conv.student_id = :student_id
        ORDER BY conv.created_at DESC;
    """)

    result = db.execute(
        query,
        {
            "course_id": course_id,
            "student_id": current_user.id,
        },
    )

    conversations = []

    for row in result:
        conversations.append({
            "id": str(row.id),
            "title": row.title,
            "folder_id": str(row.folder_id) if row.folder_id else None,
            "folder_name": row.folder_name,
            "is_saved": row.is_saved,
            "created_at": row.created_at,
            "updated_at": row.updated_at,
        })

    return {
        "course_id": course_id,
        "conversations": conversations,
    }


@router.post("/courses/{course_id}/conversations")
def create_conversation(
    course_id: str,
    payload: CreateConversationRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    title = payload.title.strip() if payload.title else "Nueva consulta"

    course_query = text("""
        SELECT id
        FROM student_courses
        WHERE student_id = :student_id
          AND course_id = :course_id
        LIMIT 1;
    """)

    course = db.execute(
        course_query,
        {
            "student_id": current_user.id,
            "course_id": course_id,
        },
    ).fetchone()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no está inscrito en este curso.",
        )

    if payload.folder_id:
        folder_query = text("""
            SELECT id
            FROM folders
            WHERE id = :folder_id
              AND student_id = :student_id
              AND course_id = :course_id
            LIMIT 1;
        """)

        folder = db.execute(
            folder_query,
            {
                "folder_id": payload.folder_id,
                "student_id": current_user.id,
                "course_id": course_id,
            },
        ).fetchone()

        if not folder:
            raise HTTPException(
                status_code=404,
                detail="Carpeta no encontrada para este estudiante y curso.",
            )

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
            :is_saved
        )
        RETURNING id, title, folder_id, is_saved, created_at, updated_at;
    """)

    try:
        new_conversation = db.execute(
            insert_query,
            {
                "student_id": current_user.id,
                "course_id": course_id,
                "folder_id": payload.folder_id,
                "title": title,
                "is_saved": payload.is_saved,
            },
        ).fetchone()

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la conversación.",
        )

    return {
        "id": str(new_conversation.id),
        "title": new_conversation.title,
        "folder_id": str(new_conversation.folder_id)
        if new_conversation.folder_id
        else None,
        "is_saved": new_conversation.is_saved,
        "created_at": new_conversation.created_at,
        "updated_at": new_conversation.updated_at,
    }


@router.get("/conversations/{conversation_id}")
def get_conversation_detail(
    conversation_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation_query = text("""
        SELECT
            conv.id,
            conv.title,
            conv.course_id,
            c.name AS course_name,
            conv.folder_id,
            f.name AS folder_name,
            conv.is_saved,
            conv.created_at,
            conv.updated_at
        FROM conversations conv
        JOIN courses c ON c.id = conv.course_id
        LEFT JOIN folders f ON f.id = conv.folder_id
        WHERE conv.id = :conversation_id
          AND conv.student_id = :student_id
        LIMIT 1;
    """)

    conversation = db.execute(
        conversation_query,
        {
            "conversation_id": conversation_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversación no encontrada.",
        )

    messages_query = text("""
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

    messages_result = db.execute(
        messages_query,
        {"conversation_id": conversation_id},
    )

    messages = []

    for message in messages_result:
        sources_query = text("""
            SELECT
                id,
                document_name,
                page_number,
                section_title,
                similarity_score
            FROM message_sources
            WHERE message_id = :message_id
            ORDER BY similarity_score DESC NULLS LAST;
        """)

        sources_result = db.execute(
            sources_query,
            {"message_id": message.id},
        )

        sources = []

        for source in sources_result:
            sources.append({
                "id": str(source.id),
                "document_name": source.document_name,
                "page_number": source.page_number,
                "section_title": source.section_title,
                "similarity_score": float(source.similarity_score)
                if source.similarity_score is not None
                else None,
            })

        messages.append({
            "id": str(message.id),
            "role": message.role,
            "content": message.content,
            "model_name": message.model_name,
            "tokens_input": message.tokens_input,
            "tokens_output": message.tokens_output,
            "created_at": message.created_at,
            "sources": sources,
        })

    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "course_id": str(conversation.course_id),
        "course_name": conversation.course_name,
        "folder_id": str(conversation.folder_id)
        if conversation.folder_id
        else None,
        "folder_name": conversation.folder_name,
        "is_saved": conversation.is_saved,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": messages,
    }
class UpdateConversationRequest(BaseModel):
    title: str | None = None
    folder_id: str | None = None
    is_saved: bool | None = None


@router.patch("/conversations/{conversation_id}")
def update_conversation(
    conversation_id: str,
    payload: UpdateConversationRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation_query = text("""
        SELECT id, course_id
        FROM conversations
        WHERE id = :conversation_id
          AND student_id = :student_id
        LIMIT 1;
    """)

    conversation = db.execute(
        conversation_query,
        {
            "conversation_id": conversation_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversación no encontrada.",
        )

    if payload.folder_id:
        folder_query = text("""
            SELECT id
            FROM folders
            WHERE id = :folder_id
              AND student_id = :student_id
              AND course_id = :course_id
            LIMIT 1;
        """)

        folder = db.execute(
            folder_query,
            {
                "folder_id": payload.folder_id,
                "student_id": current_user.id,
                "course_id": conversation.course_id,
            },
        ).fetchone()

        if not folder:
            raise HTTPException(
                status_code=404,
                detail="Carpeta no encontrada para esta conversación.",
            )

    update_query = text("""
        UPDATE conversations
        SET
            title = COALESCE(:title, title),
            folder_id = COALESCE(:folder_id, folder_id),
            is_saved = COALESCE(:is_saved, is_saved),
            updated_at = NOW()
        WHERE id = :conversation_id
          AND student_id = :student_id
        RETURNING id, title, folder_id, is_saved, created_at, updated_at;
    """)

    updated = db.execute(
        update_query,
        {
            "conversation_id": conversation_id,
            "student_id": current_user.id,
            "title": payload.title,
            "folder_id": payload.folder_id,
            "is_saved": payload.is_saved,
        },
    ).fetchone()

    db.commit()

    return {
        "id": str(updated.id),
        "title": updated.title,
        "folder_id": str(updated.folder_id) if updated.folder_id else None,
        "is_saved": updated.is_saved,
        "created_at": updated.created_at,
        "updated_at": updated.updated_at,
    }

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation_query = text("""
        SELECT id
        FROM conversations
        WHERE id = :conversation_id
          AND student_id = :student_id
        LIMIT 1;
    """)

    conversation = db.execute(
        conversation_query,
        {
            "conversation_id": conversation_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversación no encontrada.",
        )

    delete_query = text("""
        DELETE FROM conversations
        WHERE id = :conversation_id
          AND student_id = :student_id;
    """)

    try:
        db.execute(
            delete_query,
            {
                "conversation_id": conversation_id,
                "student_id": current_user.id,
            },
        )

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo eliminar la conversación.",
        )

    return {
        "message": "Conversación eliminada correctamente.",
        "conversation_id": conversation_id,
    }