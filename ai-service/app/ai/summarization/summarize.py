from app.core.config import settings
from app.ai.models.dummy import dummy_summary


try:
    from app.ai.models.bart_loader import SummarizationModel
except Exception:
    SummarizationModel = None


def summarize_text(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_summary(text)
    if SummarizationModel is None:
        raise RuntimeError("Summarization model is unavailable. Install transformers and torch for real model support.")
    model = SummarizationModel()
    return model.summarize(text)
