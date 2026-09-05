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


# ============================================================
# CORE CS TOPIC
# ============================================================

class CoreCSTopic(Base):

    __tablename__ = "core_cs_topics"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    display_order: Mapped[int] = mapped_column(
        nullable=False,
        default=0
    )

    problems: Mapped[List["CoreCSProblem"]] = relationship(
        "CoreCSProblem",
        back_populates="topic",
        cascade="all, delete-orphan"
    )


# ============================================================
# CORE CS PROBLEM
# ============================================================

class CoreCSProblem(Base):

    __tablename__ = "core_cs_problems"

    id: Mapped[int] = mapped_column(
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
        Text,
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )

    topic: Mapped["CoreCSTopic"] = relationship(
        "CoreCSTopic",
        back_populates="problems"
    )

    progress: Mapped[List["CoreCSProgress"]] = relationship(
        "CoreCSProgress",
        back_populates="problem",
        cascade="all, delete-orphan"
    )