from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)

    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    analysis_status = Column(String, default="PENDING")
    analysis_cache = Column(JSON, nullable=True)

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )
    
    session_id = Column(
        String, 
        nullable=True, 
        index=True
    )

    owner = relationship("User", back_populates="datasets")