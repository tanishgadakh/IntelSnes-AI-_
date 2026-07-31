package com.intelsenseai.service;

import com.intelsenseai.repository.PlatformStatisticsRepository;
import com.intelsenseai.repository.TestimonialRepository;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class PublicLandingServiceTest {

    @Test
    void shouldProvideDocumentationMetadataAndApiReference() {
        PublicLandingService service = new PublicLandingService(mock(PlatformStatisticsRepository.class), mock(TestimonialRepository.class));

        Map<String, Object> docs = service.getDocumentationMeta();
        assertEquals("IntelSense AI Documentation", docs.get("title"));
        assertTrue(((String) docs.get("description")).contains("IntelSense AI"));

        assertFalse(service.getApiReference().isEmpty());
    }

    @Test
    void shouldProvideSolutionsDataAndBusinessMetrics() {
        PublicLandingService service = new PublicLandingService(mock(PlatformStatisticsRepository.class), mock(TestimonialRepository.class));

        Map<String, Object> solutions = service.getSolutionsData();
        assertFalse(((java.util.List<?>) solutions.get("industries")).isEmpty());
        assertFalse(((java.util.List<?>) solutions.get("challenges")).isEmpty());

        Map<String, Object> metrics = service.getBusinessMetrics();
        assertEquals(80, metrics.get("manualWorkReduction"));
        assertEquals(5, metrics.get("decisionSpeed"));
    }
}
