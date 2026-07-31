package com.intelsenseai.config;

import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocalDataSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private LocalDataSeeder localDataSeeder;

    @Test
    void run_createsDemoCustomerWhenMissing() {
        when(userRepository.findByUsername("demo@company.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("demo123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        localDataSeeder.run(null);

        verify(userRepository).save(any(User.class));
    }
}
