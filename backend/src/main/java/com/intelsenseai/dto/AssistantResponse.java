package com.intelsenseai.dto;

import java.util.List;
import java.util.Map;

public class AssistantResponse {
    private String response;
    private String summary;
    private String sentiment;
    private Map<String, Object> emotions;
    private List<Map<String, Object>> aspects;
    private List<String> keywords;
    private List<String> topics;
    private List<String> recommendations;
    private List<String> actionableRecommendations;
    private Map<String, Object> explainability;
    private String language;
    private double confidence;

    public AssistantResponse() {}

    public AssistantResponse(String response) {
        this.response = response;
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public Map<String, Object> getEmotions() { return emotions; }
    public void setEmotions(Map<String, Object> emotions) { this.emotions = emotions; }
    public List<Map<String, Object>> getAspects() { return aspects; }
    public void setAspects(List<Map<String, Object>> aspects) { this.aspects = aspects; }
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public List<String> getActionableRecommendations() { return actionableRecommendations; }
    public void setActionableRecommendations(List<String> actionableRecommendations) { this.actionableRecommendations = actionableRecommendations; }
    public Map<String, Object> getExplainability() { return explainability; }
    public void setExplainability(Map<String, Object> explainability) { this.explainability = explainability; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
}
