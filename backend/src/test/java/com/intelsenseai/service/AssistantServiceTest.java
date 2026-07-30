package com.intelsenseai.service;

import com.intelsenseai.client.AiClient;
import com.intelsenseai.dto.AssistantResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class AssistantServiceTest {

    @Test
    void shouldBuildStructuredAssistantResponse() {
        var jwtService = new JwtService("test-secret-intelsense-ai-jwt-signing-key-2026", 60000L);
        AiClient aiClient = new AiClient("http://unused", jwtService) {
            @Override
            public Map<String, Object> predict(String text, String source) {
                return Map.of(
                    "result", Map.of(
                        "summary", "This is a concise summary of the report.",
                        "sentiment", Map.of("label", "positive", "score", 0.95),
                        "emotions", Map.of("joy", 0.86, "trust", 0.74),
                        "aspects", List.of(
                            Map.of("aspect", "support", "sentiment", "positive"),
                            Map.of("aspect", "delivery", "sentiment", "neutral")
                        ),
                        "keywords", List.of("customer satisfaction", "response time", "email support"),
                        "topics", List.of("support quality", "service speed"),
                        "recommendations", List.of("Increase automation for common tickets", "Follow up on delayed responses"),
                        "explainability", Map.of("summary", "The sentiment was derived from repeated praise of support performance."),
                "language", "en",
                "confidence", 0.92
                    )
                );
            }
        };

        AssistantService assistantService = new AssistantService(aiClient);
        AssistantResponse response = assistantService.ask("Please analyze recent support feedback.");

        assertNotNull(response);
        assertEquals("This is a concise summary of the report.", response.getSummary());
        assertEquals("positive (score 0.95)", response.getSentiment());
        assertEquals(List.of("customer satisfaction", "response time", "email support"), response.getKeywords());
        assertEquals(List.of("support quality", "service speed"), response.getTopics());
        assertEquals(List.of("Increase automation for common tickets", "Follow up on delayed responses"), response.getRecommendations());
        assertEquals(List.of("Increase automation for common tickets", "Follow up on delayed responses"), response.getActionableRecommendations());
        assertEquals("The sentiment was derived from repeated praise of support performance.", response.getExplainability().get("summary"));
        assertEquals(2, response.getAspects().size());
        assertEquals("support", response.getAspects().get(0).get("aspect"));
        assertEquals("en", response.getLanguage());
        assertEquals(0.92, response.getConfidence(), 0.001);
    }
}
