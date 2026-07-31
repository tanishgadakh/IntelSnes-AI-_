package com.intelsenseai.dto;

import jakarta.validation.constraints.NotBlank;

public class FeedbackRequest {
    @NotBlank(message = "Feedback text is required")
    private String text;
    private String source;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
