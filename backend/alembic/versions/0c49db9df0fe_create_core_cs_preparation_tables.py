"""
Create core cs preparation tables

Revision ID: 0c49db9df0fe
Revises: bdf38228b353
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# ============================================================
# REVISION IDENTIFIERS
# ============================================================

revision: str = "0c49db9df0fe"

down_revision: Union[
    str,
    Sequence[str],
    None
] = "bdf38228b353"

branch_labels: Union[
    str,
    Sequence[str],
    None
] = None

depends_on: Union[
    str,
    Sequence[str],
    None
] = None


# ============================================================
# UPGRADE
# ============================================================

def upgrade() -> None:

    # ========================================================
    # CORE CS TOPICS
    # ========================================================

    op.create_table(

        "core_cs_topics",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True
        ),

        sa.Column(
            "name",
            sa.String(length=100),
            nullable=False
        ),

        sa.Column(
            "description",
            sa.Text(),
            nullable=True
        ),

        sa.Column(
            "display_order",
            sa.Integer(),
            nullable=False,
            server_default="0"
        ),

        sa.UniqueConstraint(
            "name",
            name="uq_core_cs_topics_name"
        )
    )

    op.create_index(
        "ix_core_cs_topics_id",
        "core_cs_topics",
        ["id"]
    )

    # ========================================================
    # CORE CS PROBLEMS
    # ========================================================

    op.create_table(

        "core_cs_problems",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True
        ),

        sa.Column(
            "topic_id",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "title",
            sa.String(length=200),
            nullable=False
        ),

        sa.Column(
            "description",
            sa.Text(),
            nullable=False
        ),

        sa.Column(
            "difficulty",
            sa.String(length=20),
            nullable=False
        ),

        sa.Column(
            "external_url",
            sa.Text(),
            nullable=True
        ),

        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true()
        ),

        sa.ForeignKeyConstraint(
            ["topic_id"],
            ["core_cs_topics.id"],
            name="fk_core_cs_problems_topic_id",
            ondelete="CASCADE"
        )
    )

    op.create_index(
        "ix_core_cs_problems_id",
        "core_cs_problems",
        ["id"]
    )

    op.create_index(
        "ix_core_cs_problems_topic_id",
        "core_cs_problems",
        ["topic_id"]
    )

    # ========================================================
    # CORE CS PROGRESS
    # ========================================================

    op.create_table(

        "core_cs_progress",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True
        ),

        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "problem_id",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "completed",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false()
        ),

        sa.Column(
            "completed_at",
            sa.DateTime(),
            nullable=True
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name="fk_core_cs_progress_user_id",
            ondelete="CASCADE"
        ),

        sa.ForeignKeyConstraint(
            ["problem_id"],
            ["core_cs_problems.id"],
            name="fk_core_cs_progress_problem_id",
            ondelete="CASCADE"
        ),

        sa.UniqueConstraint(
            "user_id",
            "problem_id",
            name="uq_core_cs_progress_user_problem"
        )
    )

    op.create_index(
        "ix_core_cs_progress_id",
        "core_cs_progress",
        ["id"]
    )

    op.create_index(
        "ix_core_cs_progress_user_id",
        "core_cs_progress",
        ["user_id"]
    )

    op.create_index(
        "ix_core_cs_progress_problem_id",
        "core_cs_progress",
        ["problem_id"]
    )


# ============================================================
# DOWNGRADE
# ============================================================

def downgrade() -> None:

    # Drop progress table first because it references
    # core_cs_problems and users.

    op.execute(
        "DROP TABLE IF EXISTS core_cs_progress CASCADE"
    )

    # Drop problems next because they reference topics.

    op.execute(
        "DROP TABLE IF EXISTS core_cs_problems CASCADE"
    )

    # Finally drop topics.

    op.execute(
        "DROP TABLE IF EXISTS core_cs_topics CASCADE"
    )