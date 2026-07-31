package com.intelsenseai.dto;

public record PlatformMetricsResponse(
        long totalPredictions,
        int organizations,
        int activeUsers
) {
}
