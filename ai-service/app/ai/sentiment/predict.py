from app.core.config import settings
from app.ai.models.dummy import dummy_sentiment
from app.services.ai_manager import AIManager


try:
    from app.ai.models.roberta_loader import SentimentModel  # type: ignore
except Exception:
    SentimentModel = None


def predict_sentiment(text: str):
    # honor explicit dummy mode
    if settings.USE_DUMMY_MODELS:
        return dummy_sentiment(text)

    # prefer manager-provided instance if available
    try:
        manager = AIManager
        sentiment_instance = getattr(manager, "_sentiment", None)
        if sentiment_instance:
            try:
                return sentiment_instance.predict(text)
            except Exception:
                pass

        # fallback to creating a local model instance
        if SentimentModel is None:
            return dummy_sentiment(text)
        model = SentimentModel()
        return model.predict(text)
    except Exception:
        return dummy_sentiment(text)
