from pathlib import Path
import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.dataset import Dataset
from app.services.dataset_service import DatasetService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"],
)

UPLOAD_DIR = Path("uploads")


@router.get("/")
def get_datasets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    datasets = (
        db.query(Dataset)
        .filter(Dataset.owner_id == current_user.id)
        .order_by(Dataset.id.desc())
        .all()
    )

    return [
        {
            "id": d.id,
            "name": d.original_filename,
            "type": d.file_type,
            "size": d.file_size,
            "uploaded_at": d.uploaded_at,
        }
        for d in datasets
    ]


@router.get("/{dataset_id}")
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return {
        "id": dataset.id,
        "name": dataset.original_filename,
        "stored_filename": dataset.stored_filename,
        "file_type": dataset.file_type,
        "size": dataset.file_size,
        "uploaded_at": dataset.uploaded_at,
    }


@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    filepath = UPLOAD_DIR / dataset.stored_filename

    if filepath.exists():
        os.remove(filepath)

    db.delete(dataset)
    db.commit()

    return {"message": "Dataset deleted successfully"}


@router.get("/{dataset_id}/download")
def download_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    filepath = UPLOAD_DIR / dataset.stored_filename

    if not filepath.exists():
        raise HTTPException(
            status_code=404,
            detail="Dataset file not found on server",
        )

    return FileResponse(
        path=filepath,
        filename=dataset.original_filename,
        media_type="application/octet-stream",
    )


@router.get("/{dataset_id}/preview")
def preview_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    filepath = UPLOAD_DIR / dataset.stored_filename

    return DatasetService.analyze_dataset(
        str(filepath)
    )


@router.get("/{dataset_id}/summary")
def dataset_summary(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    filepath = UPLOAD_DIR / dataset.stored_filename

    summary = DatasetService.dataset_summary(
        str(filepath)
    )

    return summary