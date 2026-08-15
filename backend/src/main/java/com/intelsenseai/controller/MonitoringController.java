package com.intelsenseai.controller;

import com.intelsenseai.service.MonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        return ResponseEntity.ok(Map.of("data", monitoringService.getAnalyticsSummary()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getRecentAlerts() {
        return ResponseEntity.ok(monitoringService.getRecentAlerts());
    }
}
