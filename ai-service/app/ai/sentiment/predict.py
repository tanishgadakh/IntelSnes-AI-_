from app.core.config import settings
from app.ai.models.dummy import dummy_sentiment
from app.services.ai_manager import AIManager


try:
    from app.ai.models.roberta_loader import SentimentModel  # type: ignore
except Exception:
    SentimentModel = None


def predict_sentiment(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_sentiment(text)

    try:
        manager = AIManager
        sentiment_instance = getattr(manager, "_sentiment", None)
        if sentiment_instance:
            return sentiment_instance.predict(text)

        if SentimentModel is None:
            raise RuntimeError("Sentiment model is unavailable.")

        model = SentimentModel()
        return model.predict(text)
    except Exception as exc:
        raise RuntimeError("Sentiment model could not produce a real prediction.") from exc
