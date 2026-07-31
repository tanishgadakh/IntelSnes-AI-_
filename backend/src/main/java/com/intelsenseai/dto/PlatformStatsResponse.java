package com.intelsenseai.dto;

public record PlatformStatsResponse(long predictions, double accuracy, int organizations, int users) {
}
