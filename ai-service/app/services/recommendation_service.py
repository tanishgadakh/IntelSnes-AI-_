from typing import List, Dict, Any


class RecommendationService:
    async def suggest(self, sentiment: Dict[str, Any], keywords: List[str]) -> List[str]:
        recommendations: List[str] = []
        label = sentiment.get("label", "").lower()
        if label == "negative":
            recommendations.append("Investigate negative feedback for top keywords: " + ", ".join(keywords[:3]))
            recommendations.append("Prioritize improving customer experience in the most mentioned areas.")
        elif label == "positive":
            recommendations.append("Maintain product quality and monitor customer sentiment." )
            recommendations.append("Scale support operations for positive feedback trends.")
        else:
            recommendations.append("Review feedback to identify specific improvement opportunities.")
        return recommendations
