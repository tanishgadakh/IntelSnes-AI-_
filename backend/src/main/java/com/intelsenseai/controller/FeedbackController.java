package com.intelsenseai.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intelsenseai.dto.FeedbackRequest;
import com.intelsenseai.entity.Feedback;
import com.intelsenseai.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<?> submit(@Valid @RequestBody FeedbackRequest request) {
        Feedback saved = feedbackService.submitFeedback(request.getText(), request.getSource());
        Map<String, Object> aiResult = Map.of();
        try {
            String aiResultText = saved.getAiResult() != null ? saved.getAiResult() : "{}";
            aiResult = OBJECT_MAPPER.readValue(aiResultText, Map.class);
        } catch (JsonProcessingException ignore) {
        }

        Map<String, Object> result = Map.of();
        if (aiResult.get("result") instanceof Map) {
            result = (Map<String, Object>) aiResult.get("result");
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("id", saved.getId());
        responseBody.put("text", saved.getText());
        responseBody.put("source", saved.getSource());
        responseBody.put("aiResult", saved.getAiResult());
        responseBody.put("createdBy", saved.getCreatedBy());
        responseBody.put("createdAt", saved.getCreatedAt());
        responseBody.put("language", result.getOrDefault("language", null));
        responseBody.put("confidence", result.getOrDefault("confidence", null));
        responseBody.put("sentiment", result.getOrDefault("sentiment", Map.of()));
        responseBody.put("result", result);
        responseBody.put("emotions", result.getOrDefault("emotions", Map.of()));
        responseBody.put("aspects", result.getOrDefault("aspects", List.of()));
        responseBody.put("keywords", result.getOrDefault("keywords", List.of()));
        responseBody.put("topics", result.getOrDefault("topics", List.of()));
        responseBody.put("summary", result.getOrDefault("summary", null));
        responseBody.put("recommendations", result.getOrDefault("recommendations", List.of()));
        responseBody.put("explainability", result.getOrDefault("explainability", Map.of()));

        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listForCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null) ? auth.getName() : null;
            List<Feedback> items = feedbackService.findByUser(username);
            List<Map<String, Object>> payload = items.stream().map(item -> Map.<String, Object>of(
                    "id", item.getId(),
                    "text", item.getText(),
                    "source", item.getSource(),
                    "aiResult", item.getAiResult(),
                    "createdBy", item.getCreatedBy(),
                    "createdAt", item.getCreatedAt()
            )).toList();
            return ResponseEntity.ok(payload);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }
}
