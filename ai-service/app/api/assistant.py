from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_db_session
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.recommendation_service import RecommendationService
from app.services.summary_service import SummaryService
from app.services.prediction_service import PredictionService

router = APIRouter()

@router.post("/assistant", response_model=AssistantResponse)
async def assistant(req: AssistantRequest, db: AsyncSession = Depends(get_db_session)):
    prediction_service = PredictionService(db)
    recommendation_service = RecommendationService()
    summary_service = SummaryService()

    prediction = await prediction_service.predict(req.prompt, req.source)
    recommendations = recommendation_service.suggest(prediction["result"]["sentiment"], prediction["result"]["keywords"])
    summary = await summary_service.build_summary(prediction)

    return {
        "input_text": req.prompt,
        "assistant_message": "The analysis pipeline completed successfully.",
        "language": prediction.get("language", "unknown"),
        "confidence": prediction.get("confidence", 0.0),
        "insights": prediction["result"],
        "recommendations": recommendations,
        "explanation": prediction["result"].get("explainability", {}),
    }
