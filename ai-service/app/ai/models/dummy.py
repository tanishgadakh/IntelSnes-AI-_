from functools import lru_cache


@lru_cache()
def dummy_sentiment(text: str):
    lower = text.lower()
    positive_words = {
        "good", "great", "excellent", "love", "amazing", "best", "perfect", "satisfied",
        "happy", "awesome", "fantastic", "smooth", "fast", "reliable", "helpful", "easy"
    }
    negative_words = {
        "bad", "hate", "terrible", "awful", "poor", "slow", "late", "broken",
        "disappointed", "worst", "frustrating", "hard", "difficult", "buggy", "issue",
        "problem", "fail", "failed", "delay", "delayed"
    }

    positive_hits = sum(1 for word in positive_words if word in lower)
    negative_hits = sum(1 for word in negative_words if word in lower)

    if positive_hits > negative_hits:
        label = "positive"
        score = min(0.99, 0.7 + positive_hits * 0.05)
    elif negative_hits > positive_hits:
        label = "negative"
        score = min(0.99, 0.7 + negative_hits * 0.05)
    else:
        label = "neutral"
        score = 0.55

    return {"label": label, "score": round(score, 3)}


@lru_cache()
def dummy_emotions(text: str):
    lower = text.lower()
    joy = 0.2
    anger = 0.2
    sadness = 0.2

    if any(word in lower for word in ["love", "great", "excellent", "amazing", "happy", "awesome"]):
        joy = 0.8
    if any(word in lower for word in ["hate", "bad", "terrible", "awful", "poor", "frustrating", "angry"]):
        anger = 0.8
    if any(word in lower for word in ["sad", "disappointed", "late", "delay", "problem", "issue"]):
        sadness = 0.75

    return {
        "joy": round(joy, 3),
        "anger": round(anger, 3),
        "sadness": round(sadness, 3),
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
    if "price" in lower or "cost" in lower or "expensive" in lower:
        topics.append("pricing")
    if "quality" in lower or "performance" in lower or "product" in lower:
        topics.append("product_quality")
    if "delivery" in lower or "late" in lower or "shipping" in lower:
        topics.append("delivery")
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
