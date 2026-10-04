from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import Token, UserCreate, UserLogin, UserOut
from ..security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])


def _format_user_out(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": user.full_name or user.username,
        "full_name": user.full_name or user.username,
        "phone": user.phone or "",
        "city": user.city or "New Delhi",
        "role": user.role or "Prospective Adoptive Parent",
        "created_at": user.created_at,
    }


@router.post("/register", status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    username = (data.username or data.email).strip().lower()
    name = (data.name or data.username or email.split('@')[0]).strip()

    # Check if user with same email or username exists
    existing = db.scalar(select(User).where(or_(User.email == email, User.username == username)))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email or username already exists. Please log in."
        )

    user = User(
        username=username,
        email=email,
        full_name=name,
        phone=data.phone or "",
        city=data.city or "New Delhi",
        role=data.role or "Prospective Adoptive Parent",
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.username)
    return {
        "success": True,
        "message": "User registered successfully",
        "user_id": user.id,
        "access_token": token,
        "token_type": "bearer",
        "user": _format_user_out(user)
    }


@router.post("/login")
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    # Support both JSON payload and OAuth2 Form data
    login_identifier = None
    password = None

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            login_identifier = body.get("email") or body.get("username")
            password = body.get("password")
        except Exception:
            pass
    elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        form = await request.form()
        login_identifier = form.get("username") or form.get("email")
        password = form.get("password")

    if not login_identifier or not password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Missing email/username or password")

    identifier = str(login_identifier).strip().lower()
    user = db.scalar(select(User).where(or_(User.email == identifier, User.username == identifier)))

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email/username or password")

    token = create_access_token(user.username)
    return {
        "success": True,
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": _format_user_out(user)
    }


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "success": True,
        "user": _format_user_out(user)
    }
