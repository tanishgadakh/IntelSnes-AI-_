package com.intelsenseai.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MonitoringService {

    public Map<String, Object> getAnalyticsSummary() {
        return Map.of(
                "total_predictions", 12840,
                "sentiment_breakdown", Map.of(
                        "positive", 7420,
                        "neutral", 3205,
                        "negative", 2215
                ),
                "topics", List.of("Delivery", "Support", "Pricing", "Experience")
        );
    }

    public List<Map<String, Object>> getRecentAlerts() {
        return List.of(
                Map.of(
                        "id", 1,
                        "level", "warning",
                        "message", "Confidence dipped below expected threshold for sentiment model",
                        "created_at", "2026-08-15T10:45:00Z"
                ),
                Map.of(
                        "id", 2,
                        "level", "info",
                        "message", "AI service completed successfully across all active tenants",
                        "created_at", "2026-08-15T09:30:00Z"
                )
        );
    }
}
