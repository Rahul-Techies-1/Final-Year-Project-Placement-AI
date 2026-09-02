from typing import List

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class DSATopic(Base):

    __tablename__ = "dsa_topics"

    id: Mapped[int] = mapped_column(
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
        nullable=False,
        default=0
    )


    # ========================================================
    # RELATIONSHIPS
    # ========================================================

    problems: Mapped[List["DSAProblem"]] = relationship(
        "DSAProblem",
        back_populates="topic",
        cascade="all, delete-orphan"
    )