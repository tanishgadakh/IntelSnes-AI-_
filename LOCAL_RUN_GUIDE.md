# IntelSense AI - Local Run Guide

## 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Docker Desktop
- Java 17+

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

## 3. Start the AI service
```bash
cd ai-service
USE_DUMMY_MODELS=true uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 4. Start the backend
```bash
cd backend
mvn spring-boot:run
```

## 5. Start the frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

## 6. Open the app
- Landing page: http://localhost:3000/
- Login: http://localhost:3000/login
- Demo login:
  - Username: demo
  - Password: demo123

## 7. Verify the flow
- Register or log in via the backend
- Submit feedback from the AI Workspace
- Confirm the backend stores the request and the AI service processes it
