from typing import List

from sqlalchemy import (
    Boolean,
    ForeignKey,
    String,
    Text
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


class DSAProblem(Base):

    __tablename__ = "dsa_problems"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey(
            "dsa_topics.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    difficulty: Mapped[str] = mapped_column(
        String(20),
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


    # ========================================================
    # RELATIONSHIPS
    # ========================================================

    topic: Mapped["DSATopic"] = relationship(
        "DSATopic",
        back_populates="problems"
    )

    progress: Mapped[List["DSAProgress"]] = relationship(
        "DSAProgress",
        back_populates="problem",
        cascade="all, delete-orphan"
    )