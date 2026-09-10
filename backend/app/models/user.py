from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:

    from app.models.aptitude_progress import AptitudeProgress
    from app.models.mock_interview import MockInterview


class User(Base):

    __tablename__ = "users"


    # ========================================================
    # BASIC USER INFORMATION
    # ========================================================

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    full_name: Mapped[str] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )


    # ========================================================
    # ROLE
    # ========================================================

    role: Mapped[str] = mapped_column(
        String(50),
        default="student",
        nullable=False
    )


    # ========================================================
    # STUDENT PROFILE
    # ========================================================

    college: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    branch: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    semester: Mapped[int | None] = mapped_column(
        nullable=True
    )

    skills: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    bio: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True
    )


    # ========================================================
    # RECRUITER RELATIONSHIPS
    # ========================================================

    jobs = relationship(
        "Job",
        back_populates="recruiter",
        cascade="all, delete"
    )


    # ========================================================
    # APPLICATION RELATIONSHIP
    # ========================================================

    applications = relationship(
        "Application",
        back_populates="student",
        cascade="all, delete"
    )


    # ========================================================
    # APTITUDE PROGRESS
    # ========================================================

    aptitude_progress: Mapped[
        list["AptitudeProgress"]
    ] = relationship(
        "AptitudeProgress",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # ========================================================
    # MOCK INTERVIEW RELATIONSHIP
    # ========================================================

    mock_interviews: Mapped[
        list["MockInterview"]
    ] = relationship(
        "MockInterview",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    ai_documents = relationship(
        "AIDocument",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    ai_chat_sessions = relationship(
        "AIChatSession",
        back_populates="user",
        cascade="all, delete-orphan"
    )