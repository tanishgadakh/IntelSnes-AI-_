package com.intelsenseai.dto;

import java.util.List;

public record AiInfoResponse(
        String currentModel,
        String version,
        List<String> supportedLanguages,
        double accuracy
) {
}
