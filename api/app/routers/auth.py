from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Request
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta
from pydantic import BaseModel
import os

COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "true").lower() == "true"

from app.database.database import get_db
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.verification_otp import VerificationOTP
from app.schemas.user import UserCreate, UserResponse
from app.schemas.login import LoginRequest

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_token,
    generate_numeric_otp,
    hash_otp,
    REFRESH_TOKEN_EXPIRE_DAYS
)
from app.core.email import send_verification_email

from app.core.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

class VerifyEmailRequest(BaseModel):
    email: str
    otp: str

class ResendVerificationRequest(BaseModel):
    email: str

# ---------------------------
# User Signup
# ---------------------------
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    generic_response = {"detail": "If this email is eligible for registration, we've sent a verification code.", "email": user.email}

    if existing_user:
        if existing_user.email_verified:
            return generic_response
        else:
            otp_record = db.query(VerificationOTP).filter(VerificationOTP.user_id == existing_user.id).first()
            if otp_record:
                created_at = otp_record.expires_at - timedelta(minutes=10)
                if datetime.utcnow() < created_at + timedelta(seconds=60):
                    return generic_response
                db.delete(otp_record)
                db.commit()
            
            otp = generate_numeric_otp()
            expires_at = datetime.utcnow() + timedelta(minutes=10)
            
            verification_otp = VerificationOTP(
                user_id=existing_user.id,
                otp_hash=hash_otp(otp),
                expires_at=expires_at
            )
            db.add(verification_otp)
            db.commit()
            
            send_verification_email(existing_user.email, otp)
            return generic_response

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        email_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    otp = generate_numeric_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    verification_otp = VerificationOTP(
        user_id=new_user.id,
        otp_hash=hash_otp(otp),
        expires_at=expires_at
    )
    db.add(verification_otp)
    db.commit()
    
    send_verification_email(new_user.email, otp)

    return {"detail": "If this email is eligible for registration, we've sent a verification code.", "email": new_user.email}


# ---------------------------
# User Login
# ---------------------------
@router.post("/login")
def login(data: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
        
    if not user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="Email verification required"
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
        }
    )

    raw_refresh_token = create_refresh_token()
    session_id = str(uuid.uuid4())

    db_token = RefreshToken(
        user_id=user.id,
        hashed_token=hash_token(raw_refresh_token),
        session_id=session_id,
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        device_name=request.headers.get("Sec-CH-UA", "Unknown Device"),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("User-Agent"),
    )
    db.add(db_token)
    db.commit()

    # Set HttpOnly cookie for refresh token
    response.set_cookie(
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }

# ---------------------------
# Verify OTP
# ---------------------------
@router.post("/verify-email")
def verify_email(data: VerifyEmailRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")
    
    if user.email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
        
    otp_record = db.query(VerificationOTP).filter(VerificationOTP.user_id == user.id).first()
    if not otp_record:
        raise HTTPException(status_code=400, detail="No verification requested")
        
    if otp_record.attempt_count >= 5:
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=400, detail="Too many incorrect attempts. Please request a new code.")
        
    if otp_record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="This code has expired. Please request a new code.")
        
    if not verify_password(data.otp, otp_record.otp_hash):
        otp_record.attempt_count += 1
        db.commit()
        raise HTTPException(status_code=400, detail=f"Incorrect verification code. You have {5 - otp_record.attempt_count} attempts remaining.")
        
    user.email_verified = True
    db.delete(otp_record)
    
    # Authenticate the user directly
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}
    )
    raw_refresh_token = create_refresh_token()
    session_id = str(uuid.uuid4())
    db_token = RefreshToken(
        user_id=user.id,
        hashed_token=hash_token(raw_refresh_token),
        session_id=session_id,
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        device_name=request.headers.get("Sec-CH-UA", "Unknown Device"),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("User-Agent"),
    )
    db.add(db_token)
    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }

# ---------------------------
# Resend OTP
# ---------------------------
@router.post("/resend-verification")
def resend_verification(data: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or user.email_verified:
        # Don't reveal if user exists or not if they try to bypass, just return success
        return {"detail": "If your email is registered, a new code has been sent."}
        
    otp_record = db.query(VerificationOTP).filter(VerificationOTP.user_id == user.id).first()
    if otp_record:
        # Check cooldown (60 seconds)
        # We can calculate when it was created by subtracting 10 mins from expires_at
        created_at = otp_record.expires_at - timedelta(minutes=10)
        if datetime.utcnow() < created_at + timedelta(seconds=60):
            raise HTTPException(status_code=429, detail="Please wait before requesting another code.")
        db.delete(otp_record)
        db.commit()
        
    otp = generate_numeric_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    new_otp_record = VerificationOTP(
        user_id=user.id,
        otp_hash=hash_otp(otp),
        expires_at=expires_at
    )
    db.add(new_otp_record)
    db.commit()
    
    send_verification_email(user.email, otp)
    
    return {"detail": "If your email is registered, a new code has been sent."}

@router.post("/refresh")
def refresh_token(
    request: Request,
    response: Response,
    refresh_token: str | None = Cookie(None),
    db: Session = Depends(get_db)
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing.")

    hashed = hash_token(refresh_token)
    db_token = db.query(RefreshToken).filter(RefreshToken.hashed_token == hashed).first()

    if not db_token:
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    # Reuse detection
    if db_token.revoked:
        # Revoke the entire session family
        db.query(RefreshToken).filter(RefreshToken.session_id == db_token.session_id).update({"revoked": True})
        db.commit()
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Security alert: Token reuse detected. Session revoked.")

    if db_token.expires_at < datetime.utcnow():
        response.delete_cookie("refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")

    # Mark current token as revoked
    db_token.revoked = True
    
    # Generate new token
    new_raw_token = create_refresh_token()
    
    new_db_token = RefreshToken(
        user_id=db_token.user_id,
        hashed_token=hash_token(new_raw_token),
        session_id=db_token.session_id,
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        device_name=request.headers.get("Sec-CH-UA", db_token.device_name),
        ip_address=request.client.host if request.client else db_token.ip_address,
        user_agent=request.headers.get("User-Agent", db_token.user_agent),
    )
    
    db.add(new_db_token)
    db.commit()

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
        }
    )

    response.set_cookie(
        key="refresh_token",
        value=new_raw_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout(
    response: Response,
    refresh_token: str | None = Cookie(None),
    db: Session = Depends(get_db)
):
    if refresh_token:
        hashed = hash_token(refresh_token)
        db_token = db.query(RefreshToken).filter(RefreshToken.hashed_token == hashed).first()
        if db_token:
            db.query(RefreshToken).filter(RefreshToken.session_id == db_token.session_id).update({"revoked": True})
            db.commit()

    response.delete_cookie(
        key="refresh_token",
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE
    )
    return {"message": "Logged out"}


@router.post("/logout/all")
def logout_all(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(RefreshToken).filter(RefreshToken.user_id == current_user.id).update({"revoked": True})
    db.commit()
    
    response.delete_cookie(
        key="refresh_token",
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE
    )
    return {"message": "Logged out of all devices"}


# ---------------------------
# Current Logged-in User
# ---------------------------
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
    }