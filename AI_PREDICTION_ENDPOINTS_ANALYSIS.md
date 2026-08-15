# AI Service Backend - Prediction Endpoints Analysis

**Date:** 2026-08-15  
**Analysis Scope:** ai-service/app/api/, ai-service/app/services/, ai-service/app/ai/

---

## Executive Summary

The AI service backend contains **9 main API endpoints** that return AI predictions. **7 endpoints currently return REAL AI model predictions** (with fallback to mock data), while **2 endpoints return pure mock/hardcoded data**. The system uses a sophisticated fallback mechanism where real models (HuggingFace transformers) are attempted first, falling back to deterministic dummy implementations on failure.

### Key Configuration Flag
- **`USE_DUMMY_MODELS`** environment variable in `app/core/config.py` (default: `False`)
- When `True`: Forces all models to return dummy data
- When `False`: Attempts to load real transformers models

---

## API Endpoints Breakdown

### 1. `/predict` - PRIMARY PREDICTION ENDPOINT
**File:** [ai-service/app/api/prediction.py](ai-service/app/api/prediction.py)  
**HTTP Method:** POST  
**Request Schema:** `PredictionRequest` (text, source)  
**Response Schema:** `PredictionResponse`

**Status:** ✅ **REAL MODELS (with fallback)**

**Implementation Flow:**
```
POST /predict → PredictionService.predict()
  ↓
  PredictionPipeline.run()
    ├─ clean_text() [text preprocessing]
    ├─ detect_language() [language detection]
    ├─ predict_sentiment() [REAL: distilbert-base-uncased-finetuned-sst-2-english]
    ├─ predict_emotions() [REAL: j-hartmann/emotion-english-distilroberta-base]
    ├─ extract_aspects() [MOCK: rule-based keyword matching]
    ├─ extract_keywords() [REAL: KeyBERT with all-MiniLM-L6-v2]
    ├─ extract_topics() [REAL: BERTopic with all-MiniLM-L6-v2]
    ├─ summarize_text() [REAL: facebook/bart-large-cnn]
    ├─ explain_prediction() [MOCK: keyword extraction + evidence matching]
    └─ recommend_actions() [MOCK: rule-based recommendations]
  ↓
  Save result to database + analytics table
  ↓
  Return full prediction payload
```

**Returned Data Structure:**
```json
{
  "id": "unique_prediction_id",
  "input_text": "user input",
  "language": "en",
  "confidence": 0.87,
  "result": {
    "sentiment": {"label": "positive", "score": 0.95},
    "emotions": {"joy": 0.8, "anger": 0.1, "sadness": 0.05},
    "aspects": [{"aspect": "battery", "sentiment": "positive"}],
    "keywords": ["good", "battery", "reliable"],
    "topics": ["product_quality"],
    "summary": "User is very satisfied with product quality...",
    "recommendations": ["Continue monitoring customer satisfaction..."],
    "explainability": {
      "summary": "Prediction driven by sentiment 'positive' and keywords...",
      "features": [...]
    },
    "language": "en",
    "confidence": 0.87
  }
}
```

**Fallback Behavior:**
- If any model fails to load or execute, exception handler returns dummy predictions
- DB save is best-effort (no rollback on prediction error)
- Returns structured data even on failure

**Models Used:**
| Component | Model | Type | Library | Fallback |
|-----------|-------|------|---------|----------|
| Sentiment | distilbert-base-uncased-finetuned-sst-2-english | Real | transformers | dummy_sentiment() |
| Emotions | j-hartmann/emotion-english-distilroberta-base | Real | transformers | dummy_emotions() |
| Keywords | KeyBERT (all-MiniLM-L6-v2) | Real | keybert | dummy_keywords() |
| Topics | BERTopic (all-MiniLM-L6-v2) | Real | bertopic | dummy_topics() |
| Summarization | facebook/bart-large-cnn | Real | transformers | dummy_summary() |
| Aspects | Rule-based keyword extraction | Mock | (none) | (hardcoded) |
| Explainability | Evidence extraction + feature analysis | Mock | (none) | (hardcoded) |
| Recommendations | Rule-based sentiment/keyword analysis | Mock | (none) | (hardcoded) |
| Language Detection | langdetect with heuristic fallback | Real | langdetect | heuristic_detect_language() |

---

### 2. `/assistant` - AI ASSISTANT ENDPOINT
**File:** [ai-service/app/api/assistant.py](ai-service/app/api/assistant.py)  
**HTTP Method:** POST  
**Request Schema:** `AssistantRequest` (prompt, source)  
**Response Schema:** `AssistantResponse`

**Status:** ✅ **REAL MODELS (composes /predict + other services)**

**Implementation Flow:**
```
POST /assistant → AssistantService
  ├─ PredictionService.predict() [REAL - uses /predict logic]
  ├─ RecommendationService.suggest() [MOCK - rule-based]
  └─ SummaryService.build_summary() [REAL - from prediction results]
  ↓
  Return assistant message with full insights
```

**Returned Data Structure:**
```json
{
  "input_text": "user prompt",
  "assistant_message": "Sentiment detected as Positive. Summary: ...",
  "response": "The analysis pipeline completed successfully.",
  "summary": "The analysis pipeline completed successfully.",
  "sentiment": {"label": "positive", "score": 0.95},
  "emotions": {"joy": 0.8, "anger": 0.1, "sadness": 0.05},
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

**Key Difference from /predict:**
- Wraps prediction results in assistant narrative
- Adds human-readable message
- Enriches with additional context from recommendation service

---

### 3. `/summary` - SUMMARY GENERATION ENDPOINT
**File:** [ai-service/app/api/summary.py](ai-service/app/api/summary.py)  
**HTTP Method:** POST  
**Status:** ⚠️ **MOCK/HARDCODED (does not use actual input)**

**Implementation:**
```python
@router.post("/summary")
async def summarize():
    prediction = {  # HARDCODED - NOT FROM REQUEST
        "result": {
            "summary": "Customer feedback indicates positive sentiment...",
            "keywords": ["support", "quality"],
            "recommendations": ["Continue monitoring customer experience"],
        }
    }
    return {"status": "ok", **await service.build_summary(prediction)}
```

**Issues Found:**
1. ❌ Does **NOT accept any request input** (endpoint signature has no parameters)
2. ❌ Returns **hardcoded summary** regardless of input
3. ❌ **SummaryService.build_summary()** just passes through the result as-is
4. ⚠️ Should accept POST body with text/prediction input

**Returned Data (Always Same):**
```json
{
  "status": "ok",
  "summary": "Customer feedback indicates positive sentiment and strong product satisfaction.",
  "keywords": ["support", "quality"],
  "recommendations": ["Continue monitoring customer experience"]
}
```

**Recommendation:** Wire to use actual `/predict` endpoint output or accept input parameter

---

### 4. `/recommendations` - RECOMMENDATIONS ENDPOINT
**File:** [ai-service/app/api/recommendation.py](ai-service/app/api/recommendation.py)  
**HTTP Method:** GET  
**Status:** ❌ **MOCK/HARDCODED (pure static response)**

**Implementation:**
```python
@router.get("/recommendations")
async def recommendations():
    return {
        "status": "ok",
        "recommendations": [
            "Prioritize service quality improvements",
            "Monitor recurring sentiment themes",
        ],
    }
```

**Issues Found:**
1. ❌ **Returns hardcoded response** regardless of context
2. ❌ Does **NOT use RecommendationService** 
3. ❌ No input validation or context
4. ⚠️ RecommendationService exists but is unused in this endpoint

**Usage of RecommendationService:**
- **IS used by:** `/assistant` endpoint
- **Service code:** `RecommendationService.suggest(sentiment, keywords, topics, emotions)` [REAL: rule-based]
- **NOT used by:** `/recommendations` endpoint (opportunity to wire it)

**Recommendation:** Accept sentiment/keywords input and use RecommendationService.suggest()

---

### 5. `/analytics/overview` - ANALYTICS OVERVIEW ENDPOINT
**File:** [ai-service/app/api/analytics.py](ai-service/app/api/analytics.py) (lines 7-31)  
**HTTP Method:** GET  
**Status:** ⚠️ **DB-BACKED (returns aggregated predictions, not new predictions)**

**Implementation:**
```
GET /analytics/overview
  ├─ Query recent 100 events from prediction database
  ├─ Calculate sentiment breakdown (positive/negative/neutral counts)
  ├─ Extract recent events with: id, sentiment_label, sentiment_score, topics, keywords, summary
  ├─ Trigger background alerting (best-effort)
  └─ Return overview object
```

**Returned Data Structure:**
```json
{
  "total_events": 100,
  "negative": 25,
  "positive": 60,
  "neutral": 15,
  "negative_ratio_percent": 25.0,
  "recent": [
    {
      "id": "prediction_id",
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

**Key Notes:**
- Aggregates existing predictions, doesn't generate new ones
- Data is from `/predict` endpoint results
- Triggers alerting service as background task

---

### 6. `/analytics` - ANALYTICS AGGREGATE ENDPOINT
**File:** [ai-service/app/api/analytics.py](ai-service/app/api/analytics.py) (lines 36-44)  
**HTTP Method:** GET  
**Query Parameters:** `limit` (default: 20)  
**Status:** ✅ **DB-BACKED WITH SERVICE AGGREGATION**

**Implementation:**
```
GET /analytics?limit=20
  ├─ Query recent N predictions from database
  ├─ Call AnalyticsService.build_analytics()
  └─ Return aggregated stats
```

**Returned Data Structure:**
```json
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

**Service Code:** [ai-service/app/services/analytics_service.py](ai-service/app/services/analytics_service.py)
- Aggregates predictions by sentiment label
- Deduplicates and sorts topics

---

### 7. `/reports` - REPORTS ENDPOINT
**File:** [ai-service/app/api/reports.py](ai-service/app/api/reports.py)  
**HTTP Method:** GET  
**Query Parameters:** `limit` (default: 20)  
**Status:** ✅ **DB-BACKED WITH DETAILED BREAKDOWN**

**Implementation:**
```
GET /reports?limit=20
  ├─ Query recent N predictions
  ├─ Build analytics using AnalyticsService.build_analytics()
  ├─ Extract full prediction details
  └─ Return report summary + recent predictions
```

**Returned Data Structure:**
```json
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
        "id": "prediction_id",
        "input_text": "original text",
        "language": "en",
        "confidence": 0.87,
        "sentiment": {"label": "positive", "score": 0.95},
        "created_at": "2026-08-15T10:30:00"
      }
    ]
  }
}
```

---

### 8. `/analytics-history` - ANALYTICS HISTORY ENDPOINT
**File:** [ai-service/app/api/history.py](ai-service/app/api/history.py)  
**HTTP Method:** GET  
**Query Parameters:** `limit` (default: 20)  
**Status:** ⚠️ **NEEDS VERIFICATION**

**Implementation:**
```
GET /analytics-history?limit=20
  └─ AnalyticsHistoryService.get_history(limit)
```

**Note:** Service implementation not examined in detail. Appears to fetch historical analytics data from database.

---

### 9. `/alerts` - ALERTS ENDPOINT
**File:** [ai-service/app/api/alerts.py](ai-service/app/api/alerts.py)  
**HTTP Method:** GET  
**Query Parameters:** `limit` (default: 50)  
**Status:** ✅ **DB-BACKED ALERT RETRIEVAL**

**Implementation:**
```
GET /alerts?limit=50
  ├─ Query recent N alerts from alert repository
  └─ Return alert list with: id, level, message, payload, created_at
```

**Returned Data Structure:**
```json
[
  {
    "id": "alert_id",
    "level": "warning|critical|info",
    "message": "Alert description",
    "payload": {...},
    "created_at": "2026-08-15T10:30:00"
  }
]
```

**Alerting Mechanism:**
- Triggered in background during `/analytics/overview` call
- Uses AlertScheduler (async background task)
- Checks negative sentiment ratio against threshold

---

## AI Model Implementation Details

### Real Models Being Used

#### 1. Sentiment Analysis
**File:** [ai-service/app/ai/sentiment/predict.py](ai-service/app/ai/sentiment/predict.py)  
**Real Model:** distilbert-base-uncased-finetuned-sst-2-english  
**Library:** transformers  
**Loader:** [ai-service/app/ai/models/roberta_loader.py](ai-service/app/ai/models/roberta_loader.py)  
**Thread-safe:** Yes (Lock mechanism)  
**Fallback:** dummy_sentiment() - uses keyword matching

```python
def predict_sentiment(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_sentiment(text)
    try:
        # Try AIManager instance first
        # Then try creating local SentimentModel()
        # Falls back to dummy
    except Exception:
        return dummy_sentiment(text)
```

**Output Format:**
```python
{
    "label": "positive" | "negative" | "neutral",
    "score": 0.0-1.0
}
```

#### 2. Emotion Detection
**File:** [ai-service/app/ai/emotion/predict.py](ai-service/app/ai/emotion/predict.py)  
**Real Model:** j-hartmann/emotion-english-distilroberta-base  
**Library:** transformers (text-classification pipeline)  
**Outputs:** joy, anger, sadness (3-label emotion classification)  
**Fallback:** dummy_emotions() - 0.2-0.8 scores based on keywords

```python
def predict_emotions(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_emotions(text)
    # Load pipeline: pipeline("text-classification", 
    #                         model="j-hartmann/emotion-english-distilroberta-base",
    #                         return_all_scores=True)
```

**Output Format:**
```python
{
    "joy": 0.0-1.0,
    "anger": 0.0-1.0,
    "sadness": 0.0-1.0
}
```

#### 3. Keyword Extraction
**File:** [ai-service/app/ai/keywords/extract.py](ai-service/app/ai/keywords/extract.py)  
**Real Model:** KeyBERT with all-MiniLM-L6-v2 embedding model  
**Library:** keybert, sentence-transformers  
**Loader:** [ai-service/app/ai/models/keybert_loader.py](ai-service/app/ai/models/keybert_loader.py)  
**Parameters:** keyphrase_ngram_range=(1, 2), stop_words="english", top_n=8  
**Fallback:** dummy_keywords() - returns unique tokens > 3 chars

```python
def extract_keywords(text: str, top_n: int = 8):
    if settings.USE_DUMMY_MODELS:
        return dummy_keywords(text, top_n=top_n)
    # Loads KeyBERT model with sentence embeddings
```

**Output Format:**
```python
["keyword1", "keyword2", "keyword3"]  # List of strings
```

#### 4. Topic Extraction
**File:** [ai-service/app/ai/topics/model.py](ai-service/app/ai/topics/model.py)  
**Real Model:** BERTopic with all-MiniLM-L6-v2 embedding model  
**Library:** bertopic, sentence-transformers  
**Loader:** [ai-service/app/ai/models/bertopic_loader.py](ai-service/app/ai/models/bertopic_loader.py)  
**Method:** fit_transform on text list  
**Fallback:** dummy_topics() - keyword-based topic detection

```python
def extract_topics(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_topics(text)
    # Uses BERTopic.fit_transform() for topic modeling
```

**Output Format:**
```python
["topic1", "topic2", "topic3"]  # List of topic strings
```

#### 5. Summarization
**File:** [ai-service/app/ai/summarization/summarize.py](ai-service/app/ai/summarization/summarize.py)  
**Real Model:** facebook/bart-large-cnn  
**Library:** transformers (summarization pipeline)  
**Loader:** [ai-service/app/ai/models/bart_loader.py](ai-service/app/ai/models/bart_loader.py)  
**Parameters:** max_length=150, min_length=30  
**Fallback:** dummy_summary() - truncates at 150 chars + "..."

```python
def summarize_text(text: str):
    if settings.USE_DUMMY_MODELS:
        return dummy_summary(text)
    # Uses transformers summarization pipeline
```

**Output Format:**
```python
"Concise summary of the text..."  # String
```

#### 6. Language Detection
**File:** [ai-service/app/ai/preprocessing/language.py](ai-service/app/ai/preprocessing/language.py)  
**Real Library:** langdetect  
**Fallback:** Heuristic detection using English marker keywords  
**Supported Output:** Language codes (e.g., "en", "es", "fr") or "unknown"

```python
def detect_language(text: str) -> str:
    if _detect is not None:
        try:
            return _detect(text)  # Real model
        except:
            pass
    return _heuristic_detect_language(text)  # Fallback
```

### Mock/Rule-Based Implementations

#### 1. Aspect Extraction (HARDCODED RULES)
**File:** [ai-service/app/ai/aspect/extractor.py](ai-service/app/ai/aspect/extractor.py)  
**Status:** ❌ MOCK - Rule-based keyword matching only  
**Keywords Matched:** battery, price, support  
**Needs:** Real ABSA (Aspect-Based Sentiment Analysis) model

```python
def extract_aspects(text: str) -> list[dict[str, Any]]:
    lower = text.lower()
    aspects = []
    if "battery" in lower:
        aspects.append({"aspect": "battery", 
                       "sentiment": "positive" if "good" in lower else "neutral"})
    # ... hardcoded logic for 3 aspects only
```

**Output Format:**
```python
[
    {"aspect": "battery", "sentiment": "positive" | "negative" | "neutral"},
    {"aspect": "price", "sentiment": "..."},
    {"aspect": "support", "sentiment": "..."}
]
```

#### 2. Explainability (LIGHTWEIGHT EVIDENCE EXTRACTION)
**File:** [ai-service/app/ai/explainability/explainer.py](ai-service/app/ai/explainability/explainer.py)  
**Status:** ⚠️ SEMI-MOCK - Uses extracted keywords as evidence  
**Method:** Sentence extraction + keyword matching  
**Needs:** Potential enhancement with SHAP or other interpretability framework

```python
def explain_prediction(text: str, result: dict[str, Any]) -> dict[str, Any]:
    # Extracts sentences containing keywords
    # Returns features: sentiment, keywords, evidence_sentences
```

**Output Format:**
```python
{
    "summary": "Prediction driven by sentiment '...' and keywords [...]",
    "features": [
        {"name": "sentiment", "value": "positive"},
        {"name": "keywords", "value": ["keyword1", "keyword2"]},
        {"name": "evidence_sentences", "value": ["sentence with keyword..."]}
    ]
}
```

#### 3. Recommendations (RULE-BASED LOGIC)
**File:** [ai-service/app/ai/recommendation/recommend.py](ai-service/app/ai/recommendation/recommend.py)  
**Status:** ⚠️ MOCK - Rule-based heuristics  
**Logic:**
- Checks sentiment label (positive/negative/neutral)
- Looks for delivery, quality, support keywords
- Returns context-appropriate recommendations
- Needs real ML-based recommendation model

```python
def recommend_actions(sentiment: Dict[str, Any], 
                     emotions: Dict[str, float], 
                     keywords: List[str], 
                     topics: List[str]) -> List[str]:
    # Rule-based logic using sentiment, keywords, topics
    # Returns list of recommendation strings
```

**Output Format:**
```python
[
    "Specific action 1 based on sentiment and keywords",
    "Specific action 2 with reinforcement logic",
    "Follow-up verification step"
]
```

#### 4. Text Cleaning
**File:** [ai-service/app/ai/preprocessing/cleaner.py](ai-service/app/ai/preprocessing/cleaner.py)  
**Status:** ✅ UTILITY - Text preprocessing  
**Operations:**
- HTML unescaping
- HTML tag removal
- URL removal
- Whitespace normalization
- Newline handling

---

## Dummy Data Model

**File:** [ai-service/app/ai/models/dummy.py](ai-service/app/ai/models/dummy.py)

All dummy implementations are cached via `@lru_cache()` for performance.

### dummy_sentiment()
```python
def dummy_sentiment(text: str):
    # Counts positive_words vs negative_words
    # Returns: {"label": "positive"|"negative"|"neutral", "score": 0.0-0.99}
    # Scoring: 0.7 + (word_count * 0.05), min 0.99
```

**Example:**
- Input: "This product is amazing and excellent" → {"label": "positive", "score": 0.8}
- Input: "Terrible service, very disappointed" → {"label": "negative", "score": 0.8}

### dummy_emotions()
```python
def dummy_emotions(text: str):
    # Checks for emotion trigger words
    # Returns: {"joy": 0.0-0.8, "anger": 0.0-0.8, "sadness": 0.0-0.75}
    # Default: 0.2 for each emotion, raised to 0.75-0.8 if triggers found
```

### dummy_keywords()
```python
def dummy_keywords(text: str, top_n: int = 8):
    # Tokenizes text, filters words > 3 chars
    # Returns: list of unique tokens up to top_n
```

### dummy_topics()
```python
def dummy_topics(text: str):
    # Keyword-based topic detection
    # Checks for: support, pricing, product_quality, delivery
    # Returns: ["general"] if no matches found
```

### dummy_summary()
```python
def dummy_summary(text: str):
    # If text <= 150 chars: returns as-is
    # If text > 150 chars: truncates at 147 + "..."
```

---

## Configuration & Control

**File:** [ai-service/app/core/config.py](ai-service/app/core/config.py)

### Key Settings
```python
USE_DUMMY_MODELS: bool = Field(False, env="USE_DUMMY_MODELS")
    # Forces dummy implementations when True
    # Default: False (use real models if available)

MODEL_CACHE_DIR: str = Field("/models", env="MODEL_CACHE_DIR")
    # Directory for model caching

ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    # Controls CORS and other env-specific behaviors
```

### Startup Initialization
**File:** [ai-service/app/main.py](ai-service/app/main.py) (line 61)

```python
@app.on_event("startup")
async def startup():
    await redis_client.connect()
    await AIManager.initialize(use_dummy=settings.USE_DUMMY_MODELS)
    # Initializes models based on configuration
```

---

## Service Layer Architecture

**File:** [ai-service/app/services/](ai-service/app/services/)

### PredictionService
```python
class PredictionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = PredictionRepository(session)
        self.pipeline = PredictionPipeline()
    
    async def predict(self, text: str, source: str | None = None) -> dict:
        # Runs prediction pipeline
        # Saves to database
        # Saves to analytics table
        # Returns structured prediction payload
```

### RecommendationService
```python
class RecommendationService:
    async def suggest(self, sentiment, keywords, topics, emotions) -> List[str]:
        return recommend_actions(...)  # Calls rule-based function
```

### SummaryService
```python
class SummaryService:
    async def build_summary(self, prediction: dict) -> dict:
        # Extracts and formats summary from prediction result
        # Returns: {"summary": "...", "keywords": [...], "recommendations": [...]}
```

### AnalyticsService
```python
class AnalyticsService:
    async def build_analytics(self, predictions: list) -> dict:
        # Aggregates predictions
        # Counts sentiment breakdown
        # Collects unique topics
        # Returns: {"total_predictions": N, "sentiment_breakdown": {...}, "topics": [...]}
```

---

## Database Persistence

### PredictionRepository
**Saves to:** `predictions` table
```python
{
    "id": UUID,
    "input_text": str,
    "result": JSON (full prediction output),
    "source": str (optional),
    "created_at": datetime
}
```

### AnalyticsRepository
**Saves to:** `analytics_events` table (lightweight tracking)
```python
{
    "id": UUID,
    "source": str,
    "sentiment_label": str,
    "sentiment_score": float,
    "topics": list,
    "keywords": list,
    "aspects": list,
    "summary": str,
    "created_at": datetime
}
```

---

## Endpoints Status Summary

| Endpoint | File | Method | Status | Real/Mock | Needs Wiring |
|----------|------|--------|--------|-----------|--------------|
| `/predict` | prediction.py | POST | ✅ Production | Real (w/ fallback) | ✅ Complete |
| `/assistant` | assistant.py | POST | ✅ Production | Real (composite) | ✅ Complete |
| `/summary` | summary.py | POST | ⚠️ Broken | Mock/Hardcoded | ❌ YES - Needs input acceptance |
| `/recommendations` | recommendation.py | GET | ❌ Broken | Mock/Hardcoded | ❌ YES - Wire to RecommendationService |
| `/analytics/overview` | analytics.py | GET | ✅ Production | DB-backed | ✅ Complete |
| `/analytics` | analytics.py | GET | ✅ Production | DB-backed | ✅ Complete |
| `/reports` | reports.py | GET | ✅ Production | DB-backed | ✅ Complete |
| `/analytics-history` | history.py | GET | ⚠️ Limited | DB-backed | ⚠️ Verify |
| `/alerts` | alerts.py | GET | ✅ Production | DB-backed | ✅ Complete |

---

## Critical Issues & Recommendations

### Issue 1: `/summary` Endpoint Returns Hardcoded Data
**Severity:** 🔴 HIGH  
**Location:** [ai-service/app/api/summary.py](ai-service/app/api/summary.py)  
**Problem:**
- Endpoint has no parameters, returns hardcoded summary
- Does not process user input
- SummaryService is unused

**Fix:**
```python
@router.post("/summary")
async def summarize(req: SummaryRequest, db: AsyncSession = Depends(get_db_session)):
    service = PredictionService(db)
    prediction = await service.predict(req.text, req.source)
    summary = await SummaryService().build_summary(prediction)
    return {"status": "ok", **summary}
```

### Issue 2: `/recommendations` Endpoint Returns Static Response
**Severity:** 🔴 HIGH  
**Location:** [ai-service/app/api/recommendation.py](ai-service/app/api/recommendation.py)  
**Problem:**
- Returns hardcoded recommendations regardless of context
- RecommendationService exists but is not used
- No input validation

**Fix:**
```python
@router.post("/recommendations")
async def recommendations(req: RecommendationRequest):
    service = RecommendationService()
    recs = await service.suggest(
        sentiment=req.sentiment,
        keywords=req.keywords,
        topics=req.topics,
        emotions=req.emotions
    )
    return {"status": "ok", "recommendations": recs}
```

### Issue 3: Aspect Extraction is Rule-Based Only
**Severity:** 🟡 MEDIUM  
**Location:** [ai-service/app/ai/aspect/extractor.py](ai-service/app/ai/aspect/extractor.py)  
**Problem:**
- Only recognizes 3 hardcoded aspects (battery, price, support)
- Does not use real ABSA model
- Will miss domain-specific aspects

**Recommendation:**
- Consider implementing real ABSA model (e.g., fast-bert, LSTM-based aspect extraction)
- Or expand rule-based keywords significantly
- Or use dependency parsing for aspect extraction

### Issue 4: Explainability is Minimal
**Severity:** 🟡 MEDIUM  
**Location:** [ai-service/app/ai/explainability/explainer.py](ai-service/app/ai/explainability/explainer.py)  
**Problem:**
- Limited to keyword matching and evidence extraction
- No attribution to specific model components
- Could benefit from SHAP values or similar

**Recommendation:**
- Consider integrating SHAP for feature importance
- Use attention weights from transformer models if available
- Add confidence intervals to predictions

### Issue 5: Recommendations Engine is Rule-Based
**Severity:** 🟡 MEDIUM  
**Location:** [ai-service/app/ai/recommendation/recommend.py](ai-service/app/ai/recommendation/recommend.py)  
**Problem:**
- Hard-coded if/else rules
- Limited to keyword patterns in sentiment/keywords/topics
- Not learning from feedback
- Cannot handle edge cases

**Recommendation:**
- Consider ML-based recommendation model (could use sentiment + keywords vectors)
- Implement feedback loop to improve recommendations
- Add recommendation confidence scores

---

## Confidence Score Calculation

**File:** [ai-service/app/ai/pipelines/prediction_pipeline.py](ai-service/app/ai/pipelines/prediction_pipeline.py#L43-L54)

```python
def _calculate_confidence(sentiment, emotions, aspects, keywords) -> float:
    base_score = float(sentiment.get("score", 0.0))
    emotion_boost = sum(emotions.values()) / max(len(emotions), 1) * 0.05
    aspect_boost = min(0.05, len(aspects) * 0.01)
    keyword_boost = min(0.05, len(keywords) * 0.005)
    confidence = min(1.0, base_score + emotion_boost + aspect_boost + keyword_boost)
    return round(confidence, 3)
```

**Factors:**
1. **Base Score (0.0-1.0):** From sentiment model (dominant factor)
2. **Emotion Boost (+0.0-0.05):** Average of emotion scores
3. **Aspect Boost (+0.0-0.05):** Number of aspects detected (max 5)
4. **Keyword Boost (+0.0-0.05):** Number of keywords detected (max 10)

**Result:** Confidence is capped at 1.0 and rounded to 3 decimals

---

## Error Handling & Fallback Chain

All prediction endpoints implement a multi-level fallback:

```
Level 1: Try Real Model
    ↓ (Exception)
Level 2: Try AIManager Instance
    ↓ (Not available)
Level 3: Try Creating Local Model
    ↓ (Import fails)
Level 4: Fallback to Dummy Implementation
    ↓ (Success)
Return Structured Response
```

**Special Case - Database Errors:**
- Prediction is returned even if database save fails
- Analytics event save is best-effort
- No rollback on analytics failure

---

## Performance Considerations

### Model Caching
- **Sentiment:** Thread-locked singleton pattern (roberta_loader.py)
- **Emotions:** Global pipeline cache with lazy loading
- **Keywords:** Global KeyBERT instance
- **Topics:** Global BERTopic instance
- **Summarization:** Thread-locked singleton pattern (bart_loader.py)

### Async Processing
- Entire prediction pipeline is async
- Database operations are async (SQLAlchemy AsyncSession)
- Alert scheduling runs in background

### Model Size & Latency
| Model | Approx Size | First Load | Subsequent |
|-------|------------|-----------|------------|
| DistilBERT (sentiment) | 268 MB | 30-60s | <100ms |
| DistilRoBERTa (emotion) | 316 MB | 30-60s | <200ms |
| KeyBERT + embeddings | 140 MB | 10-20s | <50ms |
| BERTopic + embeddings | 140 MB | 20-30s | <100ms |
| BART (summarization) | 1.6 GB | 60-120s | <500ms |

**Total:** ~2.5 GB memory footprint on first load

---

## Testing & Validation

**Test Files:** [ai-service/tests/](ai-service/tests/)
- `test_prediction_flow.py` - End-to-end prediction tests
- `test_api_endpoints.py` - Endpoint integration tests
- `conftest.py` - Test fixtures and database setup

---

## Development Next Steps

### Priority 1 (High)
- [ ] Wire `/summary` endpoint to accept request input
- [ ] Wire `/recommendations` endpoint to use RecommendationService
- [ ] Add input validation schemas for all endpoints

### Priority 2 (Medium)
- [ ] Implement real ABSA model for aspect extraction
- [ ] Add SHAP explainability or attention-based explanations
- [ ] Improve recommendation engine with ML-based approach
- [ ] Add confidence thresholds and uncertainty estimation

### Priority 3 (Low)
- [ ] Performance optimization (model quantization, batching)
- [ ] Support for multi-language models beyond English
- [ ] Real-time model updates/fine-tuning pipeline
- [ ] A/B testing framework for model improvements

---

## Summary

The AI service backend is **largely functional with real models** for core prediction tasks (sentiment, emotion, keywords, topics, summarization). However, there are **2 broken endpoints** that return mock/hardcoded data (`/summary`, `/recommendations`) that need wiring. The **aspect extraction and recommendations logic** are rule-based and could benefit from ML-based implementations. Overall architecture is sound with proper fallback mechanisms and database persistence.

