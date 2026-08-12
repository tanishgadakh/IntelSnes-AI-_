import os
import logging
import requests
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_slack_webhook(text: str):
    url = os.environ.get("SLACK_WEBHOOK") or settings.SLACK_WEBHOOK
    if not url:
        logger.debug("No Slack webhook configured, skipping alert")
        return False
    try:
        requests.post(url, json={"text": text}, timeout=5)
        return True
    except Exception as e:
        logger.exception("Failed to send slack webhook: %s", e)
        return False


def send_email(subject: str, body: str):
    to_addr = os.environ.get("ALERT_EMAIL_TO") or settings.ALERT_EMAIL_TO
    if not to_addr:
        logger.debug("No alert email configured, skipping email")
        return False
    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg["Subject"] = subject
        msg["From"] = settings.ALERT_EMAIL_FROM or "alerts@intelsense.local"
        msg["To"] = to_addr
        host = settings.SMTP_HOST or os.environ.get("SMTP_HOST") or "localhost"
        port = int(settings.SMTP_PORT or os.environ.get("SMTP_PORT") or 25)
        username = os.environ.get("SMTP_USERNAME") or settings.SMTP_USERNAME
        password = os.environ.get("SMTP_PASSWORD") or settings.SMTP_PASSWORD
        use_tls = bool(os.environ.get("SMTP_USE_TLS", settings.SMTP_USE_TLS))
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
        logger.exception("Failed to send alert email")
        return False


def check_and_alert(overview: dict):
    # Overview should include negative_ratio_percent
    threshold = float(os.environ.get("ALERT_NEGATIVE_RATIO_THRESHOLD", settings.ALERT_NEGATIVE_RATIO_THRESHOLD or 30))
    neg = overview.get("negative_ratio_percent", 0)
    if neg >= threshold:
        text = f"High negative sentiment detected: {neg}% (threshold {threshold}%). Total events={overview.get('total_events',0)}"
        send_slack_webhook(text)
        send_email("IntelSense Alert: High negative sentiment", text)
        return True, text
    return False, ""
