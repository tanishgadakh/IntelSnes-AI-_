from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class AssistantRequest(BaseModel):
    prompt: str
    source: Optional[str] = None


class AssistantResponse(BaseModel):
    input_text: str
    assistant_message: str
    response: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[Dict[str, Any]] = None
    emotions: Optional[Dict[str, Any]] = None
    aspects: Optional[List[Dict[str, Any]]] = None
    keywords: Optional[List[str]] = None
    topics: Optional[List[str]] = None
    language: str
    confidence: float
    insights: Dict[str, Any]
    recommendations: List[str]
    actionableRecommendations: Optional[List[str]] = None
    explanation: Dict[str, Any]
