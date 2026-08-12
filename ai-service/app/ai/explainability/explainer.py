"""Explainability utilities for AI predictions."""

from __future__ import annotations

from typing import Any


def explain_prediction(text: str, result: dict[str, Any]) -> dict[str, Any]:
    sentiment = result.get("sentiment", {}).get("label", "neutral")
    keywords = result.get("keywords", [])
    # collect evidence sentences containing either keywords or short sentiment cues
    sentences = [s.strip() for s in text.replace('!', '.').replace('?', '.').split('.') if s.strip()]
    evidence: list[str] = []
    for s in sentences:
        lower = s.lower()
        if any(k.lower() in lower for k in keywords[:5]):
            evidence.append(s)
        elif len(evidence) < 2 and any(word in lower for word in ["good", "great", "bad", "poor", "slow", "excellent", "terrible"]):
            evidence.append(s)

    return {
        "summary": f"Prediction was driven by sentiment '{sentiment}' and keywords {keywords[:3]}",
        "features": [
            {"name": "sentiment", "value": sentiment},
            {"name": "keywords", "value": keywords[:5]},
            {"name": "evidence_sentences", "value": evidence},
        ],
    }
