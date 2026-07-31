package com.intelsenseai.service;

import com.intelsenseai.dto.RegistrationRequest;
import com.intelsenseai.dto.UserResponse;
import com.intelsenseai.entity.Role;
import com.intelsenseai.entity.Status;
import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
import com.intelsenseai.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_assignsActiveStatusForCustomer() {
        RegistrationRequest request = new RegistrationRequest();
        request.setUsername("customer-user");
        request.setEmail("customer@tenant.com");
        request.setPassword("secret123");
        request.setRole("CUSTOMER");
        request.setFullName("Jane Doe");
        request.setPhone("+1 555 123 4567");
        request.setCompany("Acme Corp");

        when(userRepository.findByUsername("customer-user")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("customer@tenant.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = authService.register(request);

        assertEquals("CUSTOMER", response.getRole());
        assertEquals(Status.ACTIVE, response.getStatus());
        verify(userRepository).save(any(User.class));
    }
}
