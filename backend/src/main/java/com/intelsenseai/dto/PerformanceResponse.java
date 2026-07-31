package com.intelsenseai.dto;

public record PerformanceResponse(
        int predictionSpeedMs,
        double availability,
        long totalPredictions
) {
}
