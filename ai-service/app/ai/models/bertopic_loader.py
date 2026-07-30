try:
    from bertopic import BERTopic
    from sentence_transformers import SentenceTransformer
except Exception:
    BERTopic = None
    SentenceTransformer = None

_topic_model = None


def _ensure_topic_model():
    global _topic_model
    if BERTopic is None or SentenceTransformer is None:
        raise RuntimeError("BERTopic support requires bertopic and sentence-transformers packages.")
    if _topic_model is None:
        embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        _topic_model = BERTopic(embedding_model=embedding_model, calculate_probabilities=False)
    return _topic_model


def topic_model_predict(texts):
    model = _ensure_topic_model()
    topics, _ = model.fit_transform(texts)
    return [str(topic) for topic in topics]
