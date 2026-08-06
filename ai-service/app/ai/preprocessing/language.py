try:
    from langdetect import detect as _detect
    from langdetect import detector_factory as _detector_factory
except Exception:
    _detect = None
    _detector_factory = None

if _detector_factory is not None:
    try:
        _detector_factory.seed = 0
    except Exception:
        pass


def _heuristic_detect_language(text: str) -> str:
    if not text or not text.strip():
        return "unknown"

    lower_text = text.lower()
    english_markers = {
        "the",
        "and",
        "is",
        "this",
        "that",
        "for",
        "with",
        "have",
        "are",
        "not",
        "but",
        "you",
        "i",
        "we",
        "our",
        "can",
        "will",
        "product",
        "service",
        "feedback",
        "customer",
        "review",
        "support",
        "delivery",
        "good",
        "great",
        "love",
        "quality",
        "bad",
        "hate",
        "improve",
        "please",
        "thanks",
    }

    if any(marker in lower_text for marker in english_markers):
        return "en"

    alpha_count = sum(1 for char in text if char.isalpha())
    if alpha_count == 0:
        return "unknown"

    ascii_alpha_count = sum(1 for char in text if char.isalpha() and ord(char) < 128)
    return "en" if ascii_alpha_count / alpha_count >= 0.8 else "unknown"


def detect_language(text: str) -> str:
    if not text or not text.strip():
        return "unknown"

    if _detect is not None:
        try:
            detected = _detect(text)
            if detected:
                return detected
        except Exception:
            pass

    return _heuristic_detect_language(text)
