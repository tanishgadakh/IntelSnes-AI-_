# IntelSense AI - Local Run Guide

## 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Java 17+
- Maven
- Optional: Docker Desktop or Docker Engine if you want MySQL instead of the built-in local H2 profile

## 2. Quick local start (recommended)
This is the easiest path and is already wired to work locally.

### Backend
```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local
```

The backend will start on `http://localhost:8080` using an embedded H2 database. No MySQL setup is needed for this path.

### AI service
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The AI service will be available at `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open the app at `http://localhost:3000` (or `http://localhost:3001` if `3000` is already in use).

## 3. Optional: use MySQL instead of the local H2 profile
If you want the backend and AI service to use MySQL for persistence, update the following files:

### Backend config
Edit:
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-local.yml`

Change the datasource block to a MySQL URL such as:

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
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

### MySQL database
Create the database once:

```sql
CREATE DATABASE intelsense_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hibernate will create the tables automatically with `ddl-auto: update`.
The main tables are:
- `users`
- `feedbacks`
- `platform_statistics`
- `testimonials`

### AI service config
Edit `ai-service/.env` (or copy `ai-service/.env.example` to `.env`) and set:

```env
DATABASE_URL=mysql+aiomysql://Tanishg16:Tanish@2009@localhost:3306/intelsense_ai
USE_DUMMY_MODELS=true
JWT_SECRET=change-me-local-intelsense-ai-jwt-signing-key-2026
```

### Frontend config
Edit `frontend/src/api/client.js` if you want the UI to target a different backend origin:

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

## 4. Run everything from one script
From the repo root, run:

```bash
bash run-all.sh
```

## 5. Verify the flow
- Open `http://localhost:3000` and sign in with `demo@company.com / demo123`
- Submit feedback from the customer portal
- Confirm the backend accepts the request and the AI service returns a response
- Confirm role-based pages such as customer, analyst, and admin routes behave correctly
