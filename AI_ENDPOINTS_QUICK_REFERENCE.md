# AI Prediction Endpoints - Quick Reference

## Visual Status Map

### Real Predictions (Wired & Working)
```
✅ /predict (POST)
   └─> PredictionPipeline
       ├─ Sentiment (distilbert) [REAL]
       ├─ Emotions (j-hartmann/emotion-english-distilroberta-base) [REAL]
       ├─ Keywords (KeyBERT) [REAL]
       ├─ Topics (BERTopic) [REAL]
       ├─ Summarization (facebook/bart-large-cnn) [REAL]
       ├─ Aspects (rule-based) [MOCK]
       ├─ Explainability (keyword matching) [MOCK]
       └─ Recommendations (rule-based) [MOCK]

✅ /assistant (POST)
   └─> Aggregates: /predict + RecommendationService + SummaryService
```

### DB-Backed Endpoints (Working)
```
✅ /analytics/overview (GET)
   └─> Aggregates predictions from database

✅ /analytics (GET)
   └─> AnalyticsService.build_analytics()

✅ /reports (GET)
   └─> Reports summary + recent predictions

✅ /alerts (GET)
   └─> Alert history from database

⚠️  /analytics-history (GET)
   └─> Historical analytics (needs verification)
```

### Broken Endpoints (Need Wiring)
```
❌ /summary (POST)
   ✘ Returns hardcoded data
   ✘ Ignores input
   ✘ SummaryService not used
   
   FIX: Accept request input, call PredictionService + SummaryService

❌ /recommendations (GET)
   ✘ Returns hardcoded data
   ✘ Ignores context
   ✘ RecommendationService not used
   
   FIX: Accept sentiment/keywords input, call RecommendationService.suggest()
```

---

## Model Implementation Status

| Component | Model | Type | Status | Library | Fallback |
|-----------|-------|------|--------|---------|----------|
| **Sentiment** | distilbert-base-uncased-finetuned-sst-2-english | Real | ✅ Working | transformers | Keyword-based |
| **Emotion** | j-hartmann/emotion-english-distilroberta-base | Real | ✅ Working | transformers | Keyword-based |
| **Keywords** | KeyBERT (all-MiniLM-L6-v2) | Real | ✅ Working | keybert | Token extraction |
| **Topics** | BERTopic (all-MiniLM-L6-v2) | Real | ✅ Working | bertopic | Keyword matching |
| **Summarization** | facebook/bart-large-cnn | Real | ✅ Working | transformers | Text truncation |
| **Language** | langdetect + heuristic | Real | ✅ Working | langdetect | English markers |
| **Aspects** | Rule-based (3 keywords) | Mock | ⚠️ Limited | regex | Hardcoded |
| **Explainability** | Keyword + evidence | Mock | ⚠️ Limited | (none) | Hardcoded |
| **Recommendations** | Rule-based heuristics | Mock | ⚠️ Limited | (none) | Hardcoded |

---

## Request/Response Quick Reference

### 1. `/predict` (Production-Ready)
```bash
POST /api/v1/predict
Content-Type: application/json

{
  "text": "This product is amazing!",
  "source": "twitter"
}

# Response:
{
  "id": "uuid",
  "input_text": "...",
  "language": "en",
  "confidence": 0.87,
  "result": {
    "sentiment": {"label": "positive", "score": 0.95},
    "emotions": {"joy": 0.8, "anger": 0.1, "sadness": 0.05},
    "aspects": [{"aspect": "product", "sentiment": "positive"}],
    "keywords": ["amazing", "product"],
    "topics": ["product_quality"],
    "summary": "User very satisfied...",
    "recommendations": ["Continue providing quality..."],
    "explainability": {...},
    "language": "en",
    "confidence": 0.87
  }
}
```

### 2. `/assistant` (Production-Ready)
```bash
POST /api/v1/assistant
Content-Type: application/json

{
  "prompt": "Great experience with this product",
  "source": "email"
}

# Response:
{
  "input_text": "...",
  "assistant_message": "Sentiment detected as Positive. Summary: ...",
  "response": "The analysis pipeline completed successfully.",
  "summary": "...",
  "sentiment": {...},
  "emotions": {...},
  "aspects": [...],
  "keywords": [...],
  "topics": [...],
  "language": "en",
  "confidence": 0.87,
  "insights": {...},
  "recommendations": [...],
  "actionableRecommendations": [...],
  "explanation": {...}
}
```

### 3. `/summary` (BROKEN - Hardcoded)
```bash
POST /api/v1/summary
# No parameters accepted!

# Response (ALWAYS SAME):
{
  "status": "ok",
  "summary": "Customer feedback indicates positive sentiment and strong product satisfaction.",
  "keywords": ["support", "quality"],
  "recommendations": ["Continue monitoring customer experience"]
}

# FIX NEEDED:
POST /api/v1/summary
Content-Type: application/json

{
  "text": "The product quality is great",
  "source": "survey"
}
```

### 4. `/recommendations` (BROKEN - Hardcoded)
```bash
GET /api/v1/recommendations
# No parameters accepted!

# Response (ALWAYS SAME):
{
  "status": "ok",
  "recommendations": [
    "Prioritize service quality improvements",
    "Monitor recurring sentiment themes"
  ]
}

# FIX NEEDED:
POST /api/v1/recommendations
Content-Type: application/json

{
  "sentiment": {"label": "negative", "score": 0.92},
  "keywords": ["delivery", "late"],
  "topics": ["delivery"],
  "emotions": {"joy": 0.1, "anger": 0.8, "sadness": 0.7}
}
```

### 5. `/analytics/overview` (Working)
```bash
GET /api/v1/analytics/overview

# Response:
{
  "total_events": 100,
  "negative": 25,
  "positive": 60,
  "neutral": 15,
  "negative_ratio_percent": 25.0,
  "recent": [
    {
      "id": "uuid",
      "sentiment_label": "positive",
      "sentiment_score": 0.95,
      "topics": ["product_quality"],
      "keywords": ["good", "reliable"],
      "summary": "...",
      "created_at": "2026-08-15T10:30:00"
    }
  ]
}
```

### 6. `/analytics` (Working)
```bash
GET /api/v1/analytics?limit=20

# Response:
{
  "status": "ok",
  "data": {
    "total_predictions": 20,
    "sentiment_breakdown": {
      "positive": 12,
      "negative": 5,
      "neutral": 3
    },
    "topics": ["delivery", "pricing", "product_quality", "support"]
  }
}
```

### 7. `/reports` (Working)
```bash
GET /api/v1/reports?limit=20

# Response:
{
  "status": "ok",
  "data": {
    "report_summary": {
      "total_predictions": 20,
      "sentiment_breakdown": {...},
      "topics": [...]
    },
    "recent_predictions": [
      {
        "id": "uuid",
        "input_text": "...",
        "language": "en",
        "confidence": 0.87,
        "sentiment": {"label": "positive", "score": 0.95},
        "created_at": "2026-08-15T10:30:00"
      }
    ]
  }
}
```

### 8. `/alerts` (Working)
```bash
GET /api/v1/alerts?limit=50

# Response:
[
  {
    "id": "uuid",
    "level": "warning|critical|info",
    "message": "Alert description",
    "payload": {...},
    "created_at": "2026-08-15T10:30:00"
  }
]
```

---

## Critical Issues (Must Fix)

| # | Issue | Severity | Location | Impact |
|---|-------|----------|----------|--------|
| 1 | `/summary` returns hardcoded data | 🔴 HIGH | prediction.py | Endpoint unusable |
| 2 | `/recommendations` returns hardcoded data | 🔴 HIGH | recommendation.py | Endpoint unusable |
| 3 | Aspects extraction only 3 keywords | 🟡 MEDIUM | aspect/extractor.py | Limited functionality |
| 4 | Explainability minimal | 🟡 MEDIUM | explainability/explainer.py | Poor interpretability |
| 5 | Recommendations rule-based only | 🟡 MEDIUM | recommendation/recommend.py | Limited intelligence |

---

## Model Load Times & Memory

**First Startup:** ~5-10 minutes (all models download/load)  
**Total Memory:** ~2.5 GB

| Model | Size | Load Time | Type |
|-------|------|-----------|------|
| DistilBERT (sentiment) | 268 MB | 30-60s | Lazy load |
| DistilRoBERTa (emotion) | 316 MB | 30-60s | Lazy load |
| KeyBERT + embeddings | 140 MB | 10-20s | Lazy load |
| BERTopic + embeddings | 140 MB | 20-30s | Lazy load |
| BART (summarization) | 1.6 GB | 60-120s | Lazy load |

**Note:** Models are lazy-loaded on first use and cached thereafter

---

## Configuration Control

```bash
# Force dummy models (testing)
export USE_DUMMY_MODELS=true

# Use real models (production)
export USE_DUMMY_MODELS=false

# Model cache location
export MODEL_CACHE_DIR=/models

# Other key settings
export ENVIRONMENT=development|production
export DATABASE_URL=...
export REDIS_URL=...
```

---

## Files to Check

### Core API Files
- `/workspaces/IntelSense/ai-service/app/api/prediction.py` ✅ Working
- `/workspaces/IntelSense/ai-service/app/api/assistant.py` ✅ Working
- `/workspaces/IntelSense/ai-service/app/api/summary.py` ❌ Needs fix
- `/workspaces/IntelSense/ai-service/app/api/recommendation.py` ❌ Needs fix

### Service Layer
- `/workspaces/IntelSense/ai-service/app/services/prediction_service.py` ✅
- `/workspaces/IntelSense/ai-service/app/services/recommendation_service.py` ✅
- `/workspaces/IntelSense/ai-service/app/services/summary_service.py` ✅
- `/workspaces/IntelSense/ai-service/app/services/analytics_service.py` ✅

### AI Modules
- `/workspaces/IntelSense/ai-service/app/ai/pipelines/prediction_pipeline.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/sentiment/predict.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/emotion/predict.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/keywords/extract.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/topics/model.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/summarization/summarize.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/aspect/extractor.py` ⚠️ Rule-based
- `/workspaces/IntelSense/ai-service/app/ai/recommendation/recommend.py` ⚠️ Rule-based
- `/workspaces/IntelSense/ai-service/app/ai/explainability/explainer.py` ⚠️ Limited

### Model Loaders
- `/workspaces/IntelSense/ai-service/app/ai/models/roberta_loader.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/models/bart_loader.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/models/keybert_loader.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/models/bertopic_loader.py` ✅
- `/workspaces/IntelSense/ai-service/app/ai/models/dummy.py` ✅

---

## Next Steps

### Immediate (Fix Broken Endpoints)
1. Wire `/summary` endpoint to accept text input
2. Wire `/recommendations` endpoint to accept sentiment/keywords
3. Add request validation schemas

### Short Term (Improve Implementations)
1. Implement real ABSA model for aspects
2. Enhance explainability with SHAP
3. Improve recommendations with ML model

### Medium Term (Optimize & Scale)
1. Add model quantization for faster inference
2. Implement batch processing for multiple predictions
3. Add multi-language support

---

**Full detailed analysis available in:** `AI_PREDICTION_ENDPOINTS_ANALYSIS.md`

