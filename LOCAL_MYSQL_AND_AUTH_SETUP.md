# Complete Local MySQL + Authentication Setup

## Part 1: Local MySQL Setup with Docker

### 1.1 Quick MySQL Setup
Run this command to start MySQL locally:

```bash
docker run -d \
  --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -p 3306:3306 \
  -v intelsense-data:/var/lib/mysql \
  mysql:8.0
```

### 1.2 Verify MySQL is Running
```bash
# Check if container is running
docker ps | grep intelsense-mysql

# Connect to MySQL
mysql -h localhost -u root -proot intelsense_ai
```

### 1.3 Stop/Restart MySQL
```bash
# Stop MySQL
docker stop intelsense-mysql

# Start MySQL again
docker start intelsense-mysql

# Remove MySQL (clean slate)
docker rm intelsense-mysql
```

---

## Part 2: Local Email Server Setup (MailHog)

MailHog is a local email testing server that catches all emails. Perfect for development.

### 2.1 Start MailHog
```bash
docker run -d \
  --name intelsense-mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog
```

### 2.2 Access MailHog Dashboard
- Open browser: http://localhost:8025
- All password reset emails and OTP codes will appear here
- No actual email sending - everything captured locally

### 2.3 Stop MailHog
```bash
docker stop intelsense-mailhog
```

---

## Part 3: Configure AI Service for Local Emails

### 3.1 Update `.env` File
Create or update `ai-service/.env`:

```env
# Database
DATABASE_URL=mysql+aiomysql://root:root@localhost:3306/intelsense_ai

# JWT
JWT_SECRET=local-test-secret-key-change-in-production

# Email (MailHog Configuration)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_USE_TLS=false
ALERT_EMAIL_FROM=noreply@intelsense.local
APP_URL=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# Models
USE_DUMMY_MODELS=false
```

### 3.2 Update Backend Configuration
Edit: `backend/src/main/resources/application-local.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

# Email Configuration (if backend has email support)
mail:
  smtp:
    host: localhost
    port: 1025
    username:
    password:
    protocol: smtp
    auth: false
    starttls-enable: false
    from: noreply@intelsense.local
```

---

## Part 4: Database Schema Setup

### 4.1 Connect to MySQL
```bash
mysql -h localhost -u root -proot intelsense_ai
```

### 4.2 Create Tables
Run these SQL commands:

```sql
-- Users Table
CREATE TABLE users (
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

-- Insert test users with bcrypt hashed passwords
-- Password for all: test123

INSERT INTO users (username, email, password, first_name, last_name, role, status) VALUES
('admin@intelsense.ai', 'admin@intelsense.ai', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Admin', 'User', 'ADMIN', 'ACTIVE'),
('demo@company.com', 'demo@company.com', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Demo', 'Customer', 'CUSTOMER', 'ACTIVE'),
('analyst@intelsense.ai', 'analyst@intelsense.ai', '$2a$10$YAM9lT0/DJqmZSyPMaC3m.eJLHCF6R8gHWrfJn4H9m5QZqJTjChzi', 'Rahul', 'Analyst', 'ANALYST', 'ACTIVE');

-- Feedback Table
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    source VARCHAR(255),
    user_id BIGINT,
    ai_result JSON,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Predictions Table
CREATE TABLE predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    input_text VARCHAR(4000) NOT NULL,
    source VARCHAR(255),
    result JSON NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics Events Table
CREATE TABLE analytics_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    source VARCHAR(255),
    sentiment_label VARCHAR(64),
    sentiment_score VARCHAR(64),
    topics JSON,
    keywords JSON,
    aspects JSON,
    summary VARCHAR(4000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Test Credentials:**
- **Admin**: admin@intelsense.ai / test123
- **Customer**: demo@company.com / test123
- **Analyst**: analyst@intelsense.ai / test123

---

## Part 5: Local Development Command

### 5.1 Start Everything Locally
Run these commands in separate terminals:

**Terminal 1 - MySQL:**
```bash
docker start intelsense-mysql
```

**Terminal 2 - MailHog:**
```bash
docker start intelsense-mailhog
```

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

### 5.2 One-Command Startup Script
Create `local-setup.sh`:

```bash
#!/bin/bash

echo "Starting MySQL..."
docker start intelsense-mysql 2>/dev/null || docker run -d \
  --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -p 3306:3306 \
  -v intelsense-data:/var/lib/mysql \
  mysql:8.0

echo "Starting MailHog..."
docker start intelsense-mailhog 2>/dev/null || docker run -d \
  --name intelsense-mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog

echo "✅ MySQL running on localhost:3306 (user: root, pass: root)"
echo "✅ MailHog dashboard: http://localhost:8025"
echo ""
echo "Start services in separate terminals:"
echo "  Terminal 1: cd backend && mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local"
echo "  Terminal 2: cd ai-service && source .venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo "  Terminal 3: cd frontend && npm run dev -- --host 0.0.0.0"
echo ""
echo "Frontend: http://localhost:3000"
```

Run it:
```bash
chmod +x local-setup.sh
./local-setup.sh
```

---

## Part 6: Testing Password Reset with MailHog

### 6.1 Test Password Reset Flow
1. Open http://localhost:3000
2. Click "Forgot Password?"
3. Enter email: `demo@company.com`
4. Open MailHog dashboard: http://localhost:8025
5. Check for password reset email
6. Click the reset link from the email
7. Enter new password and confirm

### 6.2 View All Emails in MailHog
- Open http://localhost:8025
- All emails captured locally appear here
- Perfect for development testing

---

## Part 7: Testing Two-Step OTP Authentication

### 7.1 Expected Flow
1. User enters email and password → sign in
2. System sends OTP to email
3. MailHog displays OTP code
4. User enters OTP code in prompt
5. User gains access to dashboard

### 7.2 Test OTP
1. Open http://localhost:3000
2. Sign in with valid credentials
3. Check MailHog (http://localhost:8025) for OTP email
4. Copy OTP code and enter in the prompt
5. Dashboard opens

---

## Part 8: Troubleshooting

### Issue: MySQL connection refused
```bash
# Check if MySQL is running
docker ps | grep intelsense-mysql

# Start it if not running
docker start intelsense-mysql

# View logs
docker logs intelsense-mysql
```

### Issue: Can't connect to MailHog
```bash
# Check if MailHog is running
docker ps | grep intelsense-mailhog

# Start it
docker start intelsense-mailhog

# View logs
docker logs intelsense-mailhog
```

### Issue: Tables not created
```bash
# Connect to MySQL and check tables
mysql -h localhost -u root -proot intelsense_ai
SHOW TABLES;
DESC users;
```

### Issue: Emails not showing in MailHog
1. Verify SMTP_HOST=localhost in .env
2. Verify SMTP_PORT=1025 in .env
3. Check backend/ai-service logs for email errors
4. Restart AI service if .env changed

### Issue: OTP not being sent
1. Check email service is configured correctly
2. Verify MailHog is running and listening on 1025
3. Check AI service logs for SMTP errors
4. Verify user email address is correct in database

---

## Quick Reference

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| Frontend | http://localhost:3000 | demo@company.com | test123 |
| Backend | http://localhost:8080 | - | - |
| AI Service | http://localhost:8000 | - | - |
| MailHog | http://localhost:8025 | - | - |
| MySQL | localhost:3306 | root | root |

---

## Docker Cleanup Commands

```bash
# Stop all containers
docker stop intelsense-mysql intelsense-mailhog

# Remove containers
docker rm intelsense-mysql intelsense-mailhog

# Remove volume (delete all data)
docker volume rm intelsense-data

# View all containers
docker ps -a

# View all volumes
docker volume ls
```

---

## Next Steps

1. ✅ Set up MySQL with Docker
2. ✅ Set up MailHog for local emails
3. ✅ Configure `.env` with SMTP settings
4. ✅ Create database schema and test users
5. ⏳ Implement OTP authentication flow (see NEXT section)
6. ⏳ Test password reset emails
7. ⏳ Test OTP verification

