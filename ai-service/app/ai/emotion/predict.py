from app.core.config import settings
from app.ai.models.dummy import dummy_emotions

try:
    from transformers import pipeline
except Exception:
    pipeline = None

_emotion_pipe = None


def _get_emotion_pipeline():
    global _emotion_pipe
    if _emotion_pipe is None:
        if pipeline is None:
            return None
        _emotion_pipe = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            return_all_scores=True,
        )
    return _emotion_pipe


def predict_emotions(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_emotions(text)
    pipe = _get_emotion_pipeline()
    if pipe is None:
        return dummy_emotions(text)
    output = pipe(text)
    if not output:
        return {"joy": 0.0, "anger": 0.0, "sadness": 0.0}
    result = {item["label"].lower(): float(item.get("score", 0.0)) for item in output[0]}
    return {
        "joy": result.get("joy", 0.0),
        "anger": result.get("anger", 0.0),
        "sadness": result.get("sadness", 0.0),
    }
