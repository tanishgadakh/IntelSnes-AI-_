try:
    from transformers import pipeline
except Exception:
    pipeline = None

from threading import Lock

from app.ai.models.dummy import dummy_sentiment


class SentimentModel:
    _lock = Lock()

    def __init__(self, model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"):
        self.model_name = model_name
        self._pipe = None

    def _ensure(self):
        if self._pipe is None:
            with SentimentModel._lock:
                if self._pipe is None:
                    if pipeline is None:
                        raise RuntimeError("transformers pipeline not available")
                    self._pipe = pipeline("sentiment-analysis", model=self.model_name, return_all_scores=False)

    def predict(self, text: str):
        try:
            self._ensure()
            out = self._pipe(text)
            if isinstance(out, list) and out:
                result = out[0]
                label = str(result.get("label", "neutral")).lower()
                score = float(result.get("score", 0.0))
                if label.startswith("pos"):
                    return {"label": "positive", "score": round(score, 3)}
                if label.startswith("neg"):
                    return {"label": "negative", "score": round(score, 3)}
                return {"label": "neutral", "score": round(score, 3)}
        except Exception:
            pass
        return dummy_sentiment(text)
