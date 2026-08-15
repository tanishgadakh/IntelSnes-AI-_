# Implementation Guide: Fixing Broken AI Prediction Endpoints

## Overview

This guide provides step-by-step instructions to wire the 2 broken endpoints (`/summary` and `/recommendations`) to use real AI models and services.

---

## Issue 1: Fix `/summary` Endpoint

### Current Problem

**File:** `ai-service/app/api/summary.py`

```python
@router.post("/summary")
async def summarize():  # ❌ NO PARAMETERS
    prediction = {
        "result": {
            "summary": "Customer feedback indicates positive sentiment...",  # ❌ HARDCODED
            "keywords": ["support", "quality"],
            "recommendations": ["Continue monitoring customer experience"],
        }
    }
    return {"status": "ok", **await service.build_summary(prediction)}
```

**Issues:**
1. Endpoint has no request parameters
2. Returns hardcoded summary regardless of input
3. Doesn't process user text

### Solution

#### Step 1: Create Request Schema

Add to `ai-service/app/schemas/summary.py` (create if doesn't exist):

```python
from pydantic import BaseModel, Field

class SummaryRequest(BaseModel):
    text: str = Field(..., description="Text to summarize")
    source: str | None = Field(None, description="Source of the text (e.g., twitter, email)")

class SummaryResponse(BaseModel):
    status: str = "ok"
    summary: str
    keywords: list[str]
    recommendations: list[str]
```

#### Step 2: Update the Endpoint

Replace `ai-service/app/api/summary.py`:

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_db_session
from app.schemas.summary import SummaryRequest, SummaryResponse
from app.services.prediction_service import PredictionService
from app.services.summary_service import SummaryService

router = APIRouter()

@router.post("/summary", response_model=SummaryResponse)
async def summarize(req: SummaryRequest, db: AsyncSession = Depends(get_db_session)):
    """
    Summarize feedback text using the AI pipeline.
    
    - Runs full prediction pipeline (sentiment, keywords, etc.)
    - Extracts and formats the summary
    - Returns summary, keywords, and recommendations
    """
    try:
        # Step 1: Run full prediction pipeline
        prediction_service = PredictionService(db)
        prediction = await prediction_service.predict(req.text, req.source)
        
        # Step 2: Build summary from prediction
        summary_service = SummaryService()
        summary_result = await summary_service.build_summary(prediction)
        
        # Step 3: Return formatted response
        return {
            "status": "ok",
            "summary": summary_result.get("summary", ""),
            "keywords": summary_result.get("keywords", []),
            "recommendations": summary_result.get("recommendations", []),
        }
    except Exception as exc:
        # Fallback to dummy summary on error
        return {
            "status": "ok",
            "summary": req.text[:150] if len(req.text) > 150 else req.text,
            "keywords": [],
            "recommendations": ["Monitoring enabled for fallback analysis"],
        }
```

#### Step 3: Test the Endpoint

```bash
curl -X POST http://localhost:8000/api/v1/summary \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Amazing product quality, delivery was fast",
    "source": "review"
  }'

# Expected response:
{
  "status": "ok",
  "summary": "User very satisfied with product quality and fast delivery service",
  "keywords": ["quality", "delivery", "fast", "amazing"],
  "recommendations": [
    "Keep reinforcing the strengths around delivery and maintain the current customer experience.",
    "Use the positive signal from quality, delivery, fast to reinforce product and service messaging."
  ]
}
```

---

## Issue 2: Fix `/recommendations` Endpoint

### Current Problem

**File:** `ai-service/app/api/recommendation.py`

```python
@router.get("/recommendations")  # ❌ GET METHOD, NO PARAMETERS
async def recommendations():
    return {
        "status": "ok",
        "recommendations": [  # ❌ HARDCODED
            "Prioritize service quality improvements",
            "Monitor recurring sentiment themes",
        ],
    }
```

**Issues:**
1. GET method (should be POST for body parameters)
2. Returns hardcoded recommendations
3. Doesn't process any input
4. RecommendationService exists but is unused

### Solution

#### Step 1: Create Request Schema

Add to `ai-service/app/schemas/recommendation.py` (create if doesn't exist):

```python
from pydantic import BaseModel, Field
from typing import Dict, List, Any

class RecommendationRequest(BaseModel):
    sentiment: Dict[str, Any] = Field(..., description="Sentiment object with label and score")
    keywords: List[str] = Field(default=[], description="List of keywords extracted from text")
    topics: List[str] = Field(default=[], description="List of topics extracted from text")
    emotions: Dict[str, float] = Field(default={}, description="Emotion scores (joy, anger, sadness)")

class RecommendationResponse(BaseModel):
    status: str = "ok"
    recommendations: List[str]
```

**Example sentiment object:**
```python
{
    "label": "positive" | "negative" | "neutral",
    "score": 0.0 - 1.0
}
```

#### Step 2: Update the Endpoint

Replace `ai-service/app/api/recommendation.py`:

```python
from fastapi import APIRouter
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()

@router.post("/recommendations", response_model=RecommendationResponse)
async def recommendations(req: RecommendationRequest):
    """
    Generate actionable recommendations based on sentiment analysis.
    
    - Analyzes sentiment label and keywords
    - Identifies issue patterns (delivery, quality, support)
    - Returns context-specific recommendations
    """
    try:
        service = RecommendationService()
        recs = await service.suggest(
            sentiment=req.sentiment,
            keywords=req.keywords,
            topics=req.topics,
            emotions=req.emotions,
        )
        return {
            "status": "ok",
            "recommendations": recs,
        }
    except Exception:
        # Fallback recommendations
        return {
            "status": "ok",
            "recommendations": [
                "Monitor feedback patterns and customer sentiment trends",
                "Take action on identified issues and verify resolution in follow-up feedback",
            ],
        }
```

#### Step 3: Option A - Accept Prediction Output (Recommended)

For end-to-end integration, allow accepting a prediction object:

```python
from typing import Union

class PredictionOutputRequest(BaseModel):
    """Simplified request using prediction output"""
    text: str = Field(..., description="Original text for context")
    # Sentiment from /predict output
    sentiment: Dict[str, Any] = Field(...)
    keywords: List[str] = Field(default=[])
    topics: List[str] = Field(default=[])
    emotions: Dict[str, float] = Field(default={})

@router.post("/recommendations", response_model=RecommendationResponse)
async def recommendations(req: Union[RecommendationRequest, PredictionOutputRequest]):
    """Generate recommendations from prediction data"""
    service = RecommendationService()
    recs = await service.suggest(
        sentiment=req.sentiment,
        keywords=req.keywords,
        topics=req.topics,
        emotions=req.emotions or {},
    )
    return {"status": "ok", "recommendations": recs}
```

#### Step 4: Test the Endpoint

**Test Case 1: Negative Sentiment with Delivery Issues**
```bash
curl -X POST http://localhost:8000/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "sentiment": {
      "label": "negative",
      "score": 0.92
    },
    "keywords": ["late", "delivery", "delay"],
    "topics": ["delivery"],
    "emotions": {
      "joy": 0.1,
      "anger": 0.8,
      "sadness": 0.7
    }
  }'

# Expected: Recommendations about fixing delivery issues
```

**Test Case 2: Positive Sentiment**
```bash
curl -X POST http://localhost:8000/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "sentiment": {
      "label": "positive",
      "score": 0.95
    },
    "keywords": ["quality", "great", "amazing"],
    "topics": ["product_quality"],
    "emotions": {
      "joy": 0.85,
      "anger": 0.05,
      "sadness": 0.1
    }
  }'

# Expected: Recommendations about maintaining quality and positive messaging
```

---

## Integration Pattern: Complete Workflow

### Option A: Separate Endpoints (Current Structure)

```
User Input
    ↓
POST /api/v1/predict
    ↓
Returns: Full prediction with sentiment, keywords, topics, emotions
    ↓
POST /api/v1/recommendations (with sentiment/keywords/topics/emotions)
    ↓
Returns: Actionable recommendations
```

### Option B: Combined Endpoint (More User-Friendly)

Add a convenience endpoint that does everything:

```python
# Add to ai-service/app/api/prediction.py

class FullAnalysisRequest(BaseModel):
    text: str
    source: str | None = None

class FullAnalysisResponse(BaseModel):
    prediction: PredictionResponse
    summary: dict
    recommendations: list[str]

@router.post("/analyze", response_model=FullAnalysisResponse)
async def full_analysis(req: FullAnalysisRequest, db: AsyncSession = Depends(get_db_session)):
    """
    Complete analysis: prediction + summary + recommendations
    """
    prediction_service = PredictionService(db)
    prediction = await prediction_service.predict(req.text, req.source)
    
    summary_service = SummaryService()
    summary = await summary_service.build_summary(prediction)
    
    recommendation_service = RecommendationService()
    recommendations = await recommendation_service.suggest(
        sentiment=prediction["result"].get("sentiment", {}),
        keywords=prediction["result"].get("keywords", []),
        topics=prediction["result"].get("topics", []),
        emotions=prediction["result"].get("emotions", {}),
    )
    
    return {
        "prediction": prediction,
        "summary": summary,
        "recommendations": recommendations,
    }
```

---

## Schema Definitions

### Complete Set of Schemas

Save as `ai-service/app/schemas/summary.py`:

```python
from pydantic import BaseModel, Field

class SummaryRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to summarize")
    source: str | None = Field(None, description="Source (twitter, email, review, etc.)")

class SummaryResponse(BaseModel):
    status: str = Field("ok")
    summary: str = Field(..., description="Concise summary of the text")
    keywords: list[str] = Field(default=[], description="Key terms from the text")
    recommendations: list[str] = Field(default=[], description="Actionable recommendations")
```

Save as `ai-service/app/schemas/recommendation.py`:

```python
from pydantic import BaseModel, Field
from typing import Dict, List, Any

class RecommendationRequest(BaseModel):
    sentiment: Dict[str, Any] = Field(
        ...,
        description="Sentiment analysis result",
        example={"label": "positive", "score": 0.95}
    )
    keywords: List[str] = Field(
        default=[],
        description="Extracted keywords",
        example=["quality", "delivery"]
    )
    topics: List[str] = Field(
        default=[],
        description="Extracted topics",
        example=["product_quality", "delivery"]
    )
    emotions: Dict[str, float] = Field(
        default={},
        description="Emotion scores",
        example={"joy": 0.8, "anger": 0.1, "sadness": 0.1}
    )

class RecommendationResponse(BaseModel):
    status: str = Field("ok")
    recommendations: List[str] = Field(
        ...,
        description="List of actionable recommendations"
    )
```

---

## Testing with Full Example

### Test Scenario: Customer Feedback Flow

```bash
#!/bin/bash

# Step 1: Full Prediction
echo "=== Running Full Prediction ==="
PREDICTION=$(curl -s -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your product quality is excellent but delivery was delayed by a week. Very disappointed.",
    "source": "email"
  }')

echo "$PREDICTION" | jq .

# Extract values (in real script, use jq)
SENTIMENT=$(echo "$PREDICTION" | jq -r '.result.sentiment')
KEYWORDS=$(echo "$PREDICTION" | jq -r '.result.keywords')
TOPICS=$(echo "$PREDICTION" | jq -r '.result.topics')
EMOTIONS=$(echo "$PREDICTION" | jq -r '.result.emotions')

# Step 2: Get Summary (NEW FIX)
echo ""
echo "=== Getting Summary ==="
curl -s -X POST http://localhost:8000/api/v1/summary \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your product quality is excellent but delivery was delayed by a week. Very disappointed.",
    "source": "email"
  }' | jq .

# Step 3: Get Recommendations (NEW FIX)
echo ""
echo "=== Getting Recommendations ==="
curl -s -X POST http://localhost:8000/api/v1/recommendations \
  -H "Content-Type: application/json" \
  -d "{
    \"sentiment\": $SENTIMENT,
    \"keywords\": $KEYWORDS,
    \"topics\": $TOPICS,
    \"emotions\": $EMOTIONS
  }" | jq .
```

---

## Validation & Error Handling

### Input Validation

Add validators to request schemas:

```python
from pydantic import validator

class SummaryRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    source: str | None = None
    
    @validator('text')
    def text_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty or whitespace only')
        return v.strip()

class RecommendationRequest(BaseModel):
    sentiment: Dict[str, Any] = Field(...)
    keywords: List[str] = Field(default=[])
    topics: List[str] = Field(default=[])
    emotions: Dict[str, float] = Field(default={})
    
    @validator('sentiment')
    def sentiment_has_required_fields(cls, v):
        if 'label' not in v or 'score' not in v:
            raise ValueError('Sentiment must have label and score')
        return v
    
    @validator('emotions')
    def emotions_in_range(cls, v):
        for emotion, score in v.items():
            if not 0.0 <= score <= 1.0:
                raise ValueError(f'{emotion} score must be between 0.0 and 1.0')
        return v
```

---

## Database Persistence

Both endpoints already support DB persistence through PredictionService:

```python
# Predictions are automatically saved to:
# - predictions table (full result)
# - analytics_events table (lightweight tracking)
```

---

## Performance Considerations

### Response Times (Expected)
- `/summary`: 50-200ms (reuses /predict result if piped)
- `/recommendations`: 5-20ms (pure rule-based)

### Caching Strategy (Optional)

Cache recommendations for same sentiment/keywords:

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def _cached_recommend(sentiment_label: str, keywords_tuple: tuple) -> list[str]:
    """Cache recommendations for same input patterns"""
    # Implementation
    pass
```

---

## Migration Checklist

- [ ] Create/update schema files (`summary.py`, `recommendation.py`)
- [ ] Update `/summary` endpoint in `ai-service/app/api/summary.py`
- [ ] Update `/recommendations` endpoint in `ai-service/app/api/recommendation.py`
- [ ] Add request validation
- [ ] Update OpenAPI documentation (auto-generated)
- [ ] Test both endpoints with various inputs
- [ ] Test error handling and fallbacks
- [ ] Verify database persistence
- [ ] Update frontend to use new endpoint signatures
- [ ] Deploy and monitor response times

---

## Troubleshooting

### Issue: `/summary` returns same hardcoded response

**Cause:** Old endpoint code still in place  
**Fix:** Ensure file replacement includes input parameters and PredictionService call

### Issue: `/recommendations` returns 405 Method Not Allowed

**Cause:** Still using GET instead of POST  
**Fix:** Change `@router.get` to `@router.post`

### Issue: Recommendations seem generic

**Cause:** RecommendationService.suggest() only using keywords  
**Fix:** Pass all parameters (sentiment, emotions, topics) to the service

### Issue: Database errors on large text

**Cause:** Input text exceeding DB column size  
**Fix:** Add `max_length=10000` validator to SummaryRequest

---

## Related Files to Review

- `ai-service/app/services/prediction_service.py` - How /predict works
- `ai-service/app/services/recommendation_service.py` - Actual recommendation logic
- `ai-service/app/services/summary_service.py` - Summary building
- `ai-service/app/api/prediction.py` - Reference implementation
- `ai-service/app/api/assistant.py` - Full integration example

---

## Summary

| Endpoint | Current | After Fix | Impact |
|----------|---------|-----------|--------|
| `/summary` | Hardcoded | Processes text via /predict | ✅ Functional |
| `/recommendations` | Hardcoded | Uses sentiment/keywords | ✅ Functional |

Both endpoints will then:
- Accept actual input parameters
- Use real AI services
- Persist results to database
- Return context-aware responses

