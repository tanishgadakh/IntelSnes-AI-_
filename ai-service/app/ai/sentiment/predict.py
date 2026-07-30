from app.core.config import settings
from app.ai.models.dummy import dummy_sentiment


try:
    from app.ai.models.roberta_loader import SentimentModel
except Exception:
    SentimentModel = None


def predict_sentiment(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_sentiment(text)
    if SentimentModel is None:
        raise RuntimeError("Sentiment model is unavailable. Install transformers and torch for real model support.")
    model = SentimentModel()
    return model.predict(text)
