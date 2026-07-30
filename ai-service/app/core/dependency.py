from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async with get_db() as session:
        yield session
