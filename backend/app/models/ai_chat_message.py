from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class AIChatMessage(Base):
    __tablename__ = "ai_chat_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        Integer,
        ForeignKey(
            "ai_chat_sessions.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    role = Column(
        String(20),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    session = relationship(
        "AIChatSession",
        back_populates="messages"
    )