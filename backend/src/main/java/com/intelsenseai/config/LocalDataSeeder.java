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
        if (userRepository.findByUsername("demo@company.com").isEmpty() && userRepository.findByEmail("demo@company.com").isEmpty()) {
            User user = new User();
            user.setUsername("demo@company.com");
            user.setEmail("demo@company.com");
            user.setPassword(passwordEncoder.encode("demo123"));
            user.setFirstName("Demo");
            user.setLastName("Customer");
            user.setRole(Role.CUSTOMER);
            user.setStatus(Status.ACTIVE);
            userRepository.save(user);
        }
    }
}
