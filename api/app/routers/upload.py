from pathlib import Path
import shutil
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.dataset import Dataset
from app.services.dataset_service import DatasetService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls",
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel files are allowed.",
        )

    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 10MB limit.",
        )

    stored_filename = f"{uuid4()}{extension}"
    filepath = UPLOAD_DIR / stored_filename

    with filepath.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    dataset = Dataset(
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_type=extension.replace(".", ""),
        file_size=file_size,
        owner_id=current_user.id,
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    analysis = DatasetService.analyze_dataset(str(filepath))

    return {
        "message": "File uploaded successfully",
        "dataset_id": dataset.id,
        "original_filename": dataset.original_filename,
        "stored_filename": dataset.stored_filename,
        "uploaded_at": dataset.uploaded_at,
        "analysis": analysis,
    }