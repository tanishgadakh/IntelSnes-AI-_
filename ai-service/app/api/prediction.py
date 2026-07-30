from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_db_session
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import PredictionService

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def predict(req: PredictionRequest, db: AsyncSession = Depends(get_db_session)):
    service = PredictionService(db)
    try:
        return await service.predict(req.text, req.source)
    except Exception as exc:
        fallback = {
            "id": None,
            "input_text": req.text,
            "language": "unknown",
            "confidence": 0.0,
            "result": {
                "sentiment": {"label": "neutral", "score": 0.0},
                "emotions": {"joy": 0.0, "anger": 0.0, "sadness": 0.0},
                "aspects": [{"aspect": "general", "sentiment": "neutral"}],
                "keywords": [],
                "topics": [],
                "summary": req.text[:140] if len(req.text) > 140 else req.text,
                "recommendations": ["Monitoring enabled for fallback analysis"],
                "explainability": {
                    "summary": "Fallback analysis was returned due to an internal error.",
                    "features": [],
                },
                "language": "unknown",
                "confidence": 0.0,
            },
        }
        return fallback
