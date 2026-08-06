package com.intelsenseai.service;

import com.intelsenseai.dto.ProfileUpdateRequest;
import com.intelsenseai.entity.Role;
import com.intelsenseai.entity.Status;
import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceUnitTest {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private NotificationService notificationService;
    private AuthService authService;

    @BeforeEach
    public void setup() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        notificationService = mock(NotificationService.class);
        authService = new AuthService(userRepository, passwordEncoder, jwtService, notificationService);
    }

    @Test
    public void updateProfile_requiresCurrentPasswordWhenChanging() {
        String username = "alice";
        User user = new User();
        user.setUsername(username);
        user.setPassword("encoded-old");
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setPassword("newpass");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.updateProfile(username, req));
        assertTrue(ex.getMessage().toLowerCase().contains("current password is required"));
    }

    @Test
    public void updateProfile_rejectsWhenCurrentPasswordIncorrect() {
        String username = "bob";
        User user = new User();
        user.setUsername(username);
        user.setPassword("encoded-old");
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setPassword("newpass");
        req.setCurrentPassword("wrong");

        when(passwordEncoder.matches("wrong", "encoded-old")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.updateProfile(username, req));
        assertTrue(ex.getMessage().toLowerCase().contains("current password is incorrect"));
    }

    @Test
    public void updateProfile_changesPasswordWhenCurrentPasswordMatches() {
        String username = "carol";
        User user = new User();
        user.setId(1L);
        user.setUsername(username);
        user.setPassword("encoded-old");
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setPassword("newpass");
        req.setCurrentPassword("oldpass");

        when(passwordEncoder.matches("oldpass", "encoded-old")).thenReturn(true);
        when(passwordEncoder.encode("newpass")).thenReturn("encoded-new");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> authService.updateProfile(username, req));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("encoded-new", saved.getPassword());
    }
}
