from pydantic import BaseModel
from typing import Optional, Any, Dict, List


class PredictionRequest(BaseModel):
    text: str
    source: Optional[str] = None


class SentimentResult(BaseModel):
    label: str
    score: float


class ExplainabilityResult(BaseModel):
    summary: str
    features: List[Dict[str, Any]]


class PredictionResult(BaseModel):
    sentiment: SentimentResult
    emotions: Dict[str, float]
    aspects: List[Dict[str, Any]]
    keywords: List[str]
    topics: List[str]
    summary: Optional[str]
    recommendations: List[str]
    explainability: Optional[ExplainabilityResult]
    language: str
    confidence: float


class PredictionResponse(BaseModel):
    id: Optional[int]
    input_text: str
    language: str
    confidence: float
    result: PredictionResult
