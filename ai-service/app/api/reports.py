from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependency import get_db_session
from app.repositories.prediction_repository import PredictionRepository
from app.services.analytics_service import AnalyticsService

router = APIRouter()
service = AnalyticsService()


@router.get("/reports")
async def reports(limit: int = 20, db: AsyncSession = Depends(get_db_session)):
    repository = PredictionRepository(db)
    predictions = await repository.list_recent(limit)
    payloads = [{"result": prediction.result} for prediction in predictions]
    analytics = await service.build_analytics(payloads)
    return {
        "status": "ok",
        "data": {
            "report_summary": analytics,
            "recent_predictions": [
                {
                    "id": prediction.id,
                    "input_text": prediction.input_text,
                    "language": prediction.result.get("language", "unknown"),
                    "confidence": prediction.result.get("confidence", 0.0),
                    "sentiment": prediction.result.get("sentiment", {}),
                    "created_at": prediction.created_at.isoformat() if prediction.created_at else None,
                }
                for prediction in predictions
            ],
        },
    }
