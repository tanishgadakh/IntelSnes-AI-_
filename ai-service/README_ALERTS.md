# Alerts & Scheduler

This service includes a lightweight alerting scheduler that periodically checks recent analytics and sends alerts via Slack and email when the negative ratio exceeds a threshold.

Configuration: see `ALERTING.md` and `.env.example`.

To run locally:

```bash
cd ai-service
source .venv/bin/activate
# ensure .env is configured
uvicorn app.main:app --reload
```

The scheduler will start during application startup and persist alert events to the `alert_events` table.
