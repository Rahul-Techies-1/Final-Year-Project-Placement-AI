"""Create mock interviews tables

Revision ID: 770ea81e7cf0
Revises: d6092d90435a
Create Date: 2026-09-07 16:55:31.523969

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "770ea81e7cf0"
down_revision: Union[str, Sequence[str], None] = "d6092d90435a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.create_table(
        "mock_interviews",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            nullable=False
        ),

        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey(
                "users.id",
                ondelete="CASCADE"
            ),
            nullable=False
        ),

        sa.Column(
            "interview_type",
            sa.String(length=30),
            nullable=False
        ),

        sa.Column(
            "difficulty",
            sa.String(length=20),
            nullable=False
        ),

        sa.Column(
            "total_questions",
            sa.Integer(),
            nullable=False,
            server_default="0"
        ),

        sa.Column(
            "questions_answered",
            sa.Integer(),
            nullable=False,
            server_default="0"
        ),

        sa.Column(
            "score",
            sa.Integer(),
            nullable=True
        ),

        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="in_progress"
        ),

        sa.Column(
            "started_at",
            sa.DateTime(),
            nullable=False
        ),

        sa.Column(
            "completed_at",
            sa.DateTime(),
            nullable=True
        ),
    )

    op.create_index(
        op.f("ix_mock_interviews_id"),
        "mock_interviews",
        ["id"],
        unique=False
    )

    op.create_index(
        op.f("ix_mock_interviews_user_id"),
        "mock_interviews",
        ["user_id"],
        unique=False
    )

    op.create_table(
        "mock_interview_questions",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            nullable=False
        ),

        sa.Column(
            "interview_id",
            sa.Integer(),
            sa.ForeignKey(
                "mock_interviews.id",
                ondelete="CASCADE"
            ),
            nullable=False
        ),

        sa.Column(
            "question",
            sa.Text(),
            nullable=False
        ),

        sa.Column(
            "question_type",
            sa.String(length=30),
            nullable=False
        ),

        sa.Column(
            "expected_answer",
            sa.Text(),
            nullable=True
        ),

        sa.Column(
            "student_answer",
            sa.Text(),
            nullable=True
        ),

        sa.Column(
            "score",
            sa.Integer(),
            nullable=True
        ),

        sa.Column(
            "feedback",
            sa.Text(),
            nullable=True
        ),

        sa.Column(
            "question_order",
            sa.Integer(),
            nullable=False
        ),
    )

    op.create_index(
        op.f("ix_mock_interview_questions_id"),
        "mock_interview_questions",
        ["id"],
        unique=False
    )

    op.create_index(
        op.f("ix_mock_interview_questions_interview_id"),
        "mock_interview_questions",
        ["interview_id"],
        unique=False
    )


def downgrade() -> None:

    op.drop_index(
        op.f("ix_mock_interview_questions_interview_id"),
        table_name="mock_interview_questions"
    )

    op.drop_index(
        op.f("ix_mock_interview_questions_id"),
        table_name="mock_interview_questions"
    )

    op.drop_table("mock_interview_questions")

    op.drop_index(
        op.f("ix_mock_interviews_user_id"),
        table_name="mock_interviews"
    )

    op.drop_index(
        op.f("ix_mock_interviews_id"),
        table_name="mock_interviews"
    )

    op.drop_table("mock_interviews")