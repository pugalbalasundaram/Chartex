from pathlib import Path
import os

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.dataset import Dataset
from app.services.dataset_service import DatasetService
from app.services.dataset_profiler import DatasetProfiler
from app.core.session import get_anonymous_session

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"],
)

UPLOAD_DIR = Path("uploads")


@router.get("/")
def get_datasets(db: Session = Depends(get_db), session_id: str = Depends(get_anonymous_session)):
    datasets = (
        db.query(Dataset)
        .filter(Dataset.session_id == session_id)
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
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
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
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    from app.services.storage_service import StorageService
    storage_service = StorageService()
    try:
        storage_service.delete_file(dataset.stored_filename)
    except Exception:
        pass

    db.delete(dataset)
    db.commit()

    return {"message": "Dataset deleted successfully"}


@router.get("/{dataset_id}/download")
def download_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    from app.services.storage_service import StorageService
    storage_service = StorageService()
    
    try:
        local_path = storage_service.get_file_path_for_reading(dataset.stored_filename)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Dataset file not found on remote storage",
        )

    return FileResponse(
        path=local_path,
        filename=dataset.original_filename,
        media_type="application/octet-stream",
    )


@router.get("/{dataset_id}/preview")
def preview_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )


    return DatasetService.analyze_dataset(
        dataset.stored_filename
    )


@router.get("/{dataset_id}/profile")
def profile_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    try:
        df = DatasetService._load_dataset(dataset.stored_filename)
        profile_data = DatasetProfiler.profile(df)
        return profile_data
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to profile this dataset.",
        )


@router.get("/{dataset_id}/summary")
def dataset_summary(
    dataset_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )


    summary = DatasetService.dataset_summary(
        dataset.stored_filename
    )

    return summary

@router.get("/{dataset_id}/analytics")
def get_dataset_analytics(
    dataset_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    if dataset.analysis_status == "COMPLETED" and dataset.analysis_cache:
        return dataset.analysis_cache

    if dataset.analysis_status == "FAILED":
        raise HTTPException(
            status_code=500,
            detail="Analytics generation failed for this dataset.",
        )

    # If it's PENDING, check if we need to trigger it.
    # To be safe, if it's been pending for a while, we can trigger it again, but
    # it's simpler to just always trigger it if we hit this endpoint and it's not COMPLETED.
    # But that might cause duplicate runs.
    # Given we just added this feature, let's just trigger it for any dataset that doesn't have it.

    if dataset.analysis_status == "PENDING" and not dataset.analysis_cache:
        # Trigger it in background just in case it wasn't running
        background_tasks.add_task(
            DatasetService.generate_and_cache_analytics,
            dataset.id,
            dataset.stored_filename,
            db
        )

    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=202,
        content={"message": "Analysis is in progress", "status": "PENDING"}
    )

@router.get("/{dataset_id}/data")
def get_dataset_data(
    dataset_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_anonymous_session),
    limit: int = 1000,
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.session_id == session_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    try:
        df = DatasetService._load_dataset(dataset.stored_filename)
        
        # Replace infinity and NaN with None (null in JSON)
        import numpy as np
        df = df.replace([np.inf, -np.inf], None)
        df = df.where(df.notnull(), None)
        
        data = df.head(limit).to_dict(orient="records")
        return {"data": data}
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to load dataset data.")
