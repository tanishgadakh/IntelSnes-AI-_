from typing import List, Dict, Any


def recommend_actions(sentiment: Dict[str, Any], emotions: Dict[str, float], keywords: List[str], topics: List[str]) -> List[str]:
    recs = []
    label = sentiment.get("label", "").lower()
    topics_summary = ", ".join(topics[:3]) if topics else "general feedback"
    keywords_summary = ", ".join(keywords[:4]) if keywords else "the main issues"

    if label == "negative":
        recs.append(f"Investigate the issues around {topics_summary} and address the root cause quickly.")
        recs.append(f"Prioritize follow-up on {keywords_summary} because they are driving negative emotion.")
    elif label == "positive":
        recs.append(f"Maintain the strengths behind {topics_summary} and preserve the current experience.")
        recs.append(f"Capture the positive signals around {keywords_summary} for product and support teams.")
    else:
        recs.append(f"Review the trends around {topics_summary} and identify the next actions.")
        recs.append("Continue monitoring the affected areas for changes in sentiment.")

    return recs
