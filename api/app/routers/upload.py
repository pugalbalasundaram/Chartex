from pathlib import Path
import shutil
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.dataset import Dataset
from app.services.dataset_service import DatasetService
from app.services.storage_service import StorageService
from app.core.session import get_anonymous_session

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

# Storage Service instance
storage_service = StorageService()

ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls",
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/")
async def upload_dataset(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
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
    
    storage_service.save_upload_file(file, stored_filename)

    dataset = Dataset(
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_type=extension.replace(".", ""),
        file_size=file_size,
        session_id=session_id,
        analysis_status="PENDING",
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    # Trigger background analysis (background worker will download from storage if needed)
    # We pass the stored_filename instead of a local filepath
    background_tasks.add_task(
        DatasetService.generate_and_cache_analytics,
        dataset.id,
        stored_filename,
        db
    )

    return {
        "message": "File uploaded successfully, analysis in progress",
        "dataset_id": dataset.id,
        "original_filename": dataset.original_filename,
        "stored_filename": dataset.stored_filename,
        "uploaded_at": dataset.uploaded_at,
    }