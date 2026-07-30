"""SQLAlchemy engine configuration for the application."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


engine: AsyncEngine = create_async_engine(
    settings.database_url,
    future=True,
    echo=False,
    pool_pre_ping=True,
)

async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)
