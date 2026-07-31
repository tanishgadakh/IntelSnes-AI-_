package com.intelsenseai.dto;

import java.util.List;

public record FeatureOverviewResponse(
        double aiAccuracy,
        int predictionSpeedMs,
        List<String> supportedFeatures
) {
}
