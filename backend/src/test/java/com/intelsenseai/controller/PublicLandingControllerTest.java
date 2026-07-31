package com.intelsenseai.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PublicLandingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldExposePublicPlatformStats() throws Exception {
        mockMvc.perform(get("/api/public/platform-stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.predictions").exists())
                .andExpect(jsonPath("$.accuracy").exists())
                .andExpect(jsonPath("$.organizations").exists())
                .andExpect(jsonPath("$.users").exists());
    }

    @Test
    void shouldExposePublicTestimonials() throws Exception {
        mockMvc.perform(get("/api/public/testimonials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].quote").exists());
    }

    @Test
    void shouldExposePublicVersion() throws Exception {
        mockMvc.perform(get("/api/public/version"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.frontend").value("1.0"))
                .andExpect(jsonPath("$.backend").value("1.0"))
                .andExpect(jsonPath("$.ai").value("1.0"));
    }

    @Test
    void shouldExposePublicFeatureOverview() throws Exception {
        mockMvc.perform(get("/api/public/features"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.aiAccuracy").exists())
                .andExpect(jsonPath("$.predictionSpeedMs").exists())
                .andExpect(jsonPath("$.supportedFeatures").isArray());
    }

    @Test
    void shouldExposePublicPlatformMetrics() throws Exception {
        mockMvc.perform(get("/api/public/platform-metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPredictions").exists())
                .andExpect(jsonPath("$.organizations").exists())
                .andExpect(jsonPath("$.activeUsers").exists());
    }

    @Test
    void shouldExposePublicAiInfo() throws Exception {
        mockMvc.perform(get("/api/public/ai-info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentModel").exists())
                .andExpect(jsonPath("$.version").exists())
                .andExpect(jsonPath("$.supportedLanguages").exists())
                .andExpect(jsonPath("$.accuracy").exists());
    }

    @Test
    void shouldExposePublicPerformance() throws Exception {
        mockMvc.perform(get("/api/public/performance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.predictionSpeedMs").exists())
                .andExpect(jsonPath("$.availability").exists())
                .andExpect(jsonPath("$.totalPredictions").exists());
    }

    @Test
    void shouldExposePublicDashboardPreview() throws Exception {
        mockMvc.perform(get("/api/public/dashboard-preview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roleStats").exists())
                .andExpect(jsonPath("$.platformHealth").exists())
                .andExpect(jsonPath("$.recentActivities").isArray());
    }

    @Test
    void shouldExposePublicDemoInsights() throws Exception {
        mockMvc.perform(get("/api/public/demo-insights"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].title").exists())
                .andExpect(jsonPath("$.[0].recommendation").exists());
    }

    @Test
    void shouldExposePublicEnterpriseMetrics() throws Exception {
        mockMvc.perform(get("/api/public/enterprise-metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.organizations").exists())
                .andExpect(jsonPath("$.activeUsers").exists())
                .andExpect(jsonPath("$.aiAccuracy").exists())
                .andExpect(jsonPath("$.uptime").exists());
    }

    @Test
    void shouldExposePublicIndustries() throws Exception {
        mockMvc.perform(get("/api/public/industries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].name").exists())
                .andExpect(jsonPath("$.[0].description").exists());
    }

    @Test
    void shouldExposePublicDeploymentOptions() throws Exception {
        mockMvc.perform(get("/api/public/deployment-options"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].name").exists())
                .andExpect(jsonPath("$.[0].details").exists());
    }
}
