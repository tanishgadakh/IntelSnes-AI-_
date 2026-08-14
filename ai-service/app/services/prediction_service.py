from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.pipelines.prediction_pipeline import PredictionPipeline
from app.repositories.prediction_repository import PredictionRepository
from app.repositories.analytics_repository import AnalyticsRepository


class PredictionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = PredictionRepository(session)
        self.pipeline = PredictionPipeline()

    async def predict(self, text: str, source: str | None = None) -> dict[str, Any]:
        result = await self.pipeline.run(text)
        payload = {
            "id": None,
            "input_text": text,
            "language": result["language"],
            "confidence": result["confidence"],
            "result": {
                "sentiment": result["sentiment"],
                "emotions": result["emotions"],
                "aspects": result["aspects"],
                "keywords": result["keywords"],
                "topics": result["topics"],
                "summary": result["summary"],
                "explainability": result["explainability"],
                "recommendations": result["recommendations"],
                "language": result["language"],
                "confidence": result["confidence"],
            },
        }
        try:
            saved = await self.repo.save(input_text=text, result=payload["result"], source=source)
            payload["id"] = saved.id
        except Exception:
            payload["id"] = None

        # store a lightweight analytics event for dashboards/alerting (best-effort)
        try:
            analytics_payload = {
                "source": source,
                "sentiment_label": payload["result"].get("sentiment", {}).get("label"),
                "sentiment_score": payload["result"].get("sentiment", {}).get("score"),
                "topics": payload["result"].get("topics", []),
                "keywords": payload["result"].get("keywords", []),
                "aspects": payload["result"].get("aspects", []),
                "summary": payload["result"].get("summary", ""),
            }
            analytics_repo = AnalyticsRepository(self.session)
            await analytics_repo.save(analytics_payload)
        except Exception:
            try:
                await self.session.rollback()
            except Exception:
                pass
            pass
        return payload
