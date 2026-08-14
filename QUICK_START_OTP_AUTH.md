# Quick Start: MySQL + Email + OTP Two-Step Authentication

## 🚀 One-Command Startup

### Step 1: Start Docker Services
Open **Terminal 1** and run:

```bash
# Start MySQL
docker run -d \
  --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -p 3306:3306 \
  -v intelsense-data:/var/lib/mysql \
  mysql:8.0

# Start MailHog (email testing server)
docker run -d \
  --name intelsense-mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog

echo "✅ MySQL on port 3306"
echo "✅ MailHog dashboard: http://localhost:8025"
```

### Step 2: Create Database Schema
Open **Terminal 2** and run:

```bash
# Connect to MySQL
mysql -h localhost -u root -proot intelsense_ai

# Copy and paste this entire SQL block:
```

**SQL Schema:**
```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(255),
    job_title VARCHAR(255),
    experience VARCHAR(255),
    access_reason TEXT,
    rejection_reason TEXT,
    role ENUM('ADMIN', 'ANALYST', 'CUSTOMER', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    status ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    password_hash VARCHAR(512),
    password_previous VARCHAR(512),
    otp_code VARCHAR(10),
    otp_expires_at DATETIME,
    reset_token_expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create other tables if needed
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    source VARCHAR(255),
    user_id BIGINT,
    ai_result JSON,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert test users (password: test123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, status) VALUES
('admin@intelsense.ai', 'admin@intelsense.ai', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Admin', 'User', 'ADMIN', 'ACTIVE'),
('demo@company.com', 'demo@company.com', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Demo', 'Customer', 'CUSTOMER', 'ACTIVE'),
('analyst@intelsense.ai', 'analyst@intelsense.ai', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Rahul', 'Analyst', 'ANALYST', 'ACTIVE');

-- Check inserted users
SELECT id, username, email, role, status FROM users;
```

Exit MySQL:
```bash
EXIT;
```

### Step 3: Configure AI Service
Open **Terminal 3** and create/update `ai-service/.env`:

```bash
cd ai-service

cat > .env << 'EOF'
# Database
DATABASE_URL=mysql+aiomysql://root:root@localhost:3306/intelsense_ai

# JWT
JWT_SECRET=local-test-secret-key-2026

# Email (MailHog Configuration)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_USE_TLS=false
ALERT_EMAIL_FROM=noreply@intelsense.local
APP_URL=http://localhost:3000

# Redis (optional, set to local Redis if available)
REDIS_URL=redis://localhost:6379

# Models
USE_DUMMY_MODELS=true
EOF

echo "✅ .env file created"
```

### Step 4: Start Backend Services
Run these in separate terminals:

**Terminal 3 - Backend:**
```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local
```

**Terminal 4 - AI Service:**
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 5 - Frontend:**
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

---

## ✅ Complete Test Flow

### Test 1: OTP Two-Step Login
1. **Open:** http://localhost:3000
2. **Sign In:**
   - Email: `demo@company.com`
   - Password: `test123`
   - Click "Sign In"
3. **Receive OTP:**
   - Open MailHog: http://localhost:8025
   - Find the email from "noreply@intelsense.local"
   - Copy the **6-digit code** from the email body
4. **Enter OTP:**
   - Paste the code in the "Verification Code" field (e.g., 123456)
   - Click "Verify & Sign In"
5. **Success:**
   - You're now logged into the customer dashboard
   - Verify localStorage has token: `localStorage.getItem('intelsense-token')`

### Test 2: Password Reset with Email Link
1. **Open:** http://localhost:3000
2. **Click:** "Forgot Password?"
3. **Enter Email:** `demo@company.com`
4. **Check MailHog:** http://localhost:8025
5. **Click Reset Link** from the email
6. **Enter New Password** (min 8 chars, mixed case, number, special char)
7. **Verify:** Password changed in database
   ```bash
   mysql -h localhost -u root -proot intelsense_ai
   SELECT email, password_hash FROM users WHERE email='demo@company.com';
   EXIT;
   ```

### Test 3: Admin Login (with ADMIN role)
1. **Sign In:**
   - Email: `admin@intelsense.ai`
   - Password: `test123`
2. **Verify OTP Sent** (via MailHog)
3. **Enter OTP Code** (same 6-digit flow)
4. **Expected:** Redirects to admin dashboard

### Test 4: Analyst Login (with ANALYST role)
1. **Sign In:**
   - Email: `analyst@intelsense.ai`
   - Password: `test123`
2. **Verify OTP Sent** (via MailHog)
3. **Enter OTP Code**
4. **Expected:** Redirects to analyst portal

---

## 🔍 Monitoring & Debugging

### Check Email Log
```bash
# Open MailHog dashboard in browser
open http://localhost:8025
# or
curl http://localhost:8025/api/v1/messages
```

### Check AI Service Logs
```bash
# Terminal 4 output shows live logs
# Look for:
# - "Sending email to demo@company.com"
# - "Email sent successfully" or "Failed to send email"
```

### Check Database State
```bash
# View users
mysql -h localhost -u root -proot intelsense_ai -e "SELECT * FROM users;"

# View OTP status (after login attempt)
mysql -h localhost -u root -proot intelsense_ai -e "SELECT email, otp_code, otp_expires_at FROM users WHERE email='demo@company.com';"

# View password reset tokens
mysql -h localhost -u root -proot intelsense_ai -e "SELECT email, reset_token_expires_at FROM users WHERE email='demo@company.com';"
```

### Check Frontend Console
1. Open browser DevTools (F12)
2. **Console tab:**
   - Login errors will show here
   - API response format visible
3. **Network tab:**
   - Monitor POST /api/auth/login
   - Monitor POST /api/auth/verify-otp
4. **Application tab:**
   - Check localStorage tokens
   - Verify JWT payload: `localStorage.getItem('intelsense-token')`

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to database"
```bash
# Check MySQL is running
docker ps | grep intelsense-mysql

# Restart MySQL
docker restart intelsense-mysql

# Check connection
mysql -h localhost -u root -proot intelsense_ai -e "SELECT 1;"
```

### Problem: "OTP email not received"
```bash
# Verify MailHog is running
docker ps | grep intelsense-mailhog

# Check SMTP config in ai-service/.env
cat ai-service/.env | grep SMTP

# Verify connection to MailHog
telnet localhost 1025
# Type: QUIT

# Check AI service logs for SMTP errors
# Look in Terminal 4 output
```

### Problem: "User not found" after login
```bash
# Verify test users exist
mysql -h localhost -u root -proot intelsense_ai -e "SELECT * FROM users;"

# Re-insert test users if needed
mysql -h localhost -u root -proot intelsense_ai << 'EOF'
INSERT INTO users (username, email, password_hash, first_name, last_name, role, status) 
VALUES ('demo@company.com', 'demo@company.com', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Demo', 'Customer', 'CUSTOMER', 'ACTIVE');
EOF
```

### Problem: "Invalid credentials" on login
```bash
# Verify password hash is set
mysql -h localhost -u root -proot intelsense_ai -e "SELECT email, password_hash FROM users WHERE email='demo@company.com';"

# Password hash should start with $2a$ (bcrypt)
# If not set, update it:
mysql -h localhost -u root -proot intelsense_ai << 'EOF'
UPDATE users SET password_hash='$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi' WHERE email='demo@company.com';
EOF
```

### Problem: "OTP code expired" or "Invalid code"
```bash
# Check OTP expiry in database
mysql -h localhost -u root -proot intelsense_ai -e "SELECT email, otp_code, otp_expires_at FROM users WHERE email='demo@company.com';"

# OTP is valid for 10 minutes
# If expired, request new OTP by re-attempting login
```

---

## 📊 Test Credentials

| Role | Email | Password | Role Value |
|------|-------|----------|-----------|
| Admin | admin@intelsense.ai | test123 | ADMIN |
| Customer | demo@company.com | test123 | CUSTOMER |
| Analyst | analyst@intelsense.ai | test123 | ANALYST |

---

## 🔐 Authentication Flow Summary

```
1. User enters email + password → POST /api/auth/login
   ↓
2. Backend validates password
   ↓
3. Backend generates 6-digit OTP code
   ↓
4. Backend sends OTP via SMTP (MailHog captures it)
   ↓
5. Backend returns: { requires_otp: true }
   ↓
6. Frontend shows OTP input screen
   ↓
7. User checks MailHog and enters OTP code → POST /api/auth/verify-otp
   ↓
8. Backend verifies OTP code (6 digits, not expired)
   ↓
9. Backend issues JWT token: { token, role, username }
   ↓
10. Frontend stores in localStorage and redirects to dashboard
    ↓
11. User is logged in ✅
```

---

## 🧹 Cleanup Commands

```bash
# Stop all services
docker stop intelsense-mysql intelsense-mailhog

# Remove containers
docker rm intelsense-mysql intelsense-mailhog

# Remove volume (deletes all data)
docker volume rm intelsense-data

# View Docker resources
docker ps -a
docker volume ls
docker images
```

---

## 📚 Related Documentation

- [LOCAL_MYSQL_AND_AUTH_SETUP.md](LOCAL_MYSQL_AND_AUTH_SETUP.md) - Detailed setup guide
- [ADMIN_SETUP_AND_DATABASE.md](ADMIN_SETUP_AND_DATABASE.md) - Admin and database management
- [LOCAL_RUN_GUIDE.md](LOCAL_RUN_GUIDE.md) - General project setup
- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) - Architecture overview

---

**Ready to test? Start from "One-Command Startup" above!** 🚀
