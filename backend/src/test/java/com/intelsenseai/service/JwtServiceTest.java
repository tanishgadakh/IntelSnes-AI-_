package com.intelsenseai.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService("test-secret-intelsense-ai-jwt-signing-key-2026", 60000L);

        String token = jwtService.generateToken("demo-user");

        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));
        assertEquals("demo-user", jwtService.extractUsername(token));
        assertEquals("demo-user", jwtService.getSubject(token));
        assertTrue(jwtService.getClaims(token).containsKey("sub"));
    }

    @Test
    void shouldSignTokensWithHs256Algorithm() {
        String secret = "test-secret-intelsense-ai-jwt-signing-key-2026";
        JwtService jwtService = new JwtService(secret, 60000L);

        String token = jwtService.generateToken("demo-user");

        var claims = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token);

        assertEquals("HS256", claims.getHeader().getAlgorithm());
    }

    @Test
    void shouldRejectInvalidToken() {
        JwtService jwtService = new JwtService("test-secret-intelsense-ai-jwt-signing-key-2026", 60000L);
        assertFalse(jwtService.validateToken("not-a-real-token"));
    }
}
