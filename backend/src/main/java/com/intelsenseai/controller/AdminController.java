package com.intelsenseai.controller;

import com.intelsenseai.dto.RejectionRequest;
import com.intelsenseai.dto.UserResponse;
import com.intelsenseai.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<UserResponse>> getPendingRequests() {
        return ResponseEntity.ok(authService.listPendingRequests());
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<UserResponse> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.approveUser(id));
    }

    @PostMapping("/users/{id}/reject")
    public ResponseEntity<UserResponse> rejectUser(@PathVariable Long id, @RequestBody RejectionRequest rejectionRequest) {
        return ResponseEntity.ok(authService.rejectUser(id, rejectionRequest));
    }
}
