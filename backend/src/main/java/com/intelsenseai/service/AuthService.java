package com.intelsenseai.service;

import com.intelsenseai.dto.AuthRequest;
import com.intelsenseai.dto.AuthResponse;
import com.intelsenseai.dto.ProfileUpdateRequest;
import com.intelsenseai.dto.RegistrationRequest;
import com.intelsenseai.dto.RegistrationResponse;
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

    public RegistrationResponse register(RegistrationRequest request) {
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

        String token = null;
        if (saved.getStatus() == Status.ACTIVE) {
            token = jwtService.generateToken(saved.getUsername(), saved.getRole().name());
        }
        return new RegistrationResponse(token, saved.getRole().name(), saved.getUsername(), saved.getStatus());
    }

    public UserResponse getProfile(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Authentication required");
        }
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElseThrow(() -> new IllegalArgumentException("User not found")));
        return UserResponse.fromUser(user);
    }

    public UserResponse updateProfile(String username, ProfileUpdateRequest request) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Authentication required");
        }
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElseThrow(() -> new IllegalArgumentException("User not found")));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getCompany() != null) user.setCompany(request.getCompany());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getJobTitle() != null) user.setJobTitle(request.getJobTitle());
        if (request.getExperience() != null) user.setExperience(request.getExperience());
        if (request.getReasonForAccess() != null) user.setReasonForAccess(request.getReasonForAccess());

        if (request.getEmail() != null && !request.getEmail().isBlank() && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("Current password is required to change your password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User saved = userRepository.save(user);
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
