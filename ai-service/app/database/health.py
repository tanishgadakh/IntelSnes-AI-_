"""Database health and readiness checks."""

from __future__ import annotations

from typing import Any
from sqlalchemy import text

from app.database.engine import engine


async def is_db_ready() -> bool:
    """Return whether the database connection is available."""
    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
            return True
    except Exception:
        return False


async def get_db_health() -> dict[str, Any]:
    """Return a lightweight health payload for diagnostics."""
    db_ready = await is_db_ready()
    return {
        "status": "ok" if db_ready else "unavailable",
        "database": "available" if db_ready else "unavailable",
    }
