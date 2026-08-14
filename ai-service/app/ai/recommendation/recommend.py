from typing import List, Dict, Any


def _normalize_tokens(values: List[str]) -> List[str]:
    normalized: List[str] = []
    for value in values:
        cleaned = str(value).lower().strip().replace("_", " ").replace("-", " ")
        if cleaned:
            normalized.append(cleaned)
    return normalized


def recommend_actions(sentiment: Dict[str, Any], emotions: Dict[str, float], keywords: List[str], topics: List[str]) -> List[str]:
    recs: List[str] = []
    label = str(sentiment.get("label", "")).lower()
    normalized_keywords = _normalize_tokens(keywords)
    normalized_topics = _normalize_tokens(topics)
    keyword_text = ", ".join(normalized_keywords[:5]) if normalized_keywords else "the reported issues"
    topic_text = ", ".join(normalized_topics[:3]) if normalized_topics else "overall feedback"

    delivery_terms = {"delivery", "shipping", "logistics", "shipment", "delay", "delayed", "late", "on time"}
    quality_terms = {"quality", "product quality", "product", "performance", "reliability", "amazing", "excellent", "great", "good"}
    support_terms = {"support", "customer service", "service", "response time", "help"}

    has_delivery_issue = any(term in " ".join(normalized_keywords + normalized_topics) for term in delivery_terms)
    has_quality_strength = any(term in " ".join(normalized_keywords + normalized_topics) for term in quality_terms)
    has_support_issue = any(term in " ".join(normalized_keywords + normalized_topics) for term in support_terms)

    if label == "negative":
        if has_delivery_issue:
            recs.append(
                "Delivery delays and missed timelines are driving this negative sentiment; investigate shipping, fulfillment, and order tracking issues for the affected customers."
            )
        if has_quality_strength:
            recs.append(
                "Protect product quality and reliability while addressing the delivery issue that is overshadowing the otherwise strong customer experience."
            )
        if not recs:
            recs.append(f"Review the reported problems around {topic_text} and fix the root cause quickly.")
        if len(recs) == 1:
            recs.append(
                "Follow up on the specific customer complaints and verify the fix reduces negative sentiment in future feedback."
            )
    elif label == "positive":
        recs.append(f"Keep reinforcing the strengths around {topic_text} and maintain the current customer experience.")
        recs.append(f"Use the positive signal from {keyword_text} to reinforce product and service messaging.")
    else:
        recs.append(f"Review the emerging pattern around {topic_text} and confirm whether the issue is isolated or recurring.")
        recs.append("Continue monitoring the affected areas and validate the next fix with follow-up customer feedback.")

    return recs[:2]
