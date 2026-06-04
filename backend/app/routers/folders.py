from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user


router = APIRouter(
    prefix="/courses/{course_id}/folders",
    tags=["Folders"],
)


class FolderCreateRequest(BaseModel):
    name: str


@router.get("")
def get_course_folders(
    course_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course_query = text("""
        SELECT
            sc.id
        FROM student_courses sc
        WHERE sc.course_id = :course_id
          AND sc.student_id = :student_id
        LIMIT 1;
    """)

    course_enrollment = db.execute(
        course_query,
        {
            "course_id": course_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not course_enrollment:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no está inscrito en este curso.",
        )

    folders_query = text("""
        SELECT
            id,
            name,
            course_id,
            created_at,
            updated_at
        FROM folders
        WHERE course_id = :course_id
          AND student_id = :student_id
        ORDER BY created_at ASC;
    """)

    folders = db.execute(
        folders_query,
        {
            "course_id": course_id,
            "student_id": current_user.id,
        },
    ).fetchall()

    return {
        "folders": [
            {
                "id": str(folder.id),
                "name": folder.name,
                "course_id": str(folder.course_id),
                "created_at": folder.created_at,
                "updated_at": folder.updated_at,
            }
            for folder in folders
        ]
    }


@router.post("")
def create_folder(
    course_id: str,
    payload: FolderCreateRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    folder_name = payload.name.strip()

    if not folder_name:
        raise HTTPException(
            status_code=400,
            detail="El nombre de la carpeta es obligatorio.",
        )

    course_query = text("""
        SELECT
            sc.id
        FROM student_courses sc
        WHERE sc.course_id = :course_id
          AND sc.student_id = :student_id
        LIMIT 1;
    """)

    course_enrollment = db.execute(
        course_query,
        {
            "course_id": course_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not course_enrollment:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no está inscrito en este curso.",
        )

    try:
        insert_query = text("""
            INSERT INTO folders (
                student_id,
                course_id,
                name
            )
            VALUES (
                :student_id,
                :course_id,
                :name
            )
            RETURNING
                id,
                name,
                course_id,
                created_at,
                updated_at;
        """)

        folder = db.execute(
            insert_query,
            {
                "student_id": current_user.id,
                "course_id": course_id,
                "name": folder_name,
            },
        ).fetchone()

        db.commit()

        return {
            "id": str(folder.id),
            "name": folder.name,
            "course_id": str(folder.course_id),
            "created_at": folder.created_at,
            "updated_at": folder.updated_at,
        }

    except Exception as error:
        db.rollback()

        error_text = str(error)

        if "uq_folder_student_course_name" in error_text:
            raise HTTPException(
                status_code=409,
                detail="Ya existe una carpeta con ese nombre en este curso.",
            )

        raise HTTPException(
            status_code=500,
            detail=f"No se pudo crear la carpeta: {error_text}",
        )


@router.delete("/{folder_id}")
def delete_folder(
    course_id: str,
    folder_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    folder_query = text("""
        SELECT
            id,
            name,
            course_id,
            student_id
        FROM folders
        WHERE id = :folder_id
          AND course_id = :course_id
          AND student_id = :student_id
        LIMIT 1;
    """)

    folder = db.execute(
        folder_query,
        {
            "folder_id": folder_id,
            "course_id": course_id,
            "student_id": current_user.id,
        },
    ).fetchone()

    if not folder:
        raise HTTPException(
            status_code=404,
            detail="Carpeta no encontrada.",
        )

    try:
        db.execute(
            text("""
                DELETE FROM conversations
                WHERE folder_id = :folder_id
                  AND course_id = :course_id
                  AND student_id = :student_id;
            """),
            {
                "folder_id": folder_id,
                "course_id": course_id,
                "student_id": current_user.id,
            },
        )

        db.execute(
            text("""
                DELETE FROM folders
                WHERE id = :folder_id
                  AND course_id = :course_id
                  AND student_id = :student_id;
            """),
            {
                "folder_id": folder_id,
                "course_id": course_id,
                "student_id": current_user.id,
            },
        )

        db.commit()

        return {
            "message": "Carpeta eliminada correctamente.",
            "folder_id": folder_id,
        }

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo eliminar la carpeta: {str(error)}",
        )