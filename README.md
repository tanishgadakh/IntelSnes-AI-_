# IntelSense AI

This repository contains a full-stack AI analytics platform with three services:

- `frontend/`: React + Vite user interface
- `backend/`: Spring Boot API gateway with local H2 fallback and optional MySQL persistence
- `ai-service/`: FastAPI AI prediction and analysis service

## Verified local workflow
The current local setup is verified to work with:

- Backend running with the `local` Spring profile and an embedded H2 database by default
- AI service running on `http://localhost:8000`
- Frontend running on `http://localhost:3000` (or `3001` if `3000` is already in use)

### 1. Backend
```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local
```

### 2. AI service
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

## Database options
- For the quickest local startup, no MySQL is required. The backend uses H2 in-memory by default.
- To use MySQL instead, edit:
  - `backend/src/main/resources/application.yml`
  - `backend/src/main/resources/application-local.yml`
  - `ai-service/.env`

## Documentation
- `LOCAL_RUN_GUIDE.md`: step-by-step local startup instructions
- `PROJECT_DOCUMENTATION.md`: architecture, database setup, and service notes
- `run-all.sh`: launcher script for the local stack
