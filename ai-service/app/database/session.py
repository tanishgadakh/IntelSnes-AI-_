"""Session management and transaction helpers."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.engine import async_session


@asynccontextmanager
async def get_db() -> AsyncIterator[AsyncSession]:
    """Yield a database session for dependency injection."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
