# Quick Start: Fixed Auth Architecture

**Status**: ✅ Authentication wiring has been fixed and aligned across all services.

## What Changed?

- ✅ **Password Reset**: Now correctly calls AI Service (port 8000)
- ✅ **OTP Verification**: Now properly routes to AI Service  
- ✅ **Login Flow**: Correctly handles 2FA via AI Service
- ✅ **User Registration**: Stays on Backend (port 8080)
- ✅ **User Profile**: Stays on Backend (port 8080)

## 🚀 Run Everything in 5 Minutes

### Terminal 1: Start Docker Services
```bash
# MySQL
docker run --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -p 3306:3306 -d mysql:8.0

# Redis
docker run --name intelsense-redis \
  -p 6379:6379 -d redis:latest

# MailHog (for testing password reset emails)
docker run --name intelsense-mailhog \
  -p 1025:1025 -p 8025:8025 -d mailhog/mailhog
```

### Terminal 2: Start AI Service
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --port 8000 --reload
```

### Terminal 3: Start Backend
```bash
cd backend
# Set MySQL env vars for persistent storage (optional)
export DB_URL="jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME=root
export DB_PASSWORD=root
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Terminal 4: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Test the Fixed Auth

### Test Login with OTP
1. Open http://localhost:3000
2. Click "Sign In"
3. Email: `demo@company.com` | Password: `demo123`
4. You'll see "Verification code sent to your email"
5. Open http://localhost:8025 (MailHog)
6. Copy the 6-digit OTP code from the email
7. Enter it in the frontend
8. ✅ You should be logged in!

### Test Password Reset
1. On login page, click "Forgot Password?"
2. Enter: `demo@company.com`
3. Check MailHog (http://localhost:8025) for reset email
4. Click the reset link
5. Enter new password (must have uppercase, lowercase, numbers, special chars)
6. ✅ Password reset complete!

## 📋 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React UI |
| Backend | http://localhost:8080 | User registration, profiles |
| AI Service | http://localhost:8000 | Login, OTP, password reset |
| MailHog | http://localhost:8025 | Email inbox (testing) |
| MySQL | localhost:3306 | Shared database |
| Redis | localhost:6379 | Cache |

## 🔍 Verify It's Working

```bash
# Frontend builds successfully
cd frontend && npm run build

# Backend is running
curl http://localhost:8080/api/health

# AI Service is running  
curl http://localhost:8000/api/v1/health

# MySQL is accessible
mysql -h localhost -u root -proot intelsense_ai -e "SELECT COUNT(*) FROM user;"

# Redis is accessible
redis-cli ping
```

## 📖 Full Setup Guide

See [LOCAL_SETUP_FIXED_AUTH.md](LOCAL_SETUP_FIXED_AUTH.md) for detailed instructions, troubleshooting, and architecture details.

## 📋 Technical Summary

See [AUTH_WIRING_FIXES_SUMMARY.md](AUTH_WIRING_FIXES_SUMMARY.md) for complete list of changes made.

## 🎯 Key Architecture Points

**Before (Broken):**
```
Frontend Password Reset → Backend (8080) ❌
(Endpoint doesn't exist - always failed)
```

**After (Fixed):**
```
Frontend Password Reset → AI Service (8000) ✅
(Endpoint exists and works correctly)
```

**Login Flow:**
```
Frontend Login → AI Service (8000)
     ↓
AI Service sends OTP via email (MailHog)
     ↓
Frontend OTP Verify → AI Service (8000)
     ↓
Returns JWT Token → Frontend stores in localStorage
     ↓
User is authenticated ✅
```

## 💡 Important Notes

1. **Database**: Both backend and AI service point to **same MySQL database** (`intelsense_ai`)
2. **Emails**: Use **MailHog** locally for testing password reset and OTP emails
3. **JWT Secret**: Same secret configured in both backend and AI service for token validation
4. **Ports**: Make sure 3000, 8000, 8080, 3306, 6379, 1025, 8025 are available

## ❓ Not Working?

See [LOCAL_SETUP_FIXED_AUTH.md#-troubleshooting](LOCAL_SETUP_FIXED_AUTH.md#-troubleshooting) for common issues and solutions.

---

**Happy coding!** 🚀
