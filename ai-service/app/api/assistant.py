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
    sentiment = prediction["result"].get("sentiment", {})
    sentiment_label = str(sentiment.get("label", "unknown")).title()
    recommendations = prediction["result"].get("recommendations") or await recommendation_service.suggest(
        sentiment,
        prediction["result"].get("keywords", []),
        prediction["result"].get("topics", []),
        prediction["result"].get("emotions", {}),
    )
    summary = await summary_service.build_summary(prediction)
    summary_text = summary.get("summary") or "The analysis pipeline completed successfully."
    assistant_message = (
        f"Sentiment detected as {sentiment_label}. "
        f"Summary: {summary_text}"
    )

    return {
        "input_text": req.prompt,
        "assistant_message": assistant_message,
        "response": summary_text,
        "summary": summary_text,
        "sentiment": sentiment,
        "emotions": prediction["result"].get("emotions", {}),
        "aspects": prediction["result"].get("aspects", []),
        "keywords": prediction["result"].get("keywords", []),
        "topics": prediction["result"].get("topics", []),
        "language": prediction.get("language", "unknown"),
        "confidence": prediction.get("confidence", 0.0),
        "insights": prediction["result"],
        "recommendations": recommendations,
        "actionableRecommendations": recommendations,
        "explanation": prediction["result"].get("explainability", {}),
    }
