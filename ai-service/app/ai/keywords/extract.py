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
        return dummy_keywords(text, top_n=top_n)
    try:
        keywords = extract_keywords_with_keybert(text, top_n=top_n)
        return keywords or dummy_keywords(text, top_n=top_n)
    except Exception:
        return dummy_keywords(text, top_n=top_n)
