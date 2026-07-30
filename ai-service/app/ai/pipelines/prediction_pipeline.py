"""High-level prediction pipeline orchestrating the AI modules."""

from __future__ import annotations

from app.ai.aspect.extractor import extract_aspects
from app.ai.emotion.predict import predict_emotions
from app.ai.explainability.explainer import explain_prediction
from app.ai.keywords.extract import extract_keywords
from app.ai.preprocessing.cleaner import clean_text
from app.ai.preprocessing.language import detect_language
from app.ai.recommendation.recommend import recommend_actions
from app.ai.sentiment.predict import predict_sentiment
from app.ai.summarization.summarize import summarize_text
from app.ai.topics.model import extract_topics


class PredictionPipeline:
    """Coordinate the AI analysis workflow for a feedback text."""

    async def run(self, text: str) -> dict[str, object]:
        cleaned = clean_text(text)
        language = detect_language(cleaned)
        sentiment = predict_sentiment(cleaned)
        emotions = predict_emotions(cleaned)
        aspects = extract_aspects(cleaned)
        keywords = extract_keywords(cleaned)
        topics = extract_topics(cleaned)
        summary = summarize_text(cleaned)
        explanation = explain_prediction(
            cleaned,
            {"sentiment": sentiment, "keywords": keywords, "aspects": aspects},
        )
        recommendations = recommend_actions(sentiment, emotions, keywords, topics)
        confidence = self._calculate_confidence(sentiment, emotions, aspects, keywords)

        return {
            "language": language,
            "confidence": confidence,
            "sentiment": sentiment,
            "emotions": emotions,
            "aspects": aspects,
            "keywords": keywords,
            "topics": topics,
            "summary": summary,
            "explainability": explanation,
            "recommendations": recommendations,
        }

    def _calculate_confidence(
        self,
        sentiment: dict[str, float],
        emotions: dict[str, float],
        aspects: list[dict[str, object]],
        keywords: list[str],
    ) -> float:
        base_score = float(sentiment.get("score", 0.0))
        emotion_boost = sum(emotions.values()) / max(len(emotions), 1) * 0.05
        aspect_boost = min(0.05, len(aspects) * 0.01)
        keyword_boost = min(0.05, len(keywords) * 0.005)
        confidence = min(1.0, base_score + emotion_boost + aspect_boost + keyword_boost)
        return round(confidence, 3)
