try:
    from keybert import KeyBERT
    from sentence_transformers import SentenceTransformer
except Exception:
    KeyBERT = None
    SentenceTransformer = None

_keyword_model = None
_embedding_model = None


def _ensure_keybert():
    global _keyword_model, _embedding_model
    if KeyBERT is None or SentenceTransformer is None:
        raise RuntimeError("KeyBERT support requires keybert and sentence-transformers packages.")
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    if _keyword_model is None:
        _keyword_model = KeyBERT(model=_embedding_model)
    return _keyword_model


def extract_keywords_with_keybert(text: str, top_n: int = 5):
    model = _ensure_keybert()
    keywords = model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words="english", top_n=top_n)
    return [keyword for keyword, _score in keywords]
