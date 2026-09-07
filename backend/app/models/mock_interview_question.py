from typing import TYPE_CHECKING

from sqlalchemy import (
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

    from app.models.mock_interview import MockInterview


class MockInterviewQuestion(Base):

    __tablename__ = "mock_interview_questions"


    # ========================================================
    # PRIMARY KEY
    # ========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    # ========================================================
    # INTERVIEW ID
    # ========================================================

    interview_id: Mapped[int] = mapped_column(
        ForeignKey(
            "mock_interviews.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )


    # ========================================================
    # QUESTION
    # ========================================================

    question: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )


    # ========================================================
    # QUESTION TYPE
    # ========================================================

    question_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )


    # ========================================================
    # EXPECTED ANSWER
    # ========================================================

    expected_answer: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


    # ========================================================
    # STUDENT ANSWER
    # ========================================================

    student_answer: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


    # ========================================================
    # SCORE
    # ========================================================

    score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )


    # ========================================================
    # AI / INTERVIEW FEEDBACK
    # ========================================================

    feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


    # ========================================================
    # QUESTION ORDER
    # ========================================================

    question_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )


    # ========================================================
    # INTERVIEW RELATIONSHIP
    # ========================================================

    interview: Mapped["MockInterview"] = relationship(
        "MockInterview",
        back_populates="questions"
    )