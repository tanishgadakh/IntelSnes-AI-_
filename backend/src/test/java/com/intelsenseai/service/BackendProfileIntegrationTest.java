package com.intelsenseai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intelsenseai.dto.ProfileUpdateRequest;
import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {"jwt.secret=test-jwt-secret-which-is-long-enough-1234567890","jwt.expiration-ms=3600000"})
@AutoConfigureMockMvc
public class BackendProfileIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        user = new User();
        user.setUsername("int_test_user");
        user.setEmail("int@test.com");
        user.setPassword(passwordEncoder.encode("oldpassword"));
        user.setRole(com.intelsenseai.entity.Role.CUSTOMER);
        user.setStatus(com.intelsenseai.entity.Status.ACTIVE);
        userRepository.save(user);
    }

    @AfterEach
    public void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    public void changePassword_withValidCurrentPassword_updatesPassword() throws Exception {
        String token = jwtService.generateToken(user.getUsername(), "CUSTOMER");

        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setCurrentPassword("oldpassword");
        req.setPassword("newStrongPass123!");

        mockMvc.perform(put("/api/auth/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        User saved = userRepository.findByUsername(user.getUsername()).get();
        assertThat(passwordEncoder.matches("newStrongPass123!", saved.getPassword())).isTrue();
    }
}
