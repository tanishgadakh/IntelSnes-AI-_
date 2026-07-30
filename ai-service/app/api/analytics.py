from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_db_session
from app.repositories.prediction_repository import PredictionRepository
from app.services.analytics_service import AnalyticsService

router = APIRouter()
service = AnalyticsService()


@router.get("/analytics")
async def analytics(limit: int = 20, db: AsyncSession = Depends(get_db_session)):
    repository = PredictionRepository(db)
    predictions = await repository.list_recent(limit)
    payloads = [{"result": prediction.result} for prediction in predictions]
    return {"status": "ok", "data": await service.build_analytics(payloads)}
