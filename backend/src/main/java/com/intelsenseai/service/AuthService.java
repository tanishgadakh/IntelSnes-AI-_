package com.intelsenseai.service;

import com.intelsenseai.dto.AuthRequest;
import com.intelsenseai.dto.AuthResponse;
import com.intelsenseai.dto.RegistrationRequest;
import com.intelsenseai.dto.RejectionRequest;
import com.intelsenseai.dto.UserResponse;
import com.intelsenseai.entity.Role;
import com.intelsenseai.entity.Status;
import com.intelsenseai.entity.User;
import com.intelsenseai.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() && request.getUsername() != null && request.getUsername().contains("@")) {
            userOpt = userRepository.findByEmail(request.getUsername());
        }
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        if (user.getStatus() == Status.PENDING) {
            throw new IllegalStateException("Your account is pending approval. Please wait for an administrator to approve your access.");
        }
        if (user.getStatus() == Status.REJECTED) {
            throw new IllegalStateException("Your account registration was rejected. Contact support for next steps.");
        }
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getUsername());
    }

    public UserResponse register(RegistrationRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank() || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required for registration.");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent() || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        if (!fullName.isBlank()) {
            String[] parts = fullName.split("\\s+", 2);
            user.setFirstName(parts[0]);
            user.setLastName(parts.length > 1 ? parts[1] : "");
        }
        user.setPhone(request.getPhone());
        user.setCompany(request.getCompany());
        user.setDepartment(request.getDepartment());
        user.setJobTitle(request.getJobTitle());
        user.setExperience(request.getExperience());
        user.setReasonForAccess(request.getReasonForAccess());

        Role role = Role.CUSTOMER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (Exception ignored) {
                role = Role.CUSTOMER;
            }
        }
        user.setRole(role);
        user.setStatus(role == Role.CUSTOMER ? Status.ACTIVE : Status.PENDING);

        User saved = userRepository.save(user);
        if (role == Role.ANALYST) {
            notificationService.sendAnalystRequestReceivedEmail(saved);
        }
        return UserResponse.fromUser(saved);
    }

    public List<UserResponse> listPendingRequests() {
        return userRepository.findByStatus(Status.PENDING).stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    public UserResponse approveUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(Status.ACTIVE);
        User saved = userRepository.save(user);
        notificationService.sendAnalystApprovalEmail(saved);
        return UserResponse.fromUser(saved);
    }

    public UserResponse rejectUser(Long id, RejectionRequest rejectionRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(Status.REJECTED);
        user.setRejectionReason(rejectionRequest.getReason());
        User saved = userRepository.save(user);
        notificationService.sendAnalystRejectionEmail(saved, rejectionRequest.getReason());
        return UserResponse.fromUser(saved);
    }
}
