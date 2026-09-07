from typing import TYPE_CHECKING, List

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.aptitude_question import AptitudeQuestion


class AptitudeTopic(Base):

    __tablename__ = "aptitude_topics"

    id: Mapped[int] = mapped_column(
        Integer,
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
        Integer,
        nullable=False,
        default=0
    )

    questions: Mapped[List["AptitudeQuestion"]] = relationship(
        "AptitudeQuestion",
        back_populates="topic",
        cascade="all, delete-orphan"
    )