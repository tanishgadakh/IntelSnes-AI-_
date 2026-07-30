from functools import lru_cache


@lru_cache()
def dummy_sentiment(text: str):
    lower = text.lower()
    label = "positive" if "good" in lower or "love" in lower else "negative" if "bad" in lower or "hate" in lower else "neutral"
    return {"label": label, "score": 0.9}


@lru_cache()
def dummy_emotions(text: str):
    lower = text.lower()
    return {
        "joy": 0.8 if "love" in lower or "great" in lower else 0.1,
        "anger": 0.7 if "hate" in lower or "bad" in lower else 0.05,
        "sadness": 0.6 if "sad" in lower or "disappointed" in lower else 0.05,
    }


@lru_cache()
def dummy_keywords(text: str, top_n: int = 8):
    tokens = [token.strip(".,!?;:") for token in text.lower().split() if len(token) > 3]
    unique = []
    for token in tokens:
        if token not in unique:
            unique.append(token)
        if len(unique) >= top_n:
            break
    return unique or ["feedback"]


@lru_cache()
def dummy_topics(text: str):
    lower = text.lower()
    topics = []
    if "support" in lower:
        topics.append("support")
    if "price" in lower or "cost" in lower:
        topics.append("pricing")
    if "quality" in lower or "performance" in lower:
        topics.append("product_quality")
    if not topics:
        topics.append("general")
    return topics


@lru_cache()
def dummy_summary(text: str):
    if len(text) <= 150:
        return text
    return text[:147] + "..."


class DummyModels:
    @staticmethod
    def register():
        return True
