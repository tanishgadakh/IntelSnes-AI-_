import os
import logging
import smtplib
from email.message import EmailMessage
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def _send_email_raw(subject: str, body: str, to: str, html: Optional[str] = None) -> bool:
    if not to:
        logger.debug("No recipient provided for email")
        return False
    msg = EmailMessage()
    if html:
        msg.add_alternative(html, subtype='html')
    else:
        msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = settings.ALERT_EMAIL_FROM or os.environ.get("ALERT_EMAIL_FROM") or f"no-reply@{settings.APP_NAME.lower().replace(' ', '')}.local"
    msg["To"] = to

    host = os.environ.get("SMTP_HOST") or settings.SMTP_HOST or "localhost"
    port = int(os.environ.get("SMTP_PORT") or settings.SMTP_PORT or 25)
    username = os.environ.get("SMTP_USERNAME") or settings.SMTP_USERNAME
    password = os.environ.get("SMTP_PASSWORD") or settings.SMTP_PASSWORD
    use_tls = os.environ.get("SMTP_USE_TLS", str(settings.SMTP_USE_TLS)).lower() in ("1", "true", "yes")

    try:
        with smtplib.SMTP(host, port, timeout=10) as s:
            if use_tls:
                try:
                    s.starttls()
                except Exception:
                    logger.debug("STARTTLS failed or not supported")
            if username and password:
                s.login(username, password)
            s.send_message(msg)
        return True
    except Exception:
        logger.exception("Failed to send email")
        return False


def send_password_reset(email: str, token: str) -> bool:
    reset_url = f"{settings.APP_URL.rstrip('/')}/reset-password?token={token}"
    subject = f"{settings.APP_NAME} - Password reset"
    body = f"We received a request to reset your password. Click the link to reset:\n\n{reset_url}\n\nIf you didn't request this, ignore this email."
    html = f"<p>We received a request to reset your password. <a href=\"{reset_url}\">Click here to reset</a></p><p>If you didn't request this, ignore this email.</p>"
    return _send_email_raw(subject, body, email, html)


def send_otp(email: str, code: str) -> bool:
    """Send OTP code via email for two-factor authentication."""
    subject = f"{settings.APP_NAME} - Verification code"
    body = f"Your verification code is: {code}\n\nThis code will expire shortly. If you did not request this, ignore this email."
    html = f"<p>Your verification code is: <strong>{code}</strong></p><p>This code will expire shortly. If you did not request this, ignore this email.</p>"
    return _send_email_raw(subject, body, email, html)
