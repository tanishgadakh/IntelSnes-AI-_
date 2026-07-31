package com.intelsenseai.dto;

import java.util.List;
import java.util.Map;

public record DashboardPreviewResponse(Map<String, Object> roleStats, Map<String, Object> platformHealth, List<String> recentActivities) {
}
