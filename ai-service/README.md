# IntelSense AI - FastAPI microservice

This service is the AI engine for IntelSense AI. It accepts customer feedback, runs AI analysis, and returns structured intelligence payloads for the backend and dashboard.

## What it provides
- Sentiment analysis
- Emotion detection
- Aspect-based analysis
- Keyword extraction
- Topic detection
- Summary generation
- Explainability output
- Recommendation generation
- Health and analytics endpoints

## Local quick start
1. Copy `.env.example` to `.env`.
2. Update the local values in `.env`:
   - `USE_DUMMY_MODELS=true` for local smoke tests
   - `DATABASE_URL=mysql+aiomysql://...` if you want MySQL persistence
3. Install and run the service:

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

4. Open the API docs:
   - `http://localhost:8000/api/v1/docs`

## Example payload
```json
{
  "text": "I love this product but support was slow.",
  "source": "web"
}
```

## Local configuration notes
- `USE_DUMMY_MODELS=true` uses built-in lightweight logic for local development.
- Set it to `false` to try real model loading paths when dependencies are available.
- If you want MySQL, create the `intelsense_ai` database first and set `DATABASE_URL` in `.env`.
- If you do not want MySQL, the backend can still run locally against its built-in H2 profile and call into the AI service on port `8000`.
