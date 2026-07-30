package com.intelsenseai.controller;

import com.intelsenseai.dto.AssistantRequest;
import com.intelsenseai.dto.AssistantResponse;
import com.intelsenseai.service.AssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {
    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping
    public ResponseEntity<AssistantResponse> ask(@RequestBody AssistantRequest request) {
        AssistantResponse response = assistantService.ask(request.getPrompt());
        return ResponseEntity.ok(response);
    }
}
