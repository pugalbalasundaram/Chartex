from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY or SECRET_KEY == "your_super_secret_key_change_this":
    raise RuntimeError(
        "CRITICAL SECURITY ERROR: SECRET_KEY is either missing or set to the insecure default. "
        "You must generate a secure secret key and set it in the environment variables."
    )

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7)
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    """
    Generate a JWT access token.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire, "token_type": "access"})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


import secrets
import hashlib

def create_refresh_token():
    """
    Generate an opaque, cryptographically secure refresh token string.
    """
    return secrets.token_urlsafe(64)

def hash_token(token: str) -> str:
    """
    Generate a SHA-256 hash of a token string for safe database storage.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def generate_numeric_otp(length: int = 6) -> str:
    """
    Generate a cryptographically secure numeric OTP of given length.
    """
    # secrets.randbelow is secure
    return "".join(str(secrets.randbelow(10)) for _ in range(length))

def hash_otp(otp: str) -> str:
    """
    Generate a bcrypt slow hash of an OTP for safe database storage.
    """
    return pwd_context.hash(otp)