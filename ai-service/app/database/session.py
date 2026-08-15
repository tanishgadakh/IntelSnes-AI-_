"""Session management and transaction helpers."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import Base
from app.database.engine import async_session, engine

logger = logging.getLogger(__name__)


async def init_db() -> None:
    """Create required SQLAlchemy tables when the configured database is reachable."""
    try:
        async with engine.begin() as connection:
            await connection.run_sync(lambda sync_conn: Base.metadata.create_all(bind=sync_conn))
        logger.info("Database initialization complete")
    except Exception:
        logger.exception("Database initialization failed; continuing without schema bootstrapping")


@asynccontextmanager
async def get_db() -> AsyncIterator[AsyncSession]:
    """Yield a database session for dependency injection.

    The AI service should remain usable even when the backing database is unavailable,
    so failed commits are treated as non-fatal for request handling.
    """
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            try:
                await session.rollback()
            except Exception:
                pass
            return
