# Admin Setup Guide & Database Queries

## Overview
This guide explains how to set up the MySQL database for the IntelSense platform, create user accounts, and manage authentication through the login form.

---

## 1. Database Setup

### 1.1 Create the Main Database
First, create the database and character set:

```sql
CREATE DATABASE intelsense_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE intelsense_ai;
```

### 1.2 Create Users Table
The users table stores login credentials and user profiles:

```sql
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
```

### 1.3 Create Feedback Table
For storing customer feedback:

```sql
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    source VARCHAR(255),
    user_id BIGINT,
    ai_result JSON,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 1.4 Create Predictions Table
For storing AI prediction results:

```sql
CREATE TABLE predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    input_text VARCHAR(4000) NOT NULL,
    source VARCHAR(255),
    result JSON NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 1.5 Create Analytics Events Table
For tracking user analytics:

```sql
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
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 2. Creating Admin & Test Users

### 2.1 Create Initial Admin User
Use this query to create the first admin user. Password should be hashed using bcrypt before inserting:

```sql
-- For demo purposes, we use a pre-hashed password
-- This is password: "admin123" hashed with bcrypt (salt rounds: 10)
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    password,
    first_name, 
    last_name, 
    role, 
    status
) VALUES (
    'admin@intelsense.ai',
    'admin@intelsense.ai',
    '$2b$10$example_bcrypt_hash_here',
    'admin123',
    'Admin',
    'User',
    'ADMIN',
    'ACTIVE'
);
```

**Note:** For production, use bcrypt hashing. You can hash passwords using:
- Python: `bcrypt.hashpw(b'password', bcrypt.gensalt())`
- Online tools: bcrypt.online (for testing only)
- Backend auth service: See Backend Setup section

### 2.2 Create Demo Customer User
```sql
INSERT INTO users (
    username, 
    email, 
    password_hash,
    password,
    first_name, 
    last_name,
    company,
    role, 
    status
) VALUES (
    'demo@company.com',
    'demo@company.com',
    '$2b$10$example_bcrypt_hash_here',
    'demo123',
    'Demo',
    'Customer',
    'IntelSense Demo',
    'CUSTOMER',
    'ACTIVE'
);
```

### 2.3 Create Demo Analyst User
```sql
INSERT INTO users (
    username, 
    email, 
    password_hash,
    password,
    first_name, 
    last_name,
    company,
    department,
    job_title,
    role, 
    status
) VALUES (
    'analyst@intelsense.ai',
    'analyst@intelsense.ai',
    '$2b$10$example_bcrypt_hash_here',
    'analyst123',
    'Rahul',
    'Analyst',
    'IntelSense',
    'Analytics',
    'Senior Analyst',
    'ANALYST',
    'ACTIVE'
);
```

### 2.4 View All Users
```sql
SELECT id, username, email, role, status, created_at FROM users;
```

### 2.5 Update User Role
```sql
-- Promote a user to ANALYST
UPDATE users SET role = 'ANALYST', status = 'ACTIVE' WHERE email = 'user@example.com';

-- Promote to ADMIN
UPDATE users SET role = 'ADMIN', status = 'ACTIVE' WHERE email = 'user@example.com';

-- Deactivate a user
UPDATE users SET status = 'INACTIVE' WHERE email = 'user@example.com';
```

---

## 3. Login Form Workflow

### 3.1 Frontend Sign-In Form
Location: `frontend/src/pages/LoginPage.jsx`

**Default credentials:**
- **Email:** `demo@company.com`
- **Password:** `demo123`

The form accepts:
- Email or username field
- Password field
- Remember me checkbox (optional)

### 3.2 Backend Authentication Flow
Location: `backend/src/main/java/com/intelsenseai/controller/AuthController.java`

**Login Endpoint:**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "demo@company.com",
  "password": "demo123"
}
```

**Successful Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "demo@company.com",
  "email": "demo@company.com",
  "role": "CUSTOMER",
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2026-08-14T10:30:00Z"
}
```

### 3.3 Authentication Flow

1. **Frontend sends credentials** → `POST /api/auth/login`
2. **Backend validates** user existence and password
3. **Backend generates JWT token** with user role embedded
4. **Frontend stores token** in localStorage:
   - `intelsense-token` (JWT)
   - `intelsense-role` (ADMIN, ANALYST, CUSTOMER)
   - `intelsense-username` (email or username)
5. **Frontend redirects** based on role:
   - ADMIN → `/admin/dashboard`
   - ANALYST → `/analyst/dashboard`
   - CUSTOMER → `/customer/dashboard`
   - DEFAULT → `/dashboard`

---

## 4. Password Management

### 4.1 Password Reset Request
```
POST /api/auth/password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 4.2 Password Reset Confirm
```
POST /api/auth/password-reset/confirm
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePassword123!"
}
```

### 4.3 Manual Password Update in Database
```sql
-- Update password for a user (use bcrypt hash)
UPDATE users 
SET password_hash = '$2b$10$new_bcrypt_hash',
    password_previous = password_hash,
    updated_at = NOW()
WHERE email = 'user@example.com';
```

---

## 5. User Status & Role Management

### 5.1 User Roles
| Role | Access Level | Description |
|------|-------------|-------------|
| ADMIN | Full platform control | Manage users, approve analysts, control subscriptions, view analytics, manage AI service |
| ANALYST | Analytics & reporting | Analyze feedback, generate reports, validate predictions, upload datasets |
| CUSTOMER | Submit feedback | Submit feedback, run AI analysis, view personal reports, manage profile |
| VIEWER | Read-only access | View dashboards and reports (limited) |

### 5.2 User Status
| Status | Meaning |
|--------|---------|
| ACTIVE | User can log in and access the platform |
| INACTIVE | User account is disabled |
| PENDING | User registered but admin approval is pending |
| REJECTED | Admin rejected the user's access request |

### 5.3 Approve a Pending User
```sql
-- Change status from PENDING to ACTIVE
UPDATE users 
SET status = 'ACTIVE' 
WHERE status = 'PENDING' AND role = 'ANALYST';

-- Or target a specific user
UPDATE users 
SET status = 'ACTIVE' 
WHERE email = 'new-analyst@company.com';
```

### 5.4 List All Pending Approvals
```sql
SELECT id, username, email, company, job_title, access_reason, created_at 
FROM users 
WHERE status = 'PENDING' 
ORDER BY created_at DESC;
```

---

## 6. Connecting to MySQL from the Services

### 6.1 Backend Configuration
Edit: `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/intelsense_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: your_mysql_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update  # Set to 'validate' in production
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        show_sql: false
```

### 6.2 AI Service Configuration
Edit: `ai-service/.env`

```env
DATABASE_URL=mysql+aiomysql://root:your_mysql_password@localhost:3306/intelsense_ai
USE_DUMMY_MODELS=false
JWT_SECRET=your-secure-jwt-secret-key-here
```

### 6.3 Start Services with MySQL

**Backend:**
```bash
cd backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local
```

**AI Service:**
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

---

## 7. Testing the Login Flow

### Step 1: Start MySQL (if using local MySQL)
```bash
# Using Docker
docker run -d \
  --name intelsense-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=intelsense_ai \
  -p 3306:3306 \
  mysql:8.0
```

### Step 2: Insert Test Users
Run the SQL queries from Section 2 to create admin and demo users.

### Step 3: Start All Services
```bash
# From repo root
bash run-all.sh
```

### Step 4: Test Login
1. Open browser: `http://localhost:3000`
2. Sign in with:
   - **Email:** `demo@company.com`
   - **Password:** `demo123`
3. Verify redirect to customer dashboard
4. Check localStorage for token: `localStorage.getItem('intelsense-token')`

### Step 5: Test Multiple Roles
Create additional users with different roles and test:
- Admin login → Admin dashboard
- Analyst login → Analyst portal
- Customer login → Customer workspace

---

## 8. Troubleshooting

### Issue: "Invalid email or password"
**Solution:**
1. Verify user exists: `SELECT * FROM users WHERE email = 'test@example.com';`
2. Check password is hashed with bcrypt
3. Verify `status = 'ACTIVE'`

### Issue: "MySQL connection refused"
**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Verify database exists: `SHOW DATABASES;`
3. Check connection string in `.env` and `application.yml`

### Issue: "JWT token expired"
**Solution:**
1. Check token expiry in JWT payload: `parseJwt(token)`
2. Clear localStorage and log in again
3. Update JWT_SECRET if changed

### Issue: "No tables in database"
**Solution:**
1. Run migration: `alembic upgrade head` (AI service)
2. Set `ddl-auto: update` in Spring config (backend)
3. Manually create tables using SQL from Section 1

---

## 9. Quick Reference Commands

```sql
-- Create database
CREATE DATABASE intelsense_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Check all users
SELECT username, email, role, status FROM users;

-- Add admin user
INSERT INTO users (username, email, password_hash, role, status) 
VALUES ('admin@test.com', 'admin@test.com', '$2b$10$hash', 'ADMIN', 'ACTIVE');

-- Activate pending users
UPDATE users SET status = 'ACTIVE' WHERE status = 'PENDING';

-- Reset user password
UPDATE users SET password_hash = '$2b$10$newhash' WHERE email = 'user@test.com';

-- Delete user
DELETE FROM users WHERE email = 'user@test.com';
```

---

## 10. Next Steps

1. **Set up database** using Section 1 SQL queries
2. **Create admin user** using Section 2.1
3. **Create test users** using Section 2.2 and 2.3
4. **Update backend config** with MySQL credentials (Section 6.1)
5. **Update AI service config** with database URL (Section 6.2)
6. **Start services** and test login (Section 7)
7. **Manage users** via admin dashboard or SQL queries

For additional help, see:
- [LOCAL_RUN_GUIDE.md](LOCAL_RUN_GUIDE.md)
- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
