package com.intelsenseai.service;

import com.intelsenseai.client.AiClient;
import com.intelsenseai.dto.AssistantResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AssistantService {
    private final AiClient aiClient;

    public AssistantService(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    @SuppressWarnings("unchecked")
    public AssistantResponse ask(String prompt) {
        Map<String, Object> result = aiClient.predict(prompt, "assistant");
        if (result == null) {
            return new AssistantResponse("Unable to generate an assistant response at this time.");
        }

        Object resultObj = result.get("result");
        if (!(resultObj instanceof Map)) {
            return new AssistantResponse("I’m sorry, I could not generate an answer from the AI service.");
        }

        Map<String, Object> payload = (Map<String, Object>) resultObj;
        String summary = payload.getOrDefault("summary", "").toString().trim();
        Object sentimentObj = payload.get("sentiment");
        Object emotionsObj = payload.get("emotions");
        Object aspectsObj = payload.get("aspects");
        Object keywordsObj = payload.get("keywords");
        Object topicsObj = payload.get("topics");
        Object recommendationsObj = payload.get("recommendations");
        Object explainabilityObj = payload.get("explainability");

        StringBuilder response = new StringBuilder();
        if (!summary.isBlank()) {
            response.append(summary);
            if (!summary.endsWith(".")) {
                response.append('.');
            }
        }

        String sentimentLabel = null;
        if (sentimentObj instanceof Map) {
            Map<String, Object> sentiment = (Map<String, Object>) sentimentObj;
            String label = sentiment.getOrDefault("label", "unknown").toString();
            Object scoreObj = sentiment.get("score");
            String score = scoreObj != null ? String.format("%.2f", Double.parseDouble(scoreObj.toString())) : "n/a";
            sentimentLabel = label + " (score " + score + ")";
            appendSentence(response, "Sentiment is " + sentimentLabel);
        }

        List<String> emotionsSummary = new ArrayList<>();
        if (emotionsObj instanceof Map) {
            Map<String, Object> emotions = (Map<String, Object>) emotionsObj;
            emotions.forEach((key, value) -> {
                if (value != null) {
                    emotionsSummary.add(key + " " + String.format("%.2f", Double.parseDouble(value.toString())));
                }
            });
            if (!emotionsSummary.isEmpty()) {
                appendSentence(response, "Emotion scores: " + String.join(", ", emotionsSummary));
            }
        }

        List<Map<String, Object>> aspects = Collections.emptyList();
        if (aspectsObj instanceof List) {
            aspects = (List<Map<String, Object>>) aspectsObj;
            if (!aspects.isEmpty()) {
                StringBuilder aspectSummary = new StringBuilder();
                for (Map<String, Object> aspect : aspects) {
                    String aspectName = aspect.getOrDefault("aspect", "general").toString();
                    String aspectSentiment = aspect.getOrDefault("sentiment", "neutral").toString();
                    aspectSummary.append(aspectName).append(" (").append(aspectSentiment).append("), ");
                }
                if (aspectSummary.length() > 2) {
                    aspectSummary.setLength(aspectSummary.length() - 2);
                }
                appendSentence(response, "Aspect analysis: " + aspectSummary.toString());
            }
        }

        List<String> keywords = Collections.emptyList();
        if (keywordsObj instanceof List) {
            keywords = (List<String>) keywordsObj;
            if (!keywords.isEmpty()) {
                appendSentence(response, "Key themes: " + String.join(", ", keywords.subList(0, Math.min(5, keywords.size()))));
            }
        }

        List<String> topics = Collections.emptyList();
        if (topicsObj instanceof List) {
            topics = (List<String>) topicsObj;
            if (!topics.isEmpty()) {
                appendSentence(response, "Topics detected: " + String.join(", ", topics.subList(0, Math.min(5, topics.size()))));
            }
        }

        List<String> recommendations = Collections.emptyList();
        if (recommendationsObj instanceof List) {
            recommendations = (List<String>) recommendationsObj;
            if (!recommendations.isEmpty()) {
                appendSentence(response, "Recommended actions: " + String.join("; ", recommendations.subList(0, Math.min(5, recommendations.size()))));
            }
        }

        Map<String, Object> explainability = Collections.emptyMap();
        if (explainabilityObj instanceof Map) {
            explainability = (Map<String, Object>) explainabilityObj;
            String explainSummary = explainability.getOrDefault("summary", "").toString();
            if (!explainSummary.isBlank()) {
                appendSentence(response, "Explanation: " + explainSummary);
            }
        }

        String language = "unknown";
        Object languageObj = payload.get("language");
        if (languageObj != null) {
            language = languageObj.toString();
        }

        double confidence = 0.0;
        Object confidenceObj = payload.get("confidence");
        if (confidenceObj != null) {
            try {
                confidence = Double.parseDouble(confidenceObj.toString());
            } catch (NumberFormatException ignored) {
            }
        }

        String responseText = response.toString().trim();
        if (response.length() == 0 || responseText.isBlank()) {
            return new AssistantResponse("I’m sorry, I could not generate an answer from the AI service.");
        }

        AssistantResponse assistantResponse = new AssistantResponse(responseText);
        assistantResponse.setSummary(summary);
        assistantResponse.setSentiment(sentimentLabel);
        assistantResponse.setEmotions(emotionsObj instanceof Map ? (Map<String, Object>) emotionsObj : null);
        assistantResponse.setAspects(aspects);
        assistantResponse.setKeywords(keywords);
        assistantResponse.setTopics(topics);
        assistantResponse.setRecommendations(recommendations);
        assistantResponse.setActionableRecommendations(recommendations);
        assistantResponse.setExplainability(explainability);
        assistantResponse.setLanguage(language);
        assistantResponse.setConfidence(confidence);
        return assistantResponse;
    }

    private void appendSentence(StringBuilder builder, String sentence) {
        if (sentence == null || sentence.isBlank()) {
            return;
        }
        if (builder.length() > 0 && builder.charAt(builder.length() - 1) != '.') {
            builder.append('.');
        }
        builder.append(' ').append(sentence.trim());
        if (!sentence.trim().endsWith(".")) {
            builder.append('.');
        }
    }
}
