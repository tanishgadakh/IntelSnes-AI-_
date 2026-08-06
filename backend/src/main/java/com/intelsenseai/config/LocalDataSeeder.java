package com.intelsenseai.config;

import com.intelsenseai.entity.Role;
import com.intelsenseai.entity.Status;
import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
public class LocalDataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LocalDataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        createUserIfMissing(
                "demo@company.com",
                "demo@company.com",
                "demo123",
                "Demo",
                "Customer",
                Role.CUSTOMER
        );

        createUserIfMissing(
                "admin@company.com",
                "admin@company.com",
                "admin123",
                "Admin",
                "User",
                Role.ADMIN
        );
    }

    private void createUserIfMissing(String username, String email, String rawPassword, String firstName, String lastName, Role role) {
        if (userRepository.findByUsername(username).isEmpty() && userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(role);
            user.setStatus(Status.ACTIVE);
            userRepository.save(user);
        }
    }
}
