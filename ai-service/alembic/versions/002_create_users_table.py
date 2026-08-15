"""Create users table for authentication.

Revision ID: 002
Revises: 001
Create Date: 2026-08-15 00:00:00.000000
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("role", sa.String(length=64), nullable=True),
        sa.Column("password_hash", sa.String(length=1024), nullable=True),
        sa.Column("password_previous", sa.String(length=1024), nullable=True),
        sa.Column("otp_code", sa.String(length=32), nullable=True),
        sa.Column("otp_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("reset_token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("username", name="uq_users_username"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
