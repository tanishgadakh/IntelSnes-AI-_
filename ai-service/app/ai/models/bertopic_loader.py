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
    if not texts:
        return []

    model = _ensure_topic_model()
    if len(texts) == 1:
        text = str(texts[0]).lower()
        if any(word in text for word in ["support", "help", "customer", "service"]):
            return ["support"]
        if any(word in text for word in ["delivery", "shipping", "late", "arrived"]):
            return ["delivery"]
        if any(word in text for word in ["price", "cost", "expensive", "cheap", "refund"]):
            return ["pricing"]
        if any(word in text for word in ["quality", "product", "performance", "feature", "bug"]):
            return ["product_quality"]
        return ["general"]

    try:
        topics, _ = model.fit_transform(texts)
        return [str(topic) for topic in topics]
    except Exception:
        return ["general"]
