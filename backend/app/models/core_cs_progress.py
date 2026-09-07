from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.core_cs_problem import CoreCSProblem


class CoreCSProgress(Base):

    __tablename__ = "core_cs_progress"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    problem_id: Mapped[int] = mapped_column(
        ForeignKey(
            "core_cs_problems.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    # ========================================================
    # RELATIONSHIP WITH CORE CS PROBLEM
    # ========================================================

    problem: Mapped["CoreCSProblem"] = relationship(
        "CoreCSProblem",
        back_populates="progress"
    )