from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class CoreCSProblem(Base):

    __tablename__ = "core_cs_problems"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey(
            "core_cs_topics.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    difficulty: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    external_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )