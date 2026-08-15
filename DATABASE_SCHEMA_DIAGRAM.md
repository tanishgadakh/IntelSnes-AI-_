# Database Schema Diagram & Relationships

## 🗄️ Complete Database Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IntelSense Database                                  │
│                        (intelsense_ai MySQL/H2)                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│      BACKEND TABLES    │         │   AI SERVICE TABLES    │
│   (Spring Boot/JPA)    │         │  (FastAPI/SQLAlchemy)  │
├────────────────────────┤         ├────────────────────────┤
│                        │         │                        │
│  ▪ users              │◄────────►│  ▪ users              │
│  ▪ feedbacks          │         │  ▪ predictions        │
│  ▪ platform_stats     │         │  ▪ analytics_events   │
│  ▪ testimonials       │         │  ▪ alert_events       │
│                        │         │  ▪ aspect_results     │
│                        │         │  ▪ emotion_results    │
│                        │         │  ▪ keywords           │
│                        │         │  ▪ recommendations    │
│                        │         │  ▪ summaries          │
│                        │         │  ▪ audit_logs         │
│                        │         │                        │
└────────────────────────┘         └────────────────────────┘
         ▲                                     ▲
         │                                     │
         └─────────────────┬────────────────────┘
                          │
            (Shared users table for authentication)
```

---

## 📊 Detailed Table Schemas

### USERS TABLE (Shared)
```
┌──────────────────────────────────────────────────────┐
│ TABLE: users                                         │
├──────────────────────────────────────────────────────┤
│ Column               │ Type         │ Constraints   │
├──────────────────────┼──────────────┼───────────────┤
│ id                   │ INT/BIGINT   │ PK, AI        │
│ username             │ VARCHAR(255) │ UNIQUE, NOT NULL│
│ email                │ VARCHAR(255) │ UNIQUE, NOT NULL│
│ password             │ VARCHAR(255) │ (Backend)     │
│ password_hash        │ VARCHAR(1024)│ (AI Service)  │
│ password_previous    │ VARCHAR(1024)│ (AI Service)  │
│ first_name           │ VARCHAR(255) │ (Backend)     │
│ last_name            │ VARCHAR(255) │ (Backend)     │
│ company              │ VARCHAR(255) │               │
│ phone                │ VARCHAR(255) │               │
│ department           │ VARCHAR(255) │               │
│ job_title            │ VARCHAR(255) │               │
│ experience           │ VARCHAR(255) │               │
│ access_reason        │ TEXT         │               │
│ rejection_reason     │ TEXT         │               │
│ role                 │ VARCHAR(255) │ DEFAULT 'VIEWER'│
│ status               │ VARCHAR(255) │ DEFAULT 'PENDING'│
│ otp_code             │ VARCHAR(32)  │ (AI Service)  │
│ otp_expires_at       │ DATETIME     │ (AI Service)  │
│ reset_token_expires_at│ DATETIME    │ (AI Service)  │
│ created_at           │ DATETIME     │ DEFAULT NOW   │
└──────────────────────┴──────────────┴───────────────┘

ROLE VALUES: ADMIN, MANAGER, ANALYST, CUSTOMER, VIEWER
STATUS VALUES: PENDING, ACTIVE, REJECTED
```

---

### FEEDBACKS TABLE (Backend Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: feedbacks                                 │
├──────────────────────────────────────────────────┤
│ Column      │ Type         │ Constraints        │
├─────────────┼──────────────┼────────────────────┤
│ id          │ BIGINT       │ PK, AUTO_INCREMENT│
│ text        │ VARCHAR(255) │ NOT NULL          │
│ source      │ VARCHAR(255) │                   │
│ ai_result   │ TEXT         │                   │
│ created_by  │ VARCHAR(255) │                   │
│ created_at  │ DATETIME     │ DEFAULT NOW       │
└─────────────┴──────────────┴────────────────────┘

PURPOSE: Store user feedback for training/analytics
```

---

### PLATFORM_STATISTICS TABLE (Backend Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: platform_statistics                       │
├──────────────────────────────────────────────────┤
│ Column          │ Type   │ Constraints          │
├─────────────────┼────────┼──────────────────────┤
│ id              │ BIGINT │ PK, AUTO_INCREMENT  │
│ predictions     │ BIGINT │ DEFAULT 2500000     │
│ accuracy        │ DOUBLE │ DEFAULT 99.2        │
│ organizations   │ INT    │ DEFAULT 250         │
│ users           │ INT    │ DEFAULT 50000       │
└─────────────────┴────────┴──────────────────────┘

PURPOSE: Track platform-wide statistics for dashboard
```

---

### TESTIMONIALS TABLE (Backend Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: testimonials                              │
├──────────────────────────────────────────────────┤
│ Column   │ Type         │ Constraints           │
├──────────┼──────────────┼──────────────────────┤
│ id       │ BIGINT       │ PK, AUTO_INCREMENT  │
│ quote    │ TEXT         │ NOT NULL            │
│ author   │ VARCHAR(255) │ NOT NULL            │
│ company  │ VARCHAR(255) │ NOT NULL            │
│ rating   │ INT          │ DEFAULT 5           │
│ active   │ BOOLEAN      │ DEFAULT TRUE        │
└──────────┴──────────────┴──────────────────────┘

PURPOSE: Display customer testimonials on landing page
```

---

### PREDICTIONS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: predictions                               │
├──────────────────────────────────────────────────┤
│ Column      │ Type          │ Constraints       │
├─────────────┼───────────────┼─────────────────┤
│ id          │ INT           │ PK, AI          │
│ input_text  │ VARCHAR(4000) │ NOT NULL        │
│ source      │ VARCHAR(255)  │                 │
│ result      │ JSON          │ NOT NULL        │
│ created_at  │ DATETIME      │ DEFAULT NOW     │
└─────────────┴───────────────┴─────────────────┘

RESULT JSON STRUCTURE:
{
  "sentiment": "positive|negative|neutral",
  "sentiment_score": 0.95,
  "emotions": {...},
  "keywords": [...],
  "aspects": {...},
  "topics": [...],
  "summary": "..."
}
```

---

### ANALYTICS_EVENTS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: analytics_events                          │
├──────────────────────────────────────────────────┤
│ Column          │ Type          │ Constraints    │
├─────────────────┼───────────────┼────────────────┤
│ id              │ INT           │ PK, AI         │
│ source          │ VARCHAR(255)  │                │
│ sentiment_label │ VARCHAR(64)   │                │
│ sentiment_score │ VARCHAR(64)   │                │
│ topics          │ JSON          │                │
│ keywords        │ JSON          │                │
│ aspects         │ JSON          │                │
│ summary         │ VARCHAR(4000) │                │
│ created_at      │ DATETIME      │ DEFAULT NOW    │
└─────────────────┴───────────────┴────────────────┘

PURPOSE: Store aggregated analytics for reporting
```

---

### ALERT_EVENTS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: alert_events                              │
├──────────────────────────────────────────────────┤
│ Column      │ Type          │ Constraints       │
├─────────────┼───────────────┼─────────────────┤
│ id          │ INT           │ PK, AI          │
│ alert_type  │ VARCHAR(255)  │ NOT NULL        │
│ severity    │ VARCHAR(64)   │                 │
│ message     │ VARCHAR(1000) │                 │
│ details     │ JSON          │                 │
│ created_at  │ DATETIME      │ DEFAULT NOW     │
└─────────────┴───────────────┴─────────────────┘

PURPOSE: Track system alerts and notifications
```

---

### ASPECT_RESULTS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: aspect_results                            │
├──────────────────────────────────────────────────┤
│ Column      │ Type         │ Constraints       │
├─────────────┼──────────────┼─────────────────┤
│ id          │ INT          │ PK, AI          │
│ aspect      │ VARCHAR(255) │                 │
│ sentiment   │ VARCHAR(64)  │                 │
│ score       │ FLOAT        │                 │
│ created_at  │ DATETIME     │ DEFAULT NOW     │
└─────────────┴──────────────┴─────────────────┘

PURPOSE: Aspect-based sentiment analysis results
```

---

### EMOTION_RESULTS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: emotion_results                           │
├──────────────────────────────────────────────────┤
│ Column      │ Type         │ Constraints       │
├─────────────┼──────────────┼─────────────────┤
│ id          │ INT          │ PK, AI          │
│ emotion     │ VARCHAR(64)  │                 │
│ score       │ FLOAT        │                 │
│ intensity   │ VARCHAR(64)  │                 │
│ created_at  │ DATETIME     │ DEFAULT NOW     │
└─────────────┴──────────────┴─────────────────┘

EMOTIONS: joy, sadness, anger, fear, surprise, disgust
```

---

### KEYWORDS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: keywords                                  │
├──────────────────────────────────────────────────┤
│ Column            │ Type         │ Constraints   │
├───────────────────┼──────────────┼───────────────┤
│ id                │ INT          │ PK, AI        │
│ keyword           │ VARCHAR(255) │                │
│ frequency         │ INT          │                │
│ relevance_score   │ FLOAT        │                │
│ created_at        │ DATETIME     │ DEFAULT NOW   │
└───────────────────┴──────────────┴───────────────┘

PURPOSE: Extract and track important keywords
```

---

### RECOMMENDATIONS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: recommendations                           │
├──────────────────────────────────────────────────┤
│ Column                │ Type         │ Constraint │
├───────────────────────┼──────────────┼───────────┤
│ id                    │ INT          │ PK, AI    │
│ recommendation_text   │ TEXT         │           │
│ category              │ VARCHAR(255) │           │
│ priority              │ VARCHAR(64)  │           │
│ confidence            │ FLOAT        │           │
│ created_at            │ DATETIME     │ DEFAULT   │
└───────────────────────┴──────────────┴───────────┘

PURPOSE: Store AI recommendations for actions
```

---

### SUMMARIES TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: summaries                                 │
├──────────────────────────────────────────────────┤
│ Column           │ Type         │ Constraints    │
├──────────────────┼──────────────┼────────────────┤
│ id               │ INT          │ PK, AI         │
│ summary_text     │ TEXT         │                │
│ key_points       │ JSON         │                │
│ length           │ INT          │                │
│ created_at       │ DATETIME     │ DEFAULT NOW    │
└──────────────────┴──────────────┴────────────────┘

PURPOSE: Store text summaries generated by AI
```

---

### AUDIT_LOGS TABLE (AI Service Only)
```
┌──────────────────────────────────────────────────┐
│ TABLE: audit_logs                                │
├──────────────────────────────────────────────────┤
│ Column      │ Type          │ Constraints       │
├─────────────┼───────────────┼─────────────────┤
│ id          │ INT           │ PK, AI          │
│ action      │ VARCHAR(255)  │                 │
│ detail      │ VARCHAR(2000) │                 │
│ created_at  │ DATETIME      │ DEFAULT NOW     │
└─────────────┴───────────────┴─────────────────┘

PURPOSE: Track system actions for compliance/audit
```

---

## 🔄 Data Flow Diagrams

### User Registration Flow
```
Frontend (RegisterPage)
    │
    └──► Backend: POST /api/auth/register
           │
           └──► Create User in users table
           │    └─ username ✓
           │    └─ email ✓
           │    └─ password (Backend) ✓
           │    └─ role = CUSTOMER
           │    └─ status = PENDING/ACTIVE
           │
           └──► Return JWT Token
```

### Login with OTP Flow
```
Frontend (LoginPage)
    │
    └──► AI Service: POST /api/v1/auth/login
           │
           └──► Find User in users table (by email/username)
           │    └─ Verify password_hash
           │
           └──► Generate OTP
           │    └─ otp_code = 6 random digits
           │    └─ otp_expires_at = now + 10 min
           │    └─ Save to users table
           │
           └──► Send OTP via email (MailHog)
           │
           └──► Return { requires_otp: true }

Frontend: User checks email, enters OTP

Frontend (LoginPage)
    │
    └──► AI Service: POST /api/v1/auth/verify-otp
           │
           └──► Find User in users table
           │    └─ Check otp_code matches
           │    └─ Check otp_expires_at not passed
           │
           └──► Generate JWT Token
           │    └─ payload: { user_id, email, role }
           │    └─ sign with JWT_SECRET
           │
           └──► Clear otp_code from users table
           │
           └──► Return { access_token: "jwt..." }
```

### Password Reset Flow
```
Frontend (ForgotPasswordPage)
    │
    └──► AI Service: POST /api/v1/auth/password-reset
           │
           └──► Find User in users table
           │    └─ by email
           │
           └──► Generate reset token
           │    └─ reset_token_expires_at = now + 1 hour
           │    └─ Save to users table
           │
           └──► Send reset email via SMTP
           │    └─ Include reset link with token
           │
           └──► Return { message: "Reset email sent" }

Frontend: User clicks reset link in email

Frontend (ResetPasswordPage)
    │
    └──► AI Service: POST /api/v1/auth/password-reset/confirm
           │
           └──► Find User in users table
           │    └─ by reset_token_expires_at validity
           │
           └──► Hash new password
           │    └─ password_hash = bcrypt(new_password)
           │    └─ password_previous = old password_hash
           │
           └──► Update users table
           │    └─ password_hash = new hash
           │    └─ reset_token_expires_at = null
           │
           └──► Return { message: "Password reset" }
```

### Prediction Flow
```
Frontend (Dashboard)
    │
    └──► Backend: POST /api/prediction
           │
           └──► Backend calls AI Service
           │    └─ POST /api/v1/prediction
           │
           └──► AI Service processes input
           │    └─ Run sentiment analysis
           │    └─ Extract emotions, keywords, aspects
           │    └─ Generate summary
           │    └─ Create topics
           │
           └──► Save to predictions table
           │    └─ input_text
           │    └─ result (JSON with all analyses)
           │    └─ source
           │
           └──► Save analytics to analytics_events
           │    └─ sentiment_label
           │    └─ sentiment_score
           │    └─ topics, keywords, aspects, summary
           │
           └──► Return results to Frontend
```

---

## 📋 Table Creation Order

**When Backend Starts**:
1. Hibernate scans for @Entity classes
2. Creates tables in this order:
   - users
   - feedbacks
   - platform_statistics
   - testimonials

**When AI Service Starts**:
1. Alembic checks migration history
2. Runs migration 001:
   - Creates predictions table
   - Creates analytics_events table
3. SQLAlchemy models validate schema:
   - users (shared with backend)
   - alert_events
   - aspect_results
   - emotion_results
   - keywords
   - recommendations
   - summaries
   - audit_logs

---

## ✅ Verification Query Samples

### List All Tables
```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA='intelsense_ai' 
ORDER BY TABLE_NAME;
```

### Count Records by Table
```sql
SELECT 
  'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'feedbacks', COUNT(*) FROM feedbacks
UNION ALL
SELECT 'predictions', COUNT(*) FROM predictions
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM analytics_events
-- ... etc for all tables
```

### Check User with OTP Fields
```sql
SELECT 
  id, username, email, role, status,
  otp_code, otp_expires_at, reset_token_expires_at
FROM users
WHERE username = 'demo';
```

### Check Recent Predictions
```sql
SELECT id, input_text, source, created_at
FROM predictions
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🎯 Summary

✅ **Total Tables**: 14
- Backend: 4 tables (users, feedbacks, platform_statistics, testimonials)
- AI Service: 10 tables (users shared, + 9 others)

✅ **Automatic Creation**: Yes
- Backend: Hibernate DDL-Auto (update mode)
- AI Service: Alembic migrations

✅ **Shared Tables**: users (contains OTP and password reset fields)

✅ **All Required Fields**: Present and properly configured

The database schema is **complete and production-ready**! 🚀
