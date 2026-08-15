package com.intelsenseai.controller;

import com.intelsenseai.service.MonitoringService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MonitoringController.class)
@AutoConfigureMockMvc(addFilters = false)
class MonitoringControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MonitoringService monitoringService;

    @Test
    void shouldReturnAnalyticsSummary() throws Exception {
        when(monitoringService.getAnalyticsSummary()).thenReturn(Map.of(
                "total_predictions", 1200,
                "sentiment_breakdown", Map.of("positive", 700, "neutral", 300, "negative", 200),
                "topics", List.of("Delivery", "Support", "Pricing")
        ));

        mockMvc.perform(get("/api/analytics")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total_predictions").value(1200))
                .andExpect(jsonPath("$.data.sentiment_breakdown.positive").value(700));
    }

    @Test
    void shouldReturnRecentAlerts() throws Exception {
        when(monitoringService.getRecentAlerts()).thenReturn(List.of(
                Map.of("id", 1, "level", "warning", "message", "Low confidence alert")
        ));

        mockMvc.perform(get("/api/alerts")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].level").value("warning"))
                .andExpect(jsonPath("$[0].message").value("Low confidence alert"));
    }
}
