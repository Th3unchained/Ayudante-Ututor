from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user

router = APIRouter(
    prefix="/students",
    tags=["Students"],
)


@router.get("/me/courses")
def get_my_courses(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT
            c.id,
            c.name,
            c.code,
            c.description,
            c.is_active
        FROM student_courses sc
        JOIN courses c ON c.id = sc.course_id
        WHERE sc.student_id = :student_id
        ORDER BY c.name;
    """)

    result = db.execute(
        query,
        {"student_id": current_user.id},
    )

    courses = []

    for row in result:
        courses.append({
            "id": str(row.id),
            "name": row.name,
            "code": row.code,
            "description": row.description,
            "is_active": row.is_active,
        })

    return {
        "student": current_user.email,
        "courses": courses,
    }