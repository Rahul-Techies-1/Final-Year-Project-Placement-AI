from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    UniqueConstraint
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


if TYPE_CHECKING:

    from app.models.user import User
    from app.models.dsa_problem import DSAProblem


class DSAProgress(Base):

    __tablename__ = "dsa_progress"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "problem_id",
            name="uq_user_dsa_problem"
        ),
    )

    id: Mapped[int] = mapped_column(
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
            "dsa_problems.id",
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
    # RELATIONSHIPS
    # ========================================================

    user: Mapped["User"] = relationship(
        "User"
    )

    problem: Mapped["DSAProblem"] = relationship(
        "DSAProblem",
        back_populates="progress"
    )