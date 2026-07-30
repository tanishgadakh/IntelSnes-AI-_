# IntelSense AI Project Documentation

## Overview
This repository contains the IntelSense AI platform with three coordinated services:

- `frontend/`: React + Vite user interface
- `backend/`: Spring Boot API and MySQL persistence
- `ai-service/`: FastAPI AI analysis microservice

The system supports JWT-based security, role-aware access, feedback ingestion, AI analysis, recommendations, and reporting.

---

## Architecture

### Key components

- Frontend: React SPA with role-aware routing and assistant UX.
- Backend: Spring Boot REST API with MySQL storage and AI service integration.
- AI Service: FastAPI microservice that performs NLP analysis and returns structured payloads.

### Data flow

1. User logs in through the React frontend.
2. Frontend sends JWT-protected requests to the backend.
3. Backend persists feedback and invokes the AI service.
4. AI service performs analysis, including language detection and confidence scoring.
5. Backend returns results and UI displays insights.

---

## Local setup step-by-step

### 1. Prerequisites

- Docker Desktop / Docker Engine
- Java 17
- Maven
- Node.js 18+
- Python 3.10+

### 2. Start MySQL locally

This repository uses MySQL for backend persistence. Run:

```bash
docker run --name intelsense-mysql   -e MYSQL_ROOT_PASSWORD=root   -e MYSQL_DATABASE=intelsense_ai   -e MYSQL_USER=Tanishg16   -e MYSQL_PASSWORD=Tanish@2009   -p 3306:3306 -d mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Confirm access on `localhost:3306`.

### 3. Start Redis locally (optional)

Redis is optional and used by the AI service cache layer. Run:

```bash
docker run --name intelsense-redis -p 6379:6379 -d redis:7
```

### 4. Configure AI service env for MySQL

Create or update `ai-service/.env`:

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

> `ai-service/.env.example` defaults to PostgreSQL; use the above MySQL URL for local deployment.

### 5. Start the AI service

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The AI service will be available at `http://localhost:8000`.

### 6. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### 7. Start the frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open `http://localhost:3000`.

---

## Folder documentation

### Root folder

- `README.md`: Project landing page.
- `LOCAL_RUN_GUIDE.md`: Quick local-run instructions.
- `PROJECT_DOCUMENTATION.md`: Detailed architecture, configuration, and run instructions.

### `backend/`

Spring Boot backend and MySQL persistence.

Key files:

- `pom.xml`: Project dependencies and build config.
- `src/main/resources/application.yml`: MySQL settings, AI service URL, and JWT secret.
- `src/main/resources/application-local.yml`: Local override of `application.yml`.
- `src/main/java/com/intelsenseai/controller/FeedbackController.java`: `POST /api/feedback`.
- `src/main/java/com/intelsenseai/controller/AssistantController.java`: `POST /api/assistant`.
- `src/main/java/com/intelsenseai/service/FeedbackService.java`: Stores feedback and forwards it to the AI service.
- `src/main/java/com/intelsenseai/service/AssistantService.java`: Converts AI response into `AssistantResponse`.
- `src/main/java/com/intelsenseai/client/AiClient.java`: HTTP client to call AI service.
- `src/main/java/com/intelsenseai/entity/Feedback.java`: Feedback entity mapping.
- `src/main/java/com/intelsenseai/entity/User.java`: User entity with role field.
- `src/main/java/com/intelsenseai/entity/Role.java`: Role enum values.

Database config:

- `spring.datasource.url`: `jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `spring.datasource.username`: `Tanishg16`
- `spring.datasource.password`: `Tanish@2009`
- `hibernate.ddl-auto: update`

### `frontend/`

React UI, routing, and assistant experience.

Key files:

- `package.json`: Dependencies and scripts.
- `vite.config.js`: Build config.
- `src/main.jsx`: React bootstrapping.
- `src/App.jsx`: Route definitions and JWT role protection.
- `src/api/client.js`: Axios service wrapper.
- `src/pages/AssistantPage.jsx`: Assistant interface with `language` and `confidence`.
- `src/pages/PredictionPage.jsx`: Feedback analysis interface.
- `src/components/Layout.jsx`: Navigation, role-aware menu.
- `src/utils/jwt.js`: JWT token parsing utility.

Runtime notes:

- `VITE_API_BASE_URL` controls the backend API endpoint.
- JWT tokens are stored in `localStorage` as `intelsense-token`.

### `ai-service/`

FastAPI AI microservice for text analysis.

Key files:

- `pyproject.toml`: Python package metadata.
- `requirements.txt`: Runtime dependencies.
- `app/main.py`: FastAPI app setup and route wiring.
- `app/core/config.py`: Environment-driven service settings.
- `app/api/prediction.py`: `POST /api/v1/predict`.
- `app/api/assistant.py`: `POST /api/v1/assistant`.
- `app/api/analytics.py`: `GET /api/v1/analytics`.
- `app/api/reports.py`: `GET /api/v1/reports`.
- `app/ai/pipelines/prediction_pipeline.py`: Text analysis workflow.
- `app/services/prediction_service.py`: Runtime prediction and persistence.
- `app/ai/preprocessing/language.py`: Language detection.
- `app/ai/models/dummy.py`: Local dummy model implementations.
- `tests/test_prediction_flow.py`: Endpoint smoke tests.

AI service notes:

- `USE_DUMMY_MODELS=true` is recommended locally.
- The assistant schema now returns `language` and `confidence`.
- `app/schemas/prediction.py` defines the expanded AI payload.

### `ai-service/alembic/`

Migration scaffolding.

- `alembic.ini`: Alembic configuration.
- `env.py`: Uses `DATABASE_URL` for migrations.
- `alembic/versions/001_create_prediction_and_analytics_tables.py`: Schema migration.

---

## Database documentation

### Backend database

Backend MySQL settings:

- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-local.yml`

Schema objects:

- `Feedback` entity -> `feedbacks` table
- `User` entity -> `users` table
- `Role` enum stored as string in `users.role`

The backend stores AI responses in `Feedback.aiResult` as JSON text.

### AI service database

AI service DB settings:

- `ai-service/.env` or environment variable `DATABASE_URL`
- `ai-service/.env.example` uses PostgreSQL by default.

For local MySQL:

```bash
DATABASE_URL=mysql+aiomysql://Tanishg16:Tanish@2009@localhost:3306/intelsense_ai
```

AI service database utilities:

- `app/core/settings/database.py`: Typed MySQL DSN builder.
- `app/repositories/prediction_repository.py`: Persistence layer.
- `app/models/prediction.py`: SQLAlchemy prediction model.

### Local MySQL reference

Backend connection:

```yaml
spring.datasource.url: jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username: Tanishg16
spring.datasource.password: Tanish@2009
```

AI service connection:

```bash
DATABASE_URL=mysql+aiomysql://Tanishg16:Tanish@2009@localhost:3306/intelsense_ai
```

> The AI service Docker compose now uses MySQL by default for local development. If you want Postgres, override `DATABASE_URL` and update the compose service accordingly.

---

## Run checklist

- [ ] Start local MySQL and confirm the `intelsense_ai` database exists.
- [ ] Start Redis if using caching / metrics.
- [ ] Configure `ai-service/.env` with local MySQL settings.
- [ ] Start the AI service at `http://localhost:8000`.
- [ ] Start the backend at `http://localhost:8080`.
- [ ] Start the frontend at `http://localhost:3000`.
- [ ] Open the UI and verify the assistant shows `language` and `confidence`.

---

## Implementation summary

### Completed work

- Frontend role-aware UI and assistant UX.
- Backend JWT and MySQL persistence.
- AI service pipeline with expanded response fields.
- Assistant schema and response fields for `language` and `confidence`.
- Reports and analytics endpoints in the AI service.

### Key implementation files

- `ai-service/app/ai/pipelines/prediction_pipeline.py`
- `ai-service/app/api/prediction.py`
- `ai-service/app/api/assistant.py`
- `ai-service/app/schemas/prediction.py`
- `frontend/src/pages/AssistantPage.jsx`
- `backend/src/main/java/com/intelsenseai/service/AssistantService.java`
- `backend/src/main/resources/application.yml`

---

## Notes and caveats

- The backend and frontend are wired to localhost services by default.
- `USE_DUMMY_MODELS=true` is recommended for local development.
- Local MySQL is required for the backend; the AI service can use MySQL or Postgres if configured.
- The backend calls the AI service at `http://localhost:8000/api/v1`.
