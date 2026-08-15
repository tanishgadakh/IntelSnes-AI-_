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

    try:
        summarizer = getattr(AIManager, "_summarizer", None)
        if summarizer:
            return summarizer.summarize(text)

        if SummarizationModel is None:
            raise RuntimeError("Summarization model is unavailable. Install transformers and torch for real model support.")

        model = SummarizationModel()
        return model.summarize(text)
    except Exception as exc:
        raise RuntimeError("Summarization model could not produce a real summary.") from exc
