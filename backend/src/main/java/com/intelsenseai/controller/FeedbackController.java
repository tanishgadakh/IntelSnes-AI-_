package com.intelsenseai.controller;

import com.intelsenseai.dto.FeedbackRequest;
import com.intelsenseai.entity.Feedback;
import com.intelsenseai.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<?> submit(@Valid @RequestBody FeedbackRequest request) {
        Feedback saved = feedbackService.submitFeedback(request.getText(), request.getSource());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "text", saved.getText(),
                "source", saved.getSource(),
                "aiResult", saved.getAiResult(),
                "createdBy", saved.getCreatedBy(),
                "createdAt", saved.getCreatedAt()
        ));
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
