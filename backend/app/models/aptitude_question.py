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
    from app.models.aptitude_topic import AptitudeTopic
    from app.models.aptitude_progress import AptitudeProgress


class AptitudeQuestion(Base):

    __tablename__ = "aptitude_questions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey(
            "aptitude_topics.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    question: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    option_a: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    option_b: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    option_c: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    option_d: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    correct_answer: Mapped[str] = mapped_column(
        String(1),
        nullable=False
    )

    explanation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    difficulty: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )

    topic: Mapped["AptitudeTopic"] = relationship(
        "AptitudeTopic",
        back_populates="questions"
    )

    progress: Mapped[List["AptitudeProgress"]] = relationship(
        "AptitudeProgress",
        back_populates="question",
        cascade="all, delete-orphan"
    )