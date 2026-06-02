from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user

router = APIRouter(
    prefix="/courses",
    tags=["Folders"],
)


class CreateFolderRequest(BaseModel):
    name: str


@router.get("/{course_id}/folders")
def get_course_folders(
    course_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT
            f.id,
            f.name,
            f.created_at,
            f.updated_at
        FROM folders f
        WHERE f.course_id = :course_id
          AND f.student_id = :student_id
        ORDER BY f.created_at ASC;
    """)

    result = db.execute(
        query,
        {
            "course_id": course_id,
            "student_id": current_user.id,
        },
    )

    folders = []

    for row in result:
        folders.append({
            "id": str(row.id),
            "name": row.name,
            "created_at": row.created_at,
            "updated_at": row.updated_at,
        })

    return {
        "course_id": course_id,
        "folders": folders,
    }


@router.post("/{course_id}/folders")
def create_course_folder(
    course_id: str,
    payload: CreateFolderRequest,
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
        RETURNING id, name, created_at, updated_at;
    """)

    try:
        new_folder = db.execute(
            insert_query,
            {
                "student_id": current_user.id,
                "course_id": course_id,
                "name": folder_name,
            },
        ).fetchone()

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la carpeta. Puede que ya exista una carpeta con ese nombre.",
        )

    return {
        "id": str(new_folder.id),
        "name": new_folder.name,
        "created_at": new_folder.created_at,
        "updated_at": new_folder.updated_at,
    }