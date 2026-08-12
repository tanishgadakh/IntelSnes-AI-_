from __future__ import annotations

from sqlalchemy import Column, DateTime, Integer, String, JSON, func
from app.database.base import Base


class AlertEvent(Base):
    __tablename__ = "alert_events"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(50), nullable=False)
    message = Column(String(2000), nullable=False)
    payload = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
