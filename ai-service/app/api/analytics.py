from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_db_session
from app.repositories.analytics_repository import AnalyticsRepository

router = APIRouter()


@router.get("/analytics/overview")
async def analytics_overview(db: AsyncSession = Depends(get_db_session)):
    try:
        repo = AnalyticsRepository(db)
        events = await repo.list_recent(limit=100)
        total = len(events)
        negative = sum(1 for e in events if (e.sentiment_label or "").lower() == "negative")
        positive = sum(1 for e in events if (e.sentiment_label or "").lower() == "positive")
        neutral = total - negative - positive
        negative_ratio = round((negative / total) * 100, 2) if total else 0.0
    except Exception:
        # best-effort: if DB is unreachable, return empty overview
        total = 0
        negative = 0
        positive = 0
        neutral = 0
        negative_ratio = 0.0
        events = []
    overview = {
        "total_events": total,
        "negative": negative,
        "positive": positive,
        "neutral": neutral,
        "negative_ratio_percent": negative_ratio,
        "recent": [
            {
                "id": e.id,
                "sentiment_label": e.sentiment_label,
                "sentiment_score": e.sentiment_score,
                "topics": e.topics,
                "keywords": e.keywords,
                "summary": e.summary,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
    }
    # fire alerting as a best-effort background action
    try:
        from app.services.alerting import check_and_alert
        check_and_alert(overview)
    except Exception:
        pass
    return overview


from app.repositories.prediction_repository import PredictionRepository
from app.services.analytics_service import AnalyticsService

service = AnalyticsService()


@router.get("/analytics")
async def analytics(limit: int = 20, db: AsyncSession = Depends(get_db_session)):
    repository = PredictionRepository(db)
    predictions = await repository.list_recent(limit)
    payloads = [{"result": prediction.result} for prediction in predictions]
    return {"status": "ok", "data": await service.build_analytics(payloads)}
