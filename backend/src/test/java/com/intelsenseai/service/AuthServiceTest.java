package com.intelsenseai.service;

import com.intelsenseai.dto.AuthRequest;
import com.intelsenseai.entity.Role;
import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
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

    @InjectMocks
    private AuthService authService;

    @Test
    void register_assignsAnalystRoleForNewUser() {
        AuthRequest request = new AuthRequest();
        request.setUsername("analyst-user");
        request.setPassword("secret123");

        when(userRepository.findByUsername("analyst-user")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = authService.register(request);

        assertEquals(Role.ANALYST, user.getRole());
        verify(userRepository).save(any(User.class));
    }
}
