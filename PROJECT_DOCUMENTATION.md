# IntelSense AI Project Documentation

## Overview
This repository contains the IntelSense AI platform with three coordinated services:

- `frontend/`: React + Vite user interface
- `backend/`: Spring Boot API gateway with local H2 fallback and optional MySQL persistence
- `ai-service/`: FastAPI AI analysis microservice

The system supports JWT-based security, role-aware access, feedback ingestion, AI analysis, recommendations, and reporting.

---

## Architecture

### Key components

- Frontend: React SPA with role-aware routing, public pages, and authenticated dashboards.
- Backend: Spring Boot REST API that serves auth, feedback, reports, and assistant endpoints.
- AI Service: FastAPI microservice that performs NLP analysis and returns structured payloads.

### Data flow

1. The user logs in through the React frontend.
2. The frontend sends JWT-protected requests to the backend.
3. The backend persists feedback and forwards analysis requests to the AI service.
4. The AI service returns sentiment, emotion, language, confidence, and recommendation payloads.
5. The backend and frontend display the results in the dashboards and assistant experience.

---

## Local setup step-by-step

### 1. Prerequisites

- Java 17
- Maven
- Node.js 18+
- Python 3.10+
- Optional: Docker Desktop / Docker Engine if you want MySQL instead of the built-in local H2 database

### 2. Start the backend

The backend now defaults to the `local` profile and uses an embedded H2 database, so it can run without MySQL:

```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local
```

The backend will start on `http://localhost:8080`.

### 3. Start the AI service

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The AI service will be available at `http://localhost:8000`.

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open `http://localhost:3000` (or `http://localhost:3001` if `3000` is already in use).

---

## Database configuration

### Fastest local path: H2 (no MySQL required)
The backend already uses an in-memory H2 database in the `local` profile. No manual database creation is required for the quick-start path.

### MySQL path (optional)
If you want MySQL-backed persistence, edit:

- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-local.yml`
- `ai-service/.env`

Change the backend datasource to a MySQL URL like this:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: Tanishg16
    password: Tanish@2009
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
```

Create the MySQL database:

```sql
CREATE DATABASE intelsense_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The backend will create the tables automatically when `ddl-auto` is set to `update`.
Expected tables:
- `users`
- `feedbacks`
- `platform_statistics`
- `testimonials`

For the AI service, set the database URL in `ai-service/.env`:

```env
DATABASE_URL=mysql+aiomysql://Tanishg16:Tanish@2009@localhost:3306/intelsense_ai
USE_DUMMY_MODELS=true
```

---

## Files to edit for configuration

### Backend
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-local.yml`

### Frontend
- `frontend/src/api/client.js`

### AI service
- `ai-service/.env`
- `ai-service/.env.example`

---

## Folder documentation

### Root folder

- `README.md`: high-level local startup instructions
- `LOCAL_RUN_GUIDE.md`: step-by-step local run guide
- `PROJECT_DOCUMENTATION.md`: architecture and configuration notes
- `run-all.sh`: launcher script for the services

### `backend/`

Key files:

- `pom.xml`: Maven dependencies and build config
- `src/main/resources/application.yml`: default backend config
- `src/main/resources/application-local.yml`: local override for H2/MySQL switches
- `src/main/java/com/intelsenseai/controller/FeedbackController.java`: feedback submission and history endpoints
- `src/main/java/com/intelsenseai/service/FeedbackService.java`: feedback persistence and AI service integration
- `src/main/java/com/intelsenseai/client/AiClient.java`: backend-to-AI-service HTTP calls
- `src/main/java/com/intelsenseai/entity/User.java`: user role/status persistence
- `src/main/java/com/intelsenseai/entity/Feedback.java`: persisted feedback records

### `frontend/`

Key files:

- `src/api/client.js`: backend base URL
- `src/App.jsx`: route definitions and role-based guards
- `src/pages/LoginPage.jsx`: login form and token handling
- `src/pages/CustomerPortalPage.jsx`: customer feedback submission and history panel
- `src/pages/ReportsPage.jsx`: reports export UI

### `ai-service/`

Key files:

- `app/main.py`: FastAPI app entry point
- `app/api/prediction.py`: prediction endpoint
- `app/api/assistant.py`: assistant endpoint
- `app/core/config.py`: environment-based service configuration
- `app/schemas/prediction.py`: AI response schema

---

## Run checklist

- [ ] Start the backend on port `8080`
- [ ] Start the AI service on port `8000`
- [ ] Start the frontend on port `3000`
- [ ] Open the app and verify login with `demo@company.com / demo123`
- [ ] Submit feedback and confirm AI responses are returned
- [ ] Verify role-based pages for customer, analyst, and admin flows

---

## Notes

- The backend and frontend are wired to `localhost` by default.
- `USE_DUMMY_MODELS=true` is recommended for local development and smoke testing.
- The backend calls the AI service at `http://localhost:8000/api/v1`.
