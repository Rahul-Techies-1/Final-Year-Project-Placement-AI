from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

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

    role: Mapped[str] = mapped_column(
        String(50),
        default="student",
        nullable=False
    )
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
    jobs = relationship(
    "Job",
    back_populates="recruiter",
    cascade="all, delete"
)

    applications = relationship(
        "Application",
        back_populates="student",
        cascade="all, delete"
    )