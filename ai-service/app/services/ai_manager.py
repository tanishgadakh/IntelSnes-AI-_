from typing import Optional
from app.core.config import settings
from app.ai.models.dummy import DummyModels
from app.ai.models.roberta_loader import SentimentModel
from app.ai.models.bart_loader import SummarizationModel


class AIManager:
    _sentiment: Optional[SentimentModel] = None
    _summarizer: Optional[SummarizationModel] = None
    _model_versions = {
        "sentiment": "default",
        "summarizer": "default",
    }
    _initialized = False

    @classmethod
    async def initialize(cls, use_dummy: bool = False):
        if cls._initialized:
            return
        if use_dummy:
            DummyModels.register()
            cls._initialized = True
            return

        try:
            cls._sentiment = SentimentModel()
            cls._summarizer = SummarizationModel()
            cls._initialized = True
        except Exception as exc:
            cls._sentiment = None
            cls._summarizer = None
            cls._initialized = True
            raise RuntimeError("Real AI models failed to initialize. Ensure the model dependencies are installed and USE_DUMMY_MODELS is explicitly enabled only for local smoke tests.") from exc

    @classmethod
    def list_models(cls):
        # return available model slots and current versions
        return {"models": {"sentiment": cls._model_versions.get("sentiment"), "summarizer": cls._model_versions.get("summarizer")}}

    @classmethod
    async def switch_model_version(cls, model_name: str, version: str):
        # Basic switcher: supports 'default' (real), 'dummy' (register dummy)
        model_name = model_name.lower()
        if version == "dummy":
            # register dummy models globally
            DummyModels.register()
            cls._model_versions[model_name] = "dummy"
            # clear real instances for safety
            if model_name == "sentiment":
                cls._sentiment = None
            if model_name == "summarizer":
                cls._summarizer = None
            return True

        if version == "default":
            # attempt to load the real model for this slot
            try:
                if model_name == "sentiment":
                    cls._sentiment = SentimentModel()
                if model_name == "summarizer":
                    cls._summarizer = SummarizationModel()
                cls._model_versions[model_name] = "default"
                return True
            except Exception:
                return False

        # unknown version
        return False
