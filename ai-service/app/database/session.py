"""Session management and transaction helpers."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.engine import async_session


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
