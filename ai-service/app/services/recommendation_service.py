from typing import List, Dict, Any

from app.ai.recommendation.recommend import recommend_actions


class RecommendationService:
    async def suggest(
        self,
        sentiment: Dict[str, Any],
        keywords: List[str],
        topics: List[str] | None = None,
        emotions: Dict[str, float] | None = None,
    ) -> List[str]:
        return recommend_actions(
            sentiment=sentiment,
            emotions=emotions or {},
            keywords=keywords,
            topics=topics or [],
        )
