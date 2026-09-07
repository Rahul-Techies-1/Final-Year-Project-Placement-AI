from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:

    from app.models.user import User
    from app.models.mock_interview_question import MockInterviewQuestion


class MockInterview(Base):

    __tablename__ = "mock_interviews"


    # ========================================================
    # PRIMARY KEY
    # ========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    # ========================================================
    # STUDENT
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
    # INTERVIEW TYPE
    # ========================================================

    interview_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )


    # ========================================================
    # DIFFICULTY
    # ========================================================

    difficulty: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )


    # ========================================================
    # TOTAL QUESTIONS
    # ========================================================

    total_questions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )


    # ========================================================
    # QUESTIONS ANSWERED
    # ========================================================

    questions_answered: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )


    # ========================================================
    # SCORE
    # ========================================================

    score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )


    # ========================================================
    # STATUS
    # ========================================================

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="in_progress"
    )


    # ========================================================
    # STARTED AT
    # ========================================================

    started_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )


    # ========================================================
    # COMPLETED AT
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
        back_populates="mock_interviews"
    )


    # ========================================================
    # QUESTIONS RELATIONSHIP
    # ========================================================

    questions: Mapped[
        list["MockInterviewQuestion"]
    ] = relationship(
        "MockInterviewQuestion",
        back_populates="interview",
        cascade="all, delete-orphan",
        order_by="MockInterviewQuestion.question_order"
    )