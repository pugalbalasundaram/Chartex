from datetime import datetime

from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: int
    original_filename: str
    stored_filename: str
    file_type: str
    file_size: int
    uploaded_at: datetime
    owner_id: int

    class Config:
        from_attributes = True