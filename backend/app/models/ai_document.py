from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class AIDocument(Base):
    """
    Stores metadata for documents uploaded by students
    for the AI Mentor / RAG system.
    """

    __tablename__ = "ai_documents"

    # ========================================================
    # PRIMARY KEY
    # ========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ========================================================
    # DOCUMENT OWNER
    # ========================================================

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # ========================================================
    # FILE INFORMATION
    # ========================================================

    original_filename = Column(
        String(255),
        nullable=False
    )

    stored_filename = Column(
        String(255),
        nullable=False
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    # ========================================================
    # PROCESSING STATUS
    # ========================================================

    status = Column(
        String(30),
        nullable=False,
        default="uploaded"
    )

    # ========================================================
    # RAG INFORMATION
    # ========================================================

    chunk_count = Column(
        Integer,
        nullable=False,
        default=0
    )

    # ========================================================
    # TIMESTAMP
    # ========================================================

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    # ========================================================
    # RELATIONSHIP
    # ========================================================

    user = relationship(
        "User",
        back_populates="ai_documents"
    )