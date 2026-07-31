package com.intelsenseai.controller;

import com.intelsenseai.dto.FeedbackRequest;
import com.intelsenseai.entity.Feedback;
import com.intelsenseai.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submit(@RequestBody FeedbackRequest request) {
        Feedback saved = feedbackService.submitFeedback(request.getText(), request.getSource());
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<java.util.List<Feedback>> listForCurrentUser() {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null) ? auth.getName() : null;
            java.util.List<Feedback> items = feedbackService.findByUser(username);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Collections.emptyList());
        }
    }
}
