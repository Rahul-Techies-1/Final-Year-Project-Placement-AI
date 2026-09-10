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


class AIChatSession(Base):
    __tablename__ = "ai_chat_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    title = Column(
        String(255),
        nullable=False,
        default="New AI Mentor Chat"
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="ai_chat_sessions"
    )

    messages = relationship(
        "AIChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="AIChatMessage.created_at"
    )