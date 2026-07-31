"""SQLAlchemy engine configuration for the application."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine: AsyncEngine = create_async_engine(
    settings.database_url,
    future=True,
    echo=False,
    pool_pre_ping=True,
)

try:
    from sqlalchemy.ext.asyncio import async_sessionmaker
except ImportError:  # SQLAlchemy 1.4 compatibility
    async_session = sessionmaker(
        bind=engine,
        expire_on_commit=False,
        class_=AsyncSession,
    )
else:
    async_session = async_sessionmaker(
        bind=engine,
        expire_on_commit=False,
        class_=AsyncSession,
    )
