from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class AssistantRequest(BaseModel):
    prompt: str
    source: Optional[str] = None


class AssistantResponse(BaseModel):
    input_text: str
    assistant_message: str
    language: str
    confidence: float
    insights: Dict[str, Any]
    recommendations: List[str]
    explanation: Dict[str, Any]
