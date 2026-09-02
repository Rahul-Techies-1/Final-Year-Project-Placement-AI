"""Create interviews table

Revision ID: ed0afa383e9a
Revises: 566243d65880
Create Date: 2026-08-24 10:17:46.256686

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed0afa383e9a'
down_revision: Union[str, Sequence[str], None] = '566243d65880'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.drop_constraint(
        "interviews_application_id_fkey",
        "interviews",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "interviews_application_id_fkey",
        "interviews",
        "applications",
        ["application_id"],
        ["id"],
        ondelete="CASCADE"
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "interviews_application_id_fkey",
        "interviews",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "interviews_application_id_fkey",
        "interviews",
        "applications",
        ["application_id"],
        ["id"]
    )
