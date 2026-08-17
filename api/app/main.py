from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from app.database.database import Base, engine

# Import all models so SQLAlchemy can create their tables
from app.models.user import User
from app.models.dataset import Dataset
from app.models.refresh_token import RefreshToken

# Routers
from app.routers.auth import router as auth_router
from app.routers.upload import router as upload_router
from app.routers.datasets import router as datasets_router
from app.routers.chat import router as chat_router

app = FastAPI(
    title="Charex API",
    version="1.0.0",
    description="AI-Native Analytics Platform",
)

# Ensure database tables are created via Alembic migrations, not create_all
# Base.metadata.create_all(bind=engine)

import os

allowed_origins_str = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_str:
    origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]
else:
    # Fallback to local development origins if not configured
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "Welcome to Charex API 🚀",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }


# Register Routers
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(datasets_router)
app.include_router(chat_router)