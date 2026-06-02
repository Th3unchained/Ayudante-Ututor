import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "ututor_local_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def create_access_token(data: dict) -> str:
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirado.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido.",
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    token_data = decode_access_token(token)

    query = text("""
        SELECT
            id,
            email,
            full_name,
            role,
            is_active
        FROM users
        WHERE id = :user_id
        LIMIT 1;
    """)

    user = db.execute(
        query,
        {"user_id": token_data["sub"]},
    ).fetchone()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Usuario inactivo.",
        )

    return user