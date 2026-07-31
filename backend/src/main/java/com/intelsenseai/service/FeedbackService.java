package com.intelsenseai.service;

import com.intelsenseai.client.AiClient;
import com.intelsenseai.entity.Feedback;
import com.intelsenseai.repository.FeedbackRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final AiClient aiClient;

    public FeedbackService(FeedbackRepository feedbackRepository, AiClient aiClient) {
        this.feedbackRepository = feedbackRepository;
        this.aiClient = aiClient;
    }

    public Feedback submitFeedback(String text, String source) {
        Map<String, Object> aiResponse = aiClient.predict(text, source);
        Feedback feedback = new Feedback();
        feedback.setText(text);
        feedback.setSource(source);
        feedback.setAiResult(aiResponse.toString());
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                feedback.setCreatedBy(auth.getName());
            }
        } catch (Exception ignored) {}
        return feedbackRepository.save(feedback);
    }

    public java.util.List<Feedback> findByUser(String username) {
        if (username == null) return java.util.Collections.emptyList();
        return feedbackRepository.findByCreatedBy(username);
    }
}
