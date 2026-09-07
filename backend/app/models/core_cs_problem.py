from typing import TYPE_CHECKING, List

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    String,
    Text
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.core_cs_topic import CoreCSTopic
    from app.models.core_cs_progress import CoreCSProgress


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

    # ========================================================
    # RELATIONSHIP WITH CORE CS TOPIC
    # ========================================================

    topic: Mapped["CoreCSTopic"] = relationship(
        "CoreCSTopic",
        back_populates="problems"
    )

    # ========================================================
    # RELATIONSHIP WITH CORE CS PROGRESS
    # ========================================================

    progress: Mapped[List["CoreCSProgress"]] = relationship(
        "CoreCSProgress",
        back_populates="problem",
        cascade="all, delete-orphan"
    )