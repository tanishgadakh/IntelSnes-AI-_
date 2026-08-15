from app.core.config import settings
from app.ai.models.dummy import dummy_keywords

try:
    from app.ai.models.keybert_loader import extract_keywords_with_keybert
except Exception:
    extract_keywords_with_keybert = None


def extract_keywords(text: str, top_n: int = 8):
    if settings.USE_DUMMY_MODELS:
        return dummy_keywords(text, top_n=top_n)

    if extract_keywords_with_keybert is None:
        raise RuntimeError("Keyword extraction model is unavailable.")

    try:
        keywords = extract_keywords_with_keybert(text, top_n=top_n)
        if not keywords:
            raise RuntimeError("Keyword extraction model returned no keywords.")
        return keywords
    except Exception as exc:
        raise RuntimeError("Keyword extraction model could not produce a real result.") from exc
