# Alerting Configuration

Configure Slack and email alerts for high negative sentiment ratios.

Environment variables (or add to `.env`):

- `SLACK_WEBHOOK` — Slack incoming webhook URL.
- `ALERT_EMAIL_TO` — Comma-separated recipient address for alert emails.
- `ALERT_EMAIL_FROM` — Sender address for alert emails (optional).
- `SMTP_HOST` — SMTP host for sending emails (optional; default: localhost).
- `SMTP_PORT` — SMTP port (optional; default: 25).
- `ALERT_NEGATIVE_RATIO_THRESHOLD` — Percentage threshold to trigger alerts (default: 30).
- `ALERT_SCHEDULE_SECONDS` — How frequently (seconds) the scheduler checks analytics (default: 300).

Examples

Add to `ai-service/.env` or system environment:

```
SLACK_WEBHOOK=https://hooks.slack.com/services/xxxxx/xxxxx/xxxxx
ALERT_EMAIL_TO=alerts@example.com
ALERT_EMAIL_FROM=alerts@intelsense.local
SMTP_HOST=smtp.example.com
SMTP_PORT=587
ALERT_NEGATIVE_RATIO_THRESHOLD=30
ALERT_SCHEDULE_SECONDS=300
```

Notes

- If no Slack webhook or email is configured, alert sending is skipped gracefully.
- The scheduler runs in the FastAPI process; for production, consider moving alerts to a separate worker or cron job.

SMTP authentication

The alerting/email functionality supports SMTP authentication and TLS. Configure the following environment variables or place them in your `.env` (do not commit credentials):

- `SMTP_USERNAME` — SMTP account username
- `SMTP_PASSWORD` — SMTP account password
- `SMTP_USE_TLS` — `true` to enable STARTTLS

Password reset emails

The service exposes a lightweight password-reset endpoint at `/api/v1/auth/password-reset` which accepts `{ "email": "user@example.com" }` and sends a reset link to the provided address using the configured SMTP settings.

