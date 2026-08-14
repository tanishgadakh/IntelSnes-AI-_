# Complete Setup & Testing Guide: MySQL + Email + OTP Authentication

## 📋 Overview
This guide provides everything needed to run IntelSense locally with:
- ✅ MySQL database with persistent storage
- ✅ Local email testing (MailHog)
- ✅ Two-step OTP authentication
- ✅ Password reset emails
- ✅ All predefined test users

---

## Part 1: Quick 5-Minute Setup

### 1.1 Open 5 Terminals

**Terminal 1: Start Docker Services**
```bash
# MySQL Database
docker run -d \
  --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -p 3306:3306 \
  -v intelsense-data:/var/lib/mysql \
  mysql:8.0

# Email Testing Server
docker run -d \
  --name intelsense-mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog

echo "✅ MySQL: localhost:3306 (root/root)"
echo "✅ MailHog: http://localhost:8025"
```

**Terminal 2: Create Database Schema**
```bash
# Wait 5 seconds for MySQL to be ready
sleep 5

# Connect and create tables
mysql -h localhost -u root -proot intelsense_ai << 'EOF'
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
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

-- Insert Test Users (password: test123 - hashed with bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, status) 
VALUES 
('admin@intelsense.ai', 'admin@intelsense.ai', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Admin', 'User', 'ADMIN', 'ACTIVE'),
('demo@company.com', 'demo@company.com', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Demo', 'Customer', 'CUSTOMER', 'ACTIVE'),
('analyst@intelsense.ai', 'analyst@intelsense.ai', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Rahul', 'Analyst', 'ANALYST', 'ACTIVE');

-- Create Feedback Table
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

-- Verify
SELECT 'Database created' as status;
SELECT COUNT(*) as user_count FROM users;
EOF

echo "✅ Database schema created"
```

**Terminal 3: Configure & Start Backend**
```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local
# Wait for: "Started Application in X seconds"
```

**Terminal 4: Configure & Start AI Service**
```bash
cd ai-service

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=mysql+aiomysql://root:root@localhost:3306/intelsense_ai
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_USE_TLS=false
ALERT_EMAIL_FROM=noreply@intelsense.local
APP_URL=http://localhost:3000
JWT_SECRET=local-test-secret-key-2026
REDIS_URL=redis://localhost:6379
USE_DUMMY_MODELS=true
EOF

# Start service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Wait for: "Application startup complete"
```

**Terminal 5: Start Frontend**
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
# Open: http://localhost:3000 when ready
```

---

## Part 2: Complete Test Scenarios

### Scenario 1: Two-Step Login with OTP

**Step 1: Open Login Page**
- Open browser: http://localhost:3000

**Step 2: Sign In (Password Step)**
- Email: `demo@company.com`
- Password: `test123`
- Click "Sign In"

**Step 3: Check for OTP Email**
- Open MailHog: http://localhost:8025
- Should see email from "noreply@intelsense.local"
- Subject: "IntelSense AI - Verification code"
- Body contains: 6-digit code (e.g., 123456)

**Step 4: Enter OTP Code**
- Copy the 6-digit code from MailHog
- Paste into "Verification Code" field on login page
- Click "Verify & Sign In"

**Step 5: Verify Login Success**
- Page redirects to customer dashboard
- Check browser localStorage:
  ```javascript
  // Open Developer Tools (F12) → Console
  localStorage.getItem('intelsense-token')  // Should show JWT
  localStorage.getItem('intelsense-role')   // Should show "CUSTOMER"
  ```

---

### Scenario 2: Password Reset with Email Link

**Step 1: Go to Login & Forgot Password**
- Open: http://localhost:3000
- Click "Forgot Password?"

**Step 2: Request Reset Link**
- Enter email: `demo@company.com`
- Click "Send Reset Link"

**Step 3: Find Reset Email in MailHog**
- Open MailHog: http://localhost:8025
- Find email from "noreply@intelsense.local"
- Subject: "IntelSense AI - Password reset"
- Body contains: Click here to reset link

**Step 4: Click Reset Link**
- Click the "Click here to reset" link
- You'll be redirected to reset password form with token in URL

**Step 5: Set New Password**
- Enter new password (must meet requirements):
  - At least 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character (e.g., !@#$)
- Example: `NewPassword123!`
- Click "Reset Password"

**Step 6: Verify New Password Works**
- Go back to login page: http://localhost:3000
- Sign in with new password
- Follow OTP flow
- Verify login successful

---

### Scenario 3: Admin Login

**Step 1: Sign In as Admin**
- Email: `admin@intelsense.ai`
- Password: `test123`

**Step 2: Verify OTP Sent**
- Check MailHog for OTP code

**Step 3: Enter OTP**
- Use 6-digit code from email

**Step 4: Verify Admin Dashboard**
- Should redirect to `/admin/dashboard`
- Check localStorage role: `ADMIN`

---

### Scenario 4: Analyst Login

**Step 1: Sign In as Analyst**
- Email: `analyst@intelsense.ai`
- Password: `test123`

**Step 2: Verify OTP Sent**
- Check MailHog for OTP code

**Step 3: Enter OTP**
- Use 6-digit code from email

**Step 4: Verify Analyst Portal**
- Should redirect to `/analyst/dashboard`
- Check localStorage role: `ANALYST`

---

## Part 3: Error Handling Tests

### Test 1: Wrong Password
1. Enter email: `demo@company.com`
2. Enter wrong password: `wrongpassword`
3. Click "Sign In"
4. Expected: Error message "Invalid credentials"
5. No OTP email sent

### Test 2: User Not Found
1. Enter email: `nonexistent@example.com`
2. Enter password: `test123`
3. Click "Sign In"
4. Expected: Error message "User not found"

### Test 3: Wrong OTP Code
1. Complete password step successfully
2. Enter wrong OTP: `000000`
3. Click "Verify & Sign In"
4. Expected: Error message "Invalid code"

### Test 4: Expired OTP
1. Wait 10+ minutes after entering password
2. Try to enter OTP
3. Expected: Error message "Code expired"
4. Must restart login process

### Test 5: Empty Fields
1. Leave email or password empty
2. Click "Sign In"
3. Expected: Error message "Email and password are required"

---

## Part 4: Database Verification

### Check Created Users
```bash
mysql -h localhost -u root -proot intelsense_ai
SELECT id, username, email, role, status, password_hash FROM users;
```

Expected output:
```
| id | username           | email           | role     | status |
|----|-------------------|-----------------|----------|--------|
| 1  | admin@intelsense.ai| admin@...       | ADMIN    | ACTIVE |
| 2  | demo@company.com   | demo@company.com| CUSTOMER | ACTIVE |
| 3  | analyst@intelsense | analyst@...     | ANALYST  | ACTIVE |
```

### Check OTP Status (During Login)
```bash
mysql -h localhost -u root -proot intelsense_ai
SELECT email, otp_code, otp_expires_at FROM users WHERE email='demo@company.com';
```

Expected (after password verification):
```
| email           | otp_code | otp_expires_at      |
|-----------------|----------|---------------------|
| demo@company.com| 123456   | 2026-08-14 15:45:00 |
```

### Check Password Reset Token
```bash
mysql -h localhost -u root -proot intelsense_ai
SELECT email, reset_token_expires_at FROM users WHERE email='demo@company.com';
```

---

## Part 5: Monitoring & Debugging

### View All Emails Sent
- Open: http://localhost:8025
- Shows all OTP codes and password reset links
- Perfect for development/testing
- No actual emails leave the server

### Monitor AI Service Logs
Watch Terminal 4 output for:
```
"Sending email to demo@company.com"
"Email sent successfully"  ✅ or
"Failed to send email"     ❌
```

### Monitor Frontend Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try login and watch for errors
4. Go to Network tab
5. Monitor:
   - POST /api/auth/login → should return `requires_otp: true`
   - POST /api/auth/verify-otp → should return `token` and `role`

### Check Database Logs
```bash
# View MySQL activity
docker logs -f intelsense-mysql
```

---

## Part 6: Troubleshooting

### "Cannot connect to database"
```bash
# Check MySQL running
docker ps | grep mysql

# Test connection
mysql -h localhost -u root -proot intelsense_ai -e "SELECT 1;"

# Restart if needed
docker restart intelsense-mysql
```

### "OTP not being sent"
```bash
# Check MailHog running
docker ps | grep mailhog

# Check MailHog is receiving
curl http://localhost:8025/api/v1/messages

# Verify SMTP config in .env
cat ai-service/.env | grep SMTP
# Should show: SMTP_HOST=localhost, SMTP_PORT=1025
```

### "Cannot find test users"
```bash
# Check if users table is empty
mysql -h localhost -u root -proot intelsense_ai -e "SELECT COUNT(*) FROM users;"

# Re-create users (see Terminal 2 SQL above)
```

### "OTP code expired"
- OTP only valid for 10 minutes
- Restart login process to get new OTP

### "Wrong OTP code" error repeatedly
1. Check MailHog for correct code
2. Ensure you're copying the 6-digit number only
3. No spaces or other characters

---

## Part 7: Environment Summary

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:3000 | ✅ |
| Backend | http://localhost:8080 | ✅ |
| AI Service | http://localhost:8000 | ✅ |
| MailHog | http://localhost:8025 | ✅ |
| MySQL | localhost:3306 | ✅ |

---

## Part 8: Cleanup

### Stop All Services
```bash
# Stop Docker containers
docker stop intelsense-mysql intelsense-mailhog

# Stop backend and frontend from their terminals (Ctrl+C)

# Stop AI service (Ctrl+C in Terminal 4)
```

### Remove Everything (Fresh Start)
```bash
# Remove containers
docker rm intelsense-mysql intelsense-mailhog

# Remove volume (deletes all data)
docker volume rm intelsense-data

# Verify cleanup
docker ps -a
docker volume ls
```

---

## Part 9: Test User Credentials Reference

| Purpose | Email | Password | Role |
|---------|-------|----------|------|
| Login Test | demo@company.com | test123 | CUSTOMER |
| Admin Test | admin@intelsense.ai | test123 | ADMIN |
| Analyst Test | analyst@intelsense.ai | test123 | ANALYST |

All passwords are: `test123` (bcrypt hashed in database)

---

## Part 10: Expected Results

### ✅ Successful Two-Step Login
1. Enter credentials
2. OTP sent to email
3. OTP appears in MailHog
4. Enter OTP code
5. JWT token issued
6. Redirected to role-based dashboard
7. Token stored in localStorage

### ✅ Successful Password Reset
1. Request password reset
2. Email with link sent
3. Link appears in MailHog
4. Click link
5. Set new password
6. Password updated in database
7. Login with new password works

### ✅ Role-Based Routing
- Admin role → `/admin/dashboard`
- Analyst role → `/analyst/dashboard`
- Customer role → `/customer/dashboard`

---

## 📚 Related Documentation

- [LOCAL_MYSQL_AND_AUTH_SETUP.md](LOCAL_MYSQL_AND_AUTH_SETUP.md) - Detailed setup
- [QUICK_START_OTP_AUTH.md](QUICK_START_OTP_AUTH.md) - Quick reference
- [ADMIN_SETUP_AND_DATABASE.md](ADMIN_SETUP_AND_DATABASE.md) - Admin management
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

---

## 🎯 Summary

You now have a complete local development environment with:
- ✅ Persistent MySQL database
- ✅ Local email testing via MailHog
- ✅ Two-step OTP authentication
- ✅ Password reset emails
- ✅ Test users for all roles
- ✅ Complete authentication flow

**Ready to start?** Follow Part 1: Quick 5-Minute Setup above!
