from fastapi import APIRouter, Body, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.exc import OperationalError
from app.services.email_service import send_password_reset, send_otp
from app.core.security import encode_jwt, decode_jwt
from app.repositories.user_repository import UserRepository
from app.core.dependency import get_db_session
from app.services.password_utils import hash_password, verify_password
from app.services.password_strength import check_password_strength, is_password_strong_enough
from datetime import datetime, timedelta
import time
from sqlalchemy.ext.asyncio import AsyncSession
import random

router = APIRouter()


class PasswordResetRequest(BaseModel):
    email: str

    def validate_email(self) -> bool:
        return "@" in (self.email or "")


@router.post('/auth/password-reset')
async def password_reset(req: PasswordResetRequest = Body(...), db: AsyncSession = Depends(get_db_session)):
    """Initiate password reset by sending link if user exists."""
    if not req.validate_email():
        raise HTTPException(status_code=400, detail="Invalid email")

    repo = UserRepository(db)
    user = await repo.get_by_email(req.email)
    
    # silently succeed even if user doesn't exist (security best practice)
    if not user:
        return {"status": "ok", "message": "If user exists, reset link will be sent"}

    # generate short-lived token (5 minutes)
    payload = {"sub": req.email, "type": "password_reset", "exp": int(time.time()) + 300}
    token = encode_jwt(payload)

    # Only persist reset tracking for known users. Unknown emails should still
    # return a safe success response without crashing the request pipeline.
    if user:
        await repo.set_reset_token_expiry(user, datetime.utcnow() + timedelta(minutes=5))

    ok = send_password_reset(req.email, token)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to send reset email")
    return {"status": "ok"}


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


@router.post('/auth/password-reset/confirm')
async def password_reset_confirm(req: PasswordResetConfirm, db: AsyncSession = Depends(get_db_session)):
    """Confirm password reset by validating token and updating password."""
    try:
        payload = decode_jwt(req.token)
        if payload.get('type') != 'password_reset':
            raise Exception('invalid token')
        email = payload.get('sub')
    except Exception:
        raise HTTPException(status_code=400, detail='Invalid or expired token')

    repo = UserRepository(db)
    user = await repo.get_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    # Check token expiry from database
    if user.reset_token_expires_at and user.reset_token_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail='Reset link expired')

    # Validate password strength
    strength_info = check_password_strength(req.new_password)
    if not is_password_strong_enough(req.new_password):
        raise HTTPException(status_code=400, detail=f"Password too weak: {', '.join(strength_info['feedback'])}")

    # Check if password was used before
    if user.password_previous and verify_password(req.new_password, user.password_previous):
        raise HTTPException(status_code=400, detail="Password was recently used. Please try a different password")

    # Update password
    ph = hash_password(req.new_password)
    await repo.set_password_hash(user, ph)
    await repo.set_reset_token_expiry(user, None)  # clear token expiry
    
    return {"status": "ok"}


class OTPRequest(BaseModel):
    email: str


@router.post('/auth/request-otp')
async def request_otp(req: OTPRequest, db: AsyncSession = Depends(get_db_session)):
    """Request OTP for password reset (for users who want 2FA on password reset)."""
    repo = UserRepository(db)
    user = await repo.get_by_email(req.email)
    if not user:
        # silently succeed (security best practice)
        return {"status": "ok", "message": "If user exists, OTP will be sent"}
    
    code = f"{random.randint(100000,999999)}"
    expires = datetime.utcnow() + timedelta(minutes=10)
    await repo.set_otp(user, code, expires)
    send_otp(req.email, code)
    return {"status": "ok"}


class OTPVerify(BaseModel):
    email: str
    code: str


@router.post('/auth/verify-otp')
async def verify_otp(req: OTPVerify, db: AsyncSession = Depends(get_db_session)):
    """Verify OTP code and issue session token."""
    repo = UserRepository(db)
    user = await repo.get_by_email(req.email)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    if not user.otp_code or not user.otp_expires_at:
        raise HTTPException(status_code=400, detail='No OTP requested')
    if str(user.otp_code) != str(req.code):
        raise HTTPException(status_code=400, detail='Invalid code')
    if user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail='Code expired')
    # clear otp and return jwt
    await repo.clear_otp(user)
    token = encode_jwt({"sub": user.email or user.username, "role": user.role or 'ANALYST'})
    return {
        "status": "ok", 
        "token": token, 
        "role": user.role or 'ANALYST',
        "username": user.username or user.email,
        "email": user.email
    }


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post('/auth/login')
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db_session)):
    """Authenticate user with two-step OTP verification."""
    repo = UserRepository(db)
    try:
        # support username as email
        user = await repo.get_by_email(req.username) or await repo.get_by_username(req.username)
    except OperationalError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Please ensure MySQL is running and reachable.",
        )

    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    if not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid credentials')

    # Send OTP to all users (two-step authentication)
    code = f"{random.randint(100000,999999)}"
    expires = datetime.utcnow() + timedelta(minutes=10)
    try:
        await repo.set_otp(user, code, expires)
    except OperationalError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Please ensure MySQL is running and reachable.",
        )

    # Try to send email, but don't fail if email fails
    send_otp(user.email or user.username, code)

    return {
        "status": "otp_required",
        "requires_otp": True,
        "otp_required": True,
        "message": "Verification code sent to your email"
    }
