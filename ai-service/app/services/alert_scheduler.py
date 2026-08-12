import asyncio
import logging
from typing import Optional

from app.database.engine import async_session
from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.alert_repository import AlertRepository
from app.services.alerting import check_and_alert
from app.core.config import settings

logger = logging.getLogger(__name__)


class AlertScheduler:
    _task: Optional[asyncio.Task] = None

    @classmethod
    async def start(cls):
        if cls._task:
            return
        interval = int(settings.ALERT_SCHEDULE_SECONDS or 300)

        async def runner():
            while True:
                try:
                    async with async_session() as session:
                        analytics_repo = AnalyticsRepository(session)
                        events = await analytics_repo.list_recent(limit=200)
                        total = len(events)
                        negative = sum(1 for e in events if (e.sentiment_label or '').lower() == 'negative')
                        negative_ratio = round((negative / total) * 100, 2) if total else 0.0
                        overview = {
                            'total_events': total,
                            'negative_ratio_percent': negative_ratio,
                            'recent': [],
                        }
                        alerted, text = check_and_alert(overview)
                        if alerted:
                            alert_repo = AlertRepository(session)
                            await alert_repo.save(level='warning', message=text, payload=overview)
                except Exception as e:
                    logger.exception('Error running alert scheduler: %s', e)
                await asyncio.sleep(interval)

        cls._task = asyncio.create_task(runner())

    @classmethod
    async def stop(cls):
        if cls._task:
            cls._task.cancel()
            cls._task = None
