package com.intelsenseai.controller;

import com.intelsenseai.entity.Feedback;
import com.intelsenseai.repository.FeedbackRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final FeedbackRepository feedbackRepository;

    public ReportsController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping(produces = "text/csv")
    public ResponseEntity<String> exportCsv() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null) ? auth.getName() : "anonymous";

        List<Feedback> items = feedbackRepository.findByCreatedBy(username);

        String csv = toCsv(items);

        String filename = "intelsense_history_" + URLEncoder.encode(username, StandardCharsets.UTF_8) + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    private String toCsv(List<Feedback> items) {
        String header = "id,text,source,aiResult,createdBy,createdAt\n";
        String body = items.stream().map(f -> csvEscape(f.getId() + "") + "," + csvEscape(f.getText()) + "," + csvEscape(f.getSource()) + "," + csvEscape(f.getAiResult()) + "," + csvEscape(f.getCreatedBy()) + "," + csvEscape(String.valueOf(f.getCreatedAt()))).collect(Collectors.joining("\n"));
        return header + body;
    }

    private String csvEscape(String s) {
        if (s == null) return "";
        String out = s.replace("\"", "\"\"");
        if (out.contains(",") || out.contains("\n") || out.contains("\r") || out.contains("\"")) {
            return "\"" + out + "\"";
        }
        return out;
    }
}
