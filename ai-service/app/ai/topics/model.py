from app.core.config import settings
from app.ai.models.dummy import dummy_topics

try:
    from app.ai.models.bertopic_loader import topic_model_predict
except Exception:
    topic_model_predict = None


def extract_topics(text: str):
    if settings.USE_DUMMY_MODELS or topic_model_predict is None:
        return dummy_topics(text)
    return topic_model_predict([text])
