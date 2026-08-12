from app.core.config import settings
from app.ai.models.dummy import dummy_summary
from app.services.ai_manager import AIManager


try:
    from app.ai.models.bart_loader import SummarizationModel  # type: ignore
except Exception:
    SummarizationModel = None


def summarize_text(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_summary(text)

    # prefer manager-provided summarizer
    try:
        summarizer = getattr(AIManager, "_summarizer", None)
        if summarizer:
            try:
                return summarizer.summarize(text)
            except Exception:
                pass

        if SummarizationModel is None:
            raise RuntimeError("Summarization model is unavailable. Install transformers and torch for real model support.")
        model = SummarizationModel()
        return model.summarize(text)
    except Exception:
        return dummy_summary(text)
