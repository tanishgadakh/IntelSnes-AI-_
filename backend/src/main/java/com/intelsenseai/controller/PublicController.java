package com.intelsenseai.controller;

import com.intelsenseai.dto.AiInfoResponse;
import com.intelsenseai.dto.DashboardPreviewResponse;
import com.intelsenseai.dto.DeploymentOptionResponse;
import com.intelsenseai.dto.DemoInsightResponse;
import com.intelsenseai.dto.EnterpriseMetricsResponse;
import com.intelsenseai.dto.FeatureOverviewResponse;
import com.intelsenseai.dto.IndustryResponse;
import com.intelsenseai.dto.PerformanceResponse;
import com.intelsenseai.dto.PlatformMetricsResponse;
import com.intelsenseai.dto.PlatformStatsResponse;
import com.intelsenseai.dto.TestimonialResponse;
import com.intelsenseai.dto.VersionResponse;
import com.intelsenseai.service.PublicLandingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final PublicLandingService publicLandingService;

    public PublicController(PublicLandingService publicLandingService) {
        this.publicLandingService = publicLandingService;
    }

    @GetMapping("/platform-stats")
    public ResponseEntity<PlatformStatsResponse> getPlatformStats() {
        return ResponseEntity.ok(publicLandingService.getPlatformStats());
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialResponse>> getTestimonials() {
        return ResponseEntity.ok(publicLandingService.getTestimonials());
    }

    @GetMapping("/version")
    public ResponseEntity<VersionResponse> getVersion() {
        return ResponseEntity.ok(publicLandingService.getVersion());
    }

    @GetMapping("/features")
    public ResponseEntity<FeatureOverviewResponse> getFeatures() {
        return ResponseEntity.ok(publicLandingService.getFeatureOverview());
    }

    @GetMapping("/platform-metrics")
    public ResponseEntity<PlatformMetricsResponse> getPlatformMetrics() {
        return ResponseEntity.ok(publicLandingService.getPlatformMetrics());
    }

    @GetMapping("/ai-info")
    public ResponseEntity<AiInfoResponse> getAiInfo() {
        return ResponseEntity.ok(publicLandingService.getAiInfo());
    }

    @GetMapping("/performance")
    public ResponseEntity<PerformanceResponse> getPerformance() {
        return ResponseEntity.ok(publicLandingService.getPerformance());
    }

    @GetMapping("/dashboard-preview")
    public ResponseEntity<DashboardPreviewResponse> getDashboardPreview() {
        return ResponseEntity.ok(publicLandingService.getDashboardPreview());
    }

    @GetMapping("/demo-insights")
    public ResponseEntity<List<DemoInsightResponse>> getDemoInsights() {
        return ResponseEntity.ok(publicLandingService.getDemoInsights());
    }

    @GetMapping("/enterprise-metrics")
    public ResponseEntity<EnterpriseMetricsResponse> getEnterpriseMetrics() {
        return ResponseEntity.ok(publicLandingService.getEnterpriseMetrics());
    }

    @GetMapping("/industries")
    public ResponseEntity<List<IndustryResponse>> getIndustries() {
        return ResponseEntity.ok(publicLandingService.getIndustries());
    }

    @GetMapping("/deployment-options")
    public ResponseEntity<List<DeploymentOptionResponse>> getDeploymentOptions() {
        return ResponseEntity.ok(publicLandingService.getDeploymentOptions());
    }

    @GetMapping("/docs")
    public ResponseEntity<Map<String, Object>> getDocsMeta() {
        return ResponseEntity.ok(publicLandingService.getDocumentationMeta());
    }

    @GetMapping("/api-reference")
    public ResponseEntity<List<Map<String, Object>>> getApiReference() {
        return ResponseEntity.ok(publicLandingService.getApiReference());
    }

    @GetMapping("/version-info")
    public ResponseEntity<Map<String, Object>> getVersionInfo() {
        return ResponseEntity.ok(publicLandingService.getVersionInfo());
    }

    @GetMapping("/solutions")
    public ResponseEntity<Map<String, Object>> getSolutionsData() {
        return ResponseEntity.ok(publicLandingService.getSolutionsData());
    }

    @GetMapping("/business-metrics")
    public ResponseEntity<Map<String, Object>> getBusinessMetrics() {
        return ResponseEntity.ok(publicLandingService.getBusinessMetrics());
    }
}
