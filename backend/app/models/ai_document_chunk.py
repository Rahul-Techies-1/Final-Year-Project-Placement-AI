from sqlalchemy import (
    JSON,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.database.base import Base


class AIDocumentChunk(Base):
    """
    Stores text chunks (and their embeddings) of PDFs uploaded
    to the AI Mentor. Replaces the local ChromaDB folder, because
    Render's disk is wiped on every restart/redeploy.
    """

    __tablename__ = "ai_document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    document_id = Column(
        Integer,
        ForeignKey("ai_documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    filename = Column(String(255), nullable=False)

    chunk_index = Column(Integer, nullable=False)

    content = Column(Text, nullable=False)

    # list[float] or NULL (NULL -> keyword search fallback)
    embedding = Column(JSON, nullable=True)