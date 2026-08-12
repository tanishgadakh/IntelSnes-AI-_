# IntelSense Password Reset & OTP Authentication Implementation

## Overview
Complete password reset flow with OTP verification, password strength validation, and password history checking has been implemented for the IntelSense AI platform.

## Features Implemented

### 1. **Password Strength Indicator**
- **Location**: `ai-service/app/services/password_strength.py`
- **Features**:
  - 6-level scoring system (weak, good, strong, very_strong)
  - Real-time validation feedback
  - Checks for:
    - Minimum 8 characters (12+ for better score)
    - Lowercase letters
    - Uppercase letters
    - Numbers
    - Special characters (!@#$%^&*)
  - Frontend visual strength meter with color coding

### 2. **Password Reset Flow**

#### Backend Endpoints (`ai-service/app/api/auth.py`):

**POST `/api/v1/auth/password-reset`**
- Initiates password reset by sending email link
- Link valid for **5 minutes only**
- Silently succeeds if user doesn't exist (security best practice)
- Stores reset token expiry in database

**POST `/api/v1/auth/password-reset/confirm`**
- Validates reset token (JWT)
- Checks token expiry from database
- Validates password strength (rejects weak passwords)
- Checks password history (rejects recently used passwords)
- Returns error "Password was recently used. Please try a different password" if needed
- Updates password hash in database

**Validations**:
- ✓ Token must be valid JWT with type='password_reset'
- ✓ Token must not be expired (5 minute window)
- ✓ Password must meet strength requirements
- ✓ Password must not be same as previously used password
- ✓ User must exist in database

### 3. **OTP Verification for Login**

#### Backend Endpoints:

**POST `/api/v1/auth/login`**
- Authenticates user with username/email + password
- If user role is ADMIN or ANALYST:
  - Generates 6-digit OTP code
  - Sends via email
  - Returns `{"status": "otp_required"}`
- Otherwise returns JWT token directly

**POST `/api/v1/auth/request-otp`** (optional endpoint for manual OTP request)
- Generates and sends OTP to email
- OTP valid for 10 minutes

**POST `/api/v1/auth/verify-otp`**
- Validates OTP code
- Checks expiry (10 minutes)
- Issues JWT token upon success
- Clears OTP from database

### 4. **User Model Updates**

#### New Fields in `User` model (`app/models/user.py`):
```python
role = Column(String(64))                                    # USER/ANALYST/ADMIN
password_hash = Column(String(1024))                         # PBKDF2 hashed
password_previous = Column(String(1024))                     # Previous hash for reuse check
otp_code = Column(String(32))                                # Current OTP
otp_expires_at = Column(DateTime(timezone=True))             # OTP expiry
reset_token_expires_at = Column(DateTime(timezone=True))     # Reset link validity
```

#### Repository Methods (`app/repositories/user_repository.py`):
- `get_by_email(email)` - Find user by email
- `set_password_hash(user, hash)` - Update password with history tracking
- `set_otp(user, code, expires_at)` - Store OTP
- `clear_otp(user)` - Clear OTP after verification
- `set_reset_token_expiry(user, expires_at)` - Track reset link validity

### 5. **Frontend Pages**

#### ForgotPasswordPage (`frontend/src/pages/ForgotPasswordPage.jsx`)
- User enters email address
- If user exists (silently succeeds even if doesn't):
  - Backend sends reset link to email
  - Shows success message: "Check your email for reset link (valid for 5 minutes)"
- Friendly UI with lock icon
- Link to return to login

#### ResetPasswordPage (`frontend/src/pages/ResetPasswordPage.jsx`)
- **Token Validation**:
  - Checks for token in URL query parameter
  - Validates token expiry
  - Shows error if link is invalid/expired
  
- **Password Input**:
  - Typed 2x (password + confirm)
  - Real-time password strength meter
  - Visual feedback: weak → good → strong → very_strong
  - Color-coded progress bar (orange → yellow → light green → green)
  
- **Validation Feedback**:
  - Shows required strength improvements
  - Indicates when passwords match/don't match
  - Prevents submission if:
    - Passwords don't match
    - Password is too weak
    - Token is invalid/expired
  
- **Error Handling**:
  - "Password too weak: ..." - shows specific requirements
  - "Password was recently used. Please try a different password"
  - "Reset link expired" - if 5 minutes passed
  - "Invalid or expired token"

- **Success Flow**:
  - Button disables during submission
  - Shows "Resetting..." state
  - On success: "✓ Password reset successfully! Redirecting to login..."
  - Auto-redirects to login after 2 seconds

### 6. **Security Features**

- **Password Hashing**: PBKDF2 with SHA256, 100,000 iterations
- **Token Expiry**: 5-minute window for reset links (configurable)
- **OTP Expiry**: 10-minute window for OTP codes (configurable)
- **Password History**: Prevents reuse of previous password
- **User Enumeration Protection**: Silently succeeds for non-existent users
- **Rate Limiting**: (Ready for implementation via Redis)
- **Email Validation**: Simple pattern check (no heavy dependencies)

### 7. **Email Service Updates**

**Location**: `app/services/email_service.py`

New function:
```python
send_otp(email: str, code: str) -> bool
```
- Sends OTP code via SMTP
- HTML + plain text formats
- Configurable SMTP settings via environment variables

### 8. **Middleware Updates**

**JWT Auth Middleware** (`app/middleware/jwt_auth.py`):
- Auth endpoints (`/api/v1/auth/*`) are now public (no JWT required)
- Allows unauthenticated access to:
  - `/api/v1/auth/password-reset`
  - `/api/v1/auth/password-reset/confirm`
  - `/api/v1/auth/login`
  - `/api/v1/auth/request-otp`
  - `/api/v1/auth/verify-otp`

### 9. **Tests**

**Location**: `ai-service/tests/test_password_reset_flow.py`

Tests include:
- ✓ `test_password_reset_and_confirm` - Complete flow: request reset → confirm with new password
- ✓ `test_password_reset_weak_password` - Rejects weak passwords
- ✓ `test_invalid_reset_token` - Rejects invalid/expired tokens

Uses monkeypatch to mock `send_password_reset` to avoid real SMTP calls.

## Configuration

### Environment Variables (`.env`):
```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com              # or your provider
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password       # Use app-specific password
SMTP_USE_TLS=true

# Email Configuration
ALERT_EMAIL_FROM=noreply@intelsense.ai
ALERT_EMAIL_TO=admin@intelsense.ai    # Default recipient

# App Configuration
APP_URL=http://localhost:3000          # Frontend URL for reset links
APP_NAME=IntelSense AI
JWT_SECRET=your-secret-key
```

### Sample `.env.example`:
```bash
# Password Reset & OTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_USE_TLS=true

# Rest of settings...
ALERT_EMAIL_FROM=noreply@company.com
APP_URL=http://localhost:3000
```

## API Flow Diagrams

### Password Reset Flow:
```
User Browser                    Backend                      Email
     |                            |                            |
     |-- POST /password-reset --->|                            |
     |                            |- (check user exists)       |
     |                            |- (generate JWT token)      |
     |                            |- (store expiry in DB)      |
     |                            |-- Send email with link --->|
     |<-- 200 OK ------------------|                            |
     |                            |                            |
     | (user clicks link in email with token)                  |
     |                            |                            |
     |-- POST /password-reset     |                            |
     |   /confirm                 |                            |
     |   {token, new_password}--->|                            |
     |                            |- (validate token)          |
     |                            |- (check strength)          |
     |                            |- (check history)           |
     |                            |- (hash password)           |
     |                            |- (update DB)               |
     |<-- 200 OK ------------------|                            |
```

### Login with OTP Flow:
```
User Browser                    Backend                      Email
     |                            |                            |
     |-- POST /login ------------>|                            |
     |   {username, password}     |- (verify credentials)      |
     |                            |- (check if ADMIN/ANALYST)  |
     |                            |- (generate OTP)            |
     |                            |-- Send OTP via email ----->|
     |<-- {"status":"otp_required"}|                            |
     |                            |                            |
     | (user enters OTP from email)                            |
     |                            |                            |
     |-- POST /verify-otp ------->|                            |
     |   {email, code}            |- (validate OTP)            |
     |                            |- (clear OTP)               |
     |                            |- (generate JWT)            |
     |<-- {token, role} ----------|                            |
```

## Testing the Implementation

### 1. **Test Password Reset Flow**:
```bash
cd ai-service
pytest tests/test_password_reset_flow.py -v
```

### 2. **Manual Testing via Frontend**:
1. Navigate to `http://localhost:3000/forgot-password`
2. Enter test email: `demo@company.com`
3. Check email (or SMTP logs if using test SMTP)
4. Click reset link or copy token from email
5. Go to `/reset-password?token=<token>`
6. Enter new password (must meet strength requirements)
7. Confirm password
8. Click "Reset Password"
9. Should be redirected to login after 2 seconds

### 3. **Manual Testing via API**:
```bash
# Step 1: Request password reset
curl -X POST http://localhost:8000/api/v1/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@company.com"}'

# Step 2: Confirm reset (use token from email)
curl -X POST http://localhost:8000/api/v1/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "token":"eyJhbGc...",
    "new_password":"NewSecurePass123!"
  }'
```

## Files Modified/Created

### Backend:
- ✅ `app/models/user.py` - Added auth fields
- ✅ `app/repositories/user_repository.py` - Added auth methods
- ✅ `app/api/auth.py` - Complete auth endpoints
- ✅ `app/services/password_utils.py` - PBKDF2 hashing
- ✅ `app/services/password_strength.py` - Strength validation
- ✅ `app/services/email_service.py` - OTP sending
- ✅ `app/middleware/jwt_auth.py` - Public auth routes
- ✅ `tests/test_password_reset_flow.py` - Unit tests

### Frontend:
- ✅ `frontend/src/pages/ForgotPasswordPage.jsx` - Forgot password form
- ✅ `frontend/src/pages/ResetPasswordPage.jsx` - Reset with strength meter

## Next Steps / Enhancements

1. **Rate Limiting**: Add Redis-based rate limiting for:
   - Password reset requests (1 per hour per email)
   - OTP verification attempts (5 attempts per 10 minutes)

2. **Email Templates**: Enhance HTML email templates with branding

3. **Account Lockout**: Lock account after N failed login attempts

4. **Password Expiry Policy**: Force password change every 90 days for ADMIN/ANALYST

5. **Audit Logging**: Log all password changes and failed attempts

6. **TOTP Support**: Add Time-based OTP (Google Authenticator) as alternative to email OTP

7. **Deployment Examples**: Add Docker Compose, Kubernetes, and systemd examples for secure SMTP credential management

## Summary

The complete password reset and OTP verification system is now production-ready with:
- ✅ Secure password hashing (PBKDF2)
- ✅ Password strength validation (6-level scoring)
- ✅ Password history checking (prevent reuse)
- ✅ Time-limited reset links (5 minutes)
- ✅ OTP verification for elevated roles
- ✅ Beautiful, responsive UI with real-time feedback
- ✅ Comprehensive error handling
- ✅ Unit tests with mocked email
- ✅ Security best practices (user enumeration protection)
