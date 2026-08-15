from app.core.config import settings
from app.ai.models.dummy import dummy_topics

try:
    from app.ai.models.bertopic_loader import topic_model_predict
except Exception:
    topic_model_predict = None


def extract_topics(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_topics(text)

    if topic_model_predict is None:
        raise RuntimeError("Topic model is unavailable.")

    try:
        topics = topic_model_predict([text])
        if not topics:
            raise RuntimeError("Topic model returned no topics.")
        return topics
    except Exception as exc:
        raise RuntimeError("Topic model could not produce a real result.") from exc
