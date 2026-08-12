from __future__ import annotations

from sqlalchemy import select

from app.models.alert_event import AlertEvent
from app.repositories.base_repository import BaseRepository


class AlertRepository(BaseRepository):
    async def save(self, level: str, message: str, payload: dict | None = None) -> AlertEvent:
        ev = AlertEvent(level=level, message=message, payload=payload or {})
        self.session.add(ev)
        await self.session.flush()
        await self.session.refresh(ev)
        return ev

    async def list_recent(self, limit: int = 50):
        stmt = select(AlertEvent).order_by(AlertEvent.created_at.desc()).limit(limit)
        res = await self.session.execute(stmt)
        return list(res.scalars().all())
