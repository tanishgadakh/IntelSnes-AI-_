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

    try:
        pipe = _get_emotion_pipeline()
        if pipe is None:
            raise RuntimeError("Emotion model pipeline is unavailable.")

        output = pipe(text)
        if not output:
            raise RuntimeError("Emotion model returned no output.")

        result = {item["label"].lower(): float(item.get("score", 0.0)) for item in output[0]}
        normalized = {
            "joy": round(result.get("joy", 0.0), 3),
            "anger": round(result.get("anger", 0.0), 3),
            "sadness": round(result.get("sadness", 0.0), 3),
        }
        return normalized
    except Exception as exc:
        raise RuntimeError("Emotion model could not produce a real prediction.") from exc
