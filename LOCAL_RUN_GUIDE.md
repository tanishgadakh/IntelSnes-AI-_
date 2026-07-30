# IntelSense AI - Local Run Guide

## 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Docker Desktop or Docker Engine
- Java 17+
- Maven

## 2. Start MySQL locally
Run this once:

```bash
docker run --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -e MYSQL_USER=Tanishg16 \
  -e MYSQL_PASSWORD=Tanish@2009 \
  -p 3306:3306 -d mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Confirm MySQL is available at `localhost:3306`.

## 3. Start Redis locally (optional)
Redis is optional and only needed if the AI service cache layer is enabled.

```bash
docker run --name intelsense-redis -p 6379:6379 -d redis:7
```

## 4. Configure the AI service environment
Create a local environment file in `ai-service/`:

```bash
cd ai-service
cat <<'EOF' > .env
APP_NAME=IntelSenseAI
ENVIRONMENT=development
API_PREFIX=/api/v1
DATABASE_URL=mysql+aiomysql://Tanishg16:Tanish@2009@localhost:3306/intelsense_ai
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=change-me-local-intelsense-ai-jwt-signing-key-2026
JWT_ALGORITHM=HS256
MODEL_CACHE_DIR=/models
USE_DUMMY_MODELS=true
LOG_LEVEL=INFO
EOF
```

> Note: `ai-service/.env.example` previously defaulted to PostgreSQL. This local setup uses MySQL and the `ai-service/docker-compose.yml` now matches MySQL credentials.

## 5. Install AI service dependencies

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

## 6. Start the AI service

```bash
cd ai-service
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The AI service will be available at `http://localhost:8000`.

## 7. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`.

## 8. Start the frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open the app at `http://localhost:3000`.

## 9. Run all services automatically
From the repo root, run:

```bash
bash run-all.sh
```

## 10. Verify the flow
- Access the app at `http://localhost:3000`
- Authenticate and submit input
- The backend should call the AI service and persist feedback
- Confirm assistant output appears with `language` and `confidence`
