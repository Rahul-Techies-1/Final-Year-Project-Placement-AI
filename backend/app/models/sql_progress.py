from datetime import datetime

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


class SQLProgress(Base):

    __tablename__ = "sql_progress"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "problem_id",
            name="uq_user_sql_problem"
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
            "sql_problems.id",
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

    user = relationship(
        "User"
    )

    problem = relationship(
        "SQLProblem",
        back_populates="progress"
    )