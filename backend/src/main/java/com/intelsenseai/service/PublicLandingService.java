package com.intelsenseai.service;

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
import com.intelsenseai.entity.PlatformStatistics;
import com.intelsenseai.entity.Testimonial;
import com.intelsenseai.repository.PlatformStatisticsRepository;
import com.intelsenseai.repository.TestimonialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PublicLandingService {
    private final PlatformStatisticsRepository platformStatisticsRepository;
    private final TestimonialRepository testimonialRepository;

    public PublicLandingService(PlatformStatisticsRepository platformStatisticsRepository,
                               TestimonialRepository testimonialRepository) {
        this.platformStatisticsRepository = platformStatisticsRepository;
        this.testimonialRepository = testimonialRepository;
    }

    public PlatformStatsResponse getPlatformStats() {
        Optional<PlatformStatistics> stats = platformStatisticsRepository.findTopByOrderByIdDesc();
        if (stats.isPresent()) {
            PlatformStatistics entity = stats.get();
            return new PlatformStatsResponse(
                    entity.getPredictions(),
                    entity.getAccuracy(),
                    entity.getOrganizations(),
                    entity.getUsers()
            );
        }

        return new PlatformStatsResponse(2500000L, 99.2, 250, 50000);
    }

    public List<TestimonialResponse> getTestimonials() {
        List<Testimonial> testimonials = testimonialRepository.findByActiveTrueOrderByIdAsc();
        if (!testimonials.isEmpty()) {
            return testimonials.stream()
                    .map(t -> new TestimonialResponse(t.getQuote(), t.getAuthor(), t.getCompany(), t.getRating()))
                    .toList();
        }

        return List.of(
                new TestimonialResponse("Reduced analysis time by 80%.", "Alex Morgan", "Northstar Retail", 5),
                new TestimonialResponse("Improved customer satisfaction across every region.", "Priya Shah", "BluePeak Health", 5),
                new TestimonialResponse("Easy to use AI platform for our analytics team.", "Marcus Lee", "Crestline Finance", 5)
        );
    }

    public VersionResponse getVersion() {
        return new VersionResponse("1.0", "1.0", "1.0");
    }

    public FeatureOverviewResponse getFeatureOverview() {
        return new FeatureOverviewResponse(
                99.2,
                120,
                List.of(
                        "Sentiment Analysis",
                        "Emotion Detection",
                        "Aspect Analysis",
                        "Keyword Extraction",
                        "AI Recommendations",
                        "AI Summary"
                )
        );
    }

    public PlatformMetricsResponse getPlatformMetrics() {
        Optional<PlatformStatistics> stats = platformStatisticsRepository.findTopByOrderByIdDesc();
        if (stats.isPresent()) {
            PlatformStatistics entity = stats.get();
            return new PlatformMetricsResponse(
                    entity.getPredictions(),
                    entity.getOrganizations(),
                    entity.getUsers()
            );
        }

        return new PlatformMetricsResponse(2500000L, 250, 50000);
    }

    public AiInfoResponse getAiInfo() {
        return new AiInfoResponse(
                "RoBERTa",
                "1.0",
                List.of("English", "Spanish", "French", "German", "Arabic"),
                99.2
        );
    }

    public PerformanceResponse getPerformance() {
        return new PerformanceResponse(120, 99.9, 2500000L);
    }

    public DashboardPreviewResponse getDashboardPreview() {
        return new DashboardPreviewResponse(
                Map.of(
                        "admin", Map.of(
                                "totalUsers", "1,250",
                                "pendingAnalystRequests", "18",
                                "aiPredictionsToday", "12,458",
                                "platformHealth", "99.9%"
                        ),
                        "analyst", Map.of(
                                "sentimentPositive", "72%",
                                "sentimentNeutral", "18%",
                                "sentimentNegative", "10%",
                                "recentAction", "Analyze Text"
                        ),
                        "customer", Map.of(
                                "totalFeedback", "15",
                                "summaryLabel", "Positive",
                                "sentimentScore", "80%",
                                "latestResult", "Positive",
                                "confidence", "98%"
                        )
                ),
                Map.of(
                        "score", "99.9%",
                        "latency", "183ms",
                        "uptime", "24/7",
                        "activeWorkflows", "48 active"
                ),
                List.of(
                        "New Analyst Registered",
                        "Model Updated",
                        "Database Backup Completed",
                        "Role Access Updated"
                )
        );
    }

    public List<DemoInsightResponse> getDemoInsights() {
        return List.of(
                new DemoInsightResponse(
                        "AI Insight",
                        "Delivery satisfaction dropped by 8% during the last week.",
                        "Improve logistics.",
                        "-8%"
                ),
                new DemoInsightResponse(
                        "AI Insight",
                        "Customer support received 92% positive feedback.",
                        "Maintain current service quality.",
                        "+92%"
                )
        );
    }

    public EnterpriseMetricsResponse getEnterpriseMetrics() {
        return new EnterpriseMetricsResponse(250, 50000, 99.2, 99.9);
    }

    public List<IndustryResponse> getIndustries() {
        return List.of(
                new IndustryResponse("Retail", "Customer reviews, ratings, delivery feedback, and shopping experience insights.", new String[]{"Customer Reviews", "Product Ratings", "Delivery Feedback", "Shopping Experience"}),
                new IndustryResponse("Healthcare", "Patient sentiment, care quality, support experience, and operational improvements.", new String[]{"Patient Feedback", "Care Quality", "Support Experience", "Operations"}),
                new IndustryResponse("Education", "Learner sentiment, service quality, experience monitoring, and satisfaction trends.", new String[]{"Student Experience", "Course Feedback", "Support Quality", "Retention"}),
                new IndustryResponse("Finance", "Trust, service quality, onboarding friction, and customer sentiment benchmarks.", new String[]{"Service Quality", "Trust Signals", "Client Feedback", "Risk Monitoring"}),
                new IndustryResponse("Insurance", "Claims sentiment, service interactions, satisfaction monitoring, and churn prevention.", new String[]{"Claims Experience", "Policy Feedback", "Support Quality", "Risk Forecasting"}),
                new IndustryResponse("Manufacturing", "Field service quality, product reliability, and customer support sentiment analysis.", new String[]{"Product Quality", "Field Support", "Operations", "Reliability"}),
                new IndustryResponse("Hospitality", "Guest satisfaction, service sentiment, delivery quality, and operational insights.", new String[]{"Guest Reviews", "Service Quality", "Amenities", "Retention"}),
                new IndustryResponse("Government", "Service quality, satisfaction monitoring, and public support sentiment intelligence.", new String[]{"Citizen Experience", "Service Delivery", "Public Sentiment", "Trust"}),
                new IndustryResponse("E-Commerce", "Checkout sentiment, support quality, product issues, and buyer experience insights.", new String[]{"Checkout", "Shipping", "Support", "Product Quality"}),
                new IndustryResponse("Telecommunications", "Customer churn signals, support sentiment, service quality, and retention analytics.", new String[]{"Service Quality", "Churn Risks", "Support", "Network Experience"})
        );
    }

    public List<DeploymentOptionResponse> getDeploymentOptions() {
        return List.of(
                new DeploymentOptionResponse("Local Deployment", "Windows, Linux, Mac", new String[]{"Desktop friendly", "Controlled demo setup", "Private testing"}),
                new DeploymentOptionResponse("Docker Deployment", "Docker Compose, Containers, Microservices", new String[]{"Scalable containers", "Easy orchestration", "Fast deployment"}),
                new DeploymentOptionResponse("Cloud Deployment", "AWS, Azure, Google Cloud", new String[]{"Enterprise-grade scale", "Global availability", "Production ready"})
        );
    }

    public Map<String, Object> getDocumentationMeta() {
        return Map.of(
                "title", "IntelSense AI Documentation",
                "description", "Everything you need to learn, develop, deploy, and manage IntelSense AI.",
                "version", "v3.0"
        );
    }

    public List<Map<String, Object>> getApiReference() {
        return List.of(
                Map.of(
                        "name", "Authentication",
                        "method", "POST",
                        "endpoint", "/api/auth/login",
                        "description", "Authenticate users and receive an access token.",
                        "headers", List.of("Content-Type: application/json"),
                        "body", "{\"email\":\"demo@intelsense.ai\",\"password\":\"demo123\"}",
                        "response", "{\"token\":\"...\",\"role\":\"ANALYST\"}"
                ),
                Map.of(
                        "name", "Prediction",
                        "method", "POST",
                        "endpoint", "/api/predict",
                        "description", "Submit feedback text for sentiment and AI analysis.",
                        "headers", List.of("Authorization: Bearer <token>"),
                        "body", "{\"text\":\"Great product but delivery was slow\"}",
                        "response", "{\"sentiment\":\"neutral\",\"confidence\":0.96}"
                ),
                Map.of(
                        "name", "Reports",
                        "method", "GET",
                        "endpoint", "/api/reports",
                        "description", "Retrieve summary reports and analytics snapshots.",
                        "headers", List.of("Authorization: Bearer <token>"),
                        "body", "None",
                        "response", "[{\"id\":1,\"summary\":\"Positive trend\"}]"
                )
        );
    }

    public Map<String, Object> getVersionInfo() {
        return Map.of(
                "frontend", "1.0.0",
                "backend", "2.1.0",
                "aiService", "3.0.0"
        );
    }

    public Map<String, Object> getSolutionsData() {
        return Map.of(
                "industries", List.of(
                        Map.of(
                                "name", "Retail",
                                "challenge", "Product reviews, returns, and delivery experience need faster interpretation.",
                                "workflow", List.of("Analyze reviews", "Find complaint themes", "Track product sentiment", "Improve loyalty"),
                                "metrics", List.of("32% fewer complaints", "8x faster insight"),
                                "highlight", "Retail teams use IntelSense AI to identify product issues and improve customer experience."
                        ),
                        Map.of(
                                "name", "Healthcare",
                                "challenge", "Patient feedback and service experience need a dependable understanding of quality signals.",
                                "workflow", List.of("Monitor patient feedback", "Uncover service gaps", "Improve care satisfaction", "Shape operations"),
                                "metrics", List.of("25% better perception", "Real-time patient insights"),
                                "highlight", "Hospitals use the platform to turn feedback into service improvements and care strategy."
                        )
                ),
                "challenges", List.of(
                        Map.of(
                                "icon", "😓",
                                "title", "Manual Feedback Analysis",
                                "description", "Thousands of customer reviews cannot be processed by hand without missing important signals."
                        ),
                        Map.of(
                                "icon", "📉",
                                "title", "Poor Customer Satisfaction",
                                "description", "Businesses struggle to pinpoint the causes behind churn, complaints, and declining loyalty."
                        )
                )
        );
    }

    public Map<String, Object> getBusinessMetrics() {
        return Map.of(
                "manualWorkReduction", 80,
                "decisionSpeed", 5,
                "satisfactionLift", 40,
                "reportGeneration", 60
        );
    }
}
