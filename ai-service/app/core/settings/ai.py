from pydantic import BaseModel


class AISettings(BaseModel):
    use_dummy_models: bool = False
