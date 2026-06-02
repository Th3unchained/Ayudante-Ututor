import hashlib

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import create_access_token, get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    query = text("""
        SELECT
            id,
            email,
            password_hash,
            full_name,
            role,
            is_active
        FROM users
        WHERE email = :email
        LIMIT 1;
    """)

    user = db.execute(query, {"email": payload.email}).fetchone()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Usuario inactivo.",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas.",
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
        },
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }