from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:

    from app.models.user import User
    from app.models.aptitude_question import AptitudeQuestion


class AptitudeProgress(Base):

    __tablename__ = "aptitude_progress"


    # ========================================================
    # PRIMARY KEY
    # ========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    # ========================================================
    # USER
    # ========================================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )


    # ========================================================
    # QUESTION
    # ========================================================

    question_id: Mapped[int] = mapped_column(
        ForeignKey(
            "aptitude_questions.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )


    # ========================================================
    # COMPLETION STATUS
    # ========================================================

    completed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )


    # ========================================================
    # COMPLETION TIMESTAMP
    # ========================================================

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )


    # ========================================================
    # USER RELATIONSHIP
    # ========================================================

    user: Mapped["User"] = relationship(
        "User",
        back_populates="aptitude_progress"
    )


    # ========================================================
    # QUESTION RELATIONSHIP
    # ========================================================

    question: Mapped["AptitudeQuestion"] = relationship(
        "AptitudeQuestion",
        back_populates="progress"
    )