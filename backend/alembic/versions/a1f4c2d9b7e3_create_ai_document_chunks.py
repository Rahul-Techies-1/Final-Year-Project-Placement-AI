"""Create AI document chunks table

Revision ID: a1f4c2d9b7e3
Revises: 121bff0bea25
Create Date: 2026-10-28 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1f4c2d9b7e3"
down_revision: Union[str, Sequence[str], None] = "121bff0bea25"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "ai_document_chunks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("document_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(
            ["document_id"], ["ai_documents.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_ai_document_chunks_id"),
        "ai_document_chunks", ["id"], unique=False,
    )
    op.create_index(
        op.f("ix_ai_document_chunks_document_id"),
        "ai_document_chunks", ["document_id"], unique=False,
    )
    op.create_index(
        op.f("ix_ai_document_chunks_user_id"),
        "ai_document_chunks", ["user_id"], unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_ai_document_chunks_user_id"), table_name="ai_document_chunks")
    op.drop_index(op.f("ix_ai_document_chunks_document_id"), table_name="ai_document_chunks")
    op.drop_index(op.f("ix_ai_document_chunks_id"), table_name="ai_document_chunks")
    op.drop_table("ai_document_chunks")