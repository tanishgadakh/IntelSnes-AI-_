# Local Setup Guide: Fixed Authentication Architecture

This guide explains how to run IntelSense locally on your PC with properly aligned authentication across all three services.

## 📋 Architecture Overview

After fixing the auth wiring, here's how the three services interact:

| Service | Port | Responsibility | Database |
|---------|------|-----------------|----------|
| **Frontend** | 3000 | React UI, routes auth calls to correct services | None (browser) |
| **Backend** | 8080 | User registration, profile management, AI prediction orchestration | MySQL or H2 |
| **AI Service** | 8000 | Password reset, OTP, login with 2FA, predictions | **Must match backend DB** |

### Authentication Flow

```
Frontend User Login
         ↓
    [FrontendApp]
         ↓
    (sends credentials to)
         ↓
    [AI Service: /api/v1/auth/login]
         ↓
    Returns: { requires_otp: true, otp_required: true }
         ↓
    User enters OTP code
         ↓
    [AI Service: /api/v1/auth/verify-otp]
         ↓
    Returns: JWT token + user role
         ↓
    User is authenticated ✓
```

### Password Reset Flow

```
User clicks "Forgot Password"
         ↓
    [Frontend: ForgotPasswordPage]
         ↓
    Sends email to
         ↓
    [AI Service: /api/v1/auth/password-reset]
         ↓
    AI Service sends email with reset link (via SMTP/MailHog)
         ↓
    User clicks reset link in email
         ↓
    [Frontend: ResetPasswordPage]
         ↓
    Sends new password to
         ↓
    [AI Service: /api/v1/auth/password-reset/confirm]
         ↓
    Password updated ✓
```

### User Registration & Profile Flow

```
New user registers
         ↓
    [Frontend: RegisterPage]
         ↓
    Sends registration to
         ↓
    [Backend: /api/auth/register]
         ↓
    Backend creates user in database
         ↓
    (user can now log in via AI Service login)
         ↓
    User updates profile
         ↓
    [Frontend: ProfilePage]
         ↓
    Sends update to
         ↓
    [Backend: /api/auth/profile]
         ↓
    Backend updates user ✓
```

## ⚙️ Prerequisites

- **Node.js** (16+) and npm
- **Java 17** (`openjdk-17-jdk-headless`)
- **Python 3.10+** with venv
- **Docker Desktop** (for MySQL and Redis)
- **Git**

Verify installations:
```bash
node --version    # v18+
npm --version     # 8+
java -version     # 17+
python3 --version # 3.10+
docker --version  # 20+
```

## 🚀 Step-by-Step Local Setup

### Step 1: Start MySQL (Required for shared database)

```bash
docker run --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -e MYSQL_USER=intelsense \
  -e MYSQL_PASSWORD=intelsense123 \
  -p 3306:3306 \
  -d mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Verify MySQL is running:
```bash
mysql -h localhost -u root -proot intelsense_ai -e "SELECT 1;"
```

### Step 2: Start Redis (For caching and sessions)

```bash
docker run --name intelsense-redis \
  -p 6379:6379 \
  -d redis:latest
```

Verify Redis is running:
```bash
redis-cli ping
# Expected: PONG
```

### Step 3: Start MailHog (For email testing)

```bash
docker run --name intelsense-mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  -d mailhog/mailhog
```

Then open MailHog dashboard:
```bash
# Open in browser:
http://localhost:8025
```

### Step 4: Start the AI Service

```bash
# Navigate to ai-service directory
cd /path/to/IntelSense/ai-service

# Create and activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Create .env file from example (or use existing one)
# Make sure DATABASE_URL points to your MySQL:
# DATABASE_URL=mysql+aiomysql://root:root@localhost:3306/intelsense_ai

# Start the service
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Test the AI service:
```bash
curl http://localhost:8000/api/v1/health
# Expected: {"status":"ok","db":true,"redis":true}
```

### Step 5: Start the Backend

```bash
# Navigate to backend directory
cd /path/to/IntelSense/backend

# Set Java 17 environment
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"

# Start with local profile (uses H2 by default, or MySQL if DB_URL is set)
# To use MySQL instead of H2:
export DB_URL="jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="root"

# Start the backend
mvn spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
```

Expected output:
```
INFO ... Started IntelSenseApplication in X.XX seconds
INFO ... Tomcat started on port(s): 8080 (http)
```

Test the backend:
```bash
curl http://localhost:8080/api/health
# Expected: {"status":"UP"}
```

### Step 6: Start the Frontend

```bash
# Navigate to frontend directory
cd /path/to/IntelSense/frontend

# Install dependencies
npm install

# Start development server
npm run dev -- --host 0.0.0.0

# Or start on specific port if 3000 is in use:
npm run dev -- --host 0.0.0.0 --port 3001
```

Expected output:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:3000
  ➜  press h to show help
```

### Step 7: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🧪 Testing the Auth Flow

### Test 1: User Login with OTP

1. Click **"Sign In"** on the landing page
2. Use demo credentials:
   - Email: `demo@company.com`
   - Password: `demo123`
3. You should see: **"Verification code sent to your email"**
4. Open **MailHog** at `http://localhost:8025`
5. Check the inbox for the OTP code (6 digits)
6. Enter the code and click **"Verify & Sign In"**
7. You should be logged in ✓

### Test 2: Password Reset

1. Click **"Forgot Password?"** on the login page
2. Enter: `demo@company.com`
3. You should see: **"Reset link sent!"**
4. Open **MailHog** at `http://localhost:8025`
5. Find the password reset email and click the link
6. Enter a new strong password (uppercase, lowercase, numbers, special chars)
7. You should see: **"Password reset successfully"**
8. Click **"Return to Login"** and sign in with new password

### Test 3: User Registration

1. Click **"Create Account"** on the login page
2. Fill out the registration form:
   - Email: `newuser@example.com`
   - Password: `SecurePassword123!`
   - Select role: **Customer**
3. Click **"Create Account"**
4. You should be logged in automatically
5. Verify your profile in the dashboard

## 📁 Configuration Files

### Frontend Configuration
- **File**: `frontend/src/api/client.js`
- **Backend Base URL**: `http://localhost:8080` (VITE_API_BASE_URL)

- **File**: `frontend/src/api/aiClient.js` (NEW)
- **AI Service Base URL**: `http://localhost:8000` (VITE_AI_SERVICE_URL)

### Backend Configuration
- **File**: `backend/src/main/resources/application-local.yml`
- **Database**: H2 (in-memory) by default
- **To use MySQL**: Set environment variables:
  ```bash
  export DB_URL="jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
  export DB_USERNAME="root"
  export DB_PASSWORD="root"
  ```

- **File**: `backend/src/main/resources/application.yml`
- **AI Service Base URL**: `http://localhost:8000/api/v1` (AI_SERVICE_BASE_URL)

### AI Service Configuration
- **File**: `ai-service/.env`
- **Database URL**: `mysql+aiomysql://root:root@localhost:3306/intelsense_ai`
- **Redis URL**: `redis://localhost:6379/0`
- **SMTP Host**: `localhost` (for MailHog)
- **SMTP Port**: `1025`

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend
**Error**: `Unable to sign in. Please verify your backend is running.`

**Solution**:
1. Check backend is running on port 8080: `curl http://localhost:8080/api/health`
2. Check CORS is enabled in backend SecurityConfig
3. Verify VITE_API_BASE_URL environment variable is set correctly

### OTP Email Not Received
**Error**: "Verification code sent to your email" but no email arrives

**Solution**:
1. Check MailHog is running: `curl http://localhost:8025`
2. Open MailHog UI and check inbox
3. If empty, check AI service logs for SMTP errors
4. Verify SMTP_HOST and SMTP_PORT in ai-service/.env are set to `localhost:1025`

### Database Connection Errors
**Error**: `Unable to connect to MySQL` or similar

**Solution**:
1. Verify MySQL is running: `docker ps | grep mysql`
2. Check MySQL credentials in .env files match your setup
3. Test connection: `mysql -h localhost -u root -proot intelsense_ai`
4. If using MySQL for backend, ensure DB_URL environment variable is set

### AI Service Won't Start
**Error**: `ModuleNotFoundError` or `ImportError`

**Solution**:
1. Ensure Python virtual environment is activated: `source .venv/bin/activate`
2. Reinstall dependencies: `pip install -e .`
3. Check Python version is 3.10+: `python --version`
4. Check Redis is running for cache: `redis-cli ping`

### Port Already in Use
**Error**: `Address already in use` or similar

**Solution**:
```bash
# Kill process on port 3000 (frontend)
sudo lsof -ti:3000 | xargs kill -9

# Kill process on port 8000 (AI service)
sudo lsof -ti:8000 | xargs kill -9

# Kill process on port 8080 (backend)
sudo lsof -ti:8080 | xargs kill -9

# Kill process on port 3306 (MySQL)
sudo lsof -ti:3306 | xargs kill -9
```

Or use different ports when starting:
```bash
npm run dev -- --port 3001    # Frontend
# (AI service and backend port changes require config file updates)
```

## 📚 Service Endpoints

### Frontend (React SPA)
```
http://localhost:3000
```

### Backend (Spring Boot REST API)
```
http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html
Health: http://localhost:8080/api/health
Public endpoints: http://localhost:8080/api/public/*
```

### AI Service (FastAPI)
```
http://localhost:8000
API Docs: http://localhost:8000/api/v1/docs
OpenAPI: http://localhost:8000/api/v1/openapi.json
Health: http://localhost:8000/api/v1/health
```

### MailHog (Email Testing)
```
SMTP Server: localhost:1025
Web UI: http://localhost:8025
```

### Redis (Cache)
```
redis://localhost:6379
CLI: redis-cli
```

### MySQL (Database)
```
Host: localhost:3306
Username: root
Password: root
Database: intelsense_ai
Client: mysql -h localhost -u root -proot intelsense_ai
```

## 🎯 Key Architectural Changes Made

### Before (Broken Auth Wiring)
- Frontend password reset calls: `POST http://localhost:8080/api/v1/auth/password-reset` ❌
- Backend doesn't have this endpoint
- Password reset always fails

### After (Fixed Auth Wiring)
- Frontend password reset calls: `POST http://localhost:8000/api/v1/auth/password-reset` ✓
- AI Service has this endpoint
- Password reset works correctly

- Frontend login calls: `POST http://localhost:8000/api/v1/auth/login` ✓
- AI Service has OTP support
- Login with 2FA works correctly

- Frontend register calls: `POST http://localhost:8080/api/auth/register` ✓
- Backend handles user creation
- Consistent with profile management

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend health check passes
- [ ] AI Service health check passes  
- [ ] MySQL database is accessible
- [ ] Redis is running and responsive
- [ ] MailHog UI shows no errors
- [ ] Can register a new user
- [ ] Can log in with OTP verification
- [ ] Can reset password via email
- [ ] Can update user profile
- [ ] Can submit feedback and see predictions

## 🔒 Security Notes for Local Development

⚠️ **WARNING**: These credentials are for local development ONLY

```
MySQL:
  Username: root
  Password: root

MailHog:
  No authentication (localhost only)

JWT Secret:
  change-me-local-intelsense-ai-jwt-signing-key-2026

SMTP:
  No authentication (MailHog doesn't require it)
```

**For production**, use environment variables and a secrets manager.

## 📞 Support

If you encounter issues:

1. Check service logs for error messages
2. Verify all prerequisites are installed
3. Ensure ports 3000, 8000, 8080, 3306, 6379, 1025, 8025 are available
4. Check database connectivity
5. Verify CORS settings in backend
6. Review this guide's Troubleshooting section

---

**Happy developing!** 🚀
