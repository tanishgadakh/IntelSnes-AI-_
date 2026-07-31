package com.intelsenseai.service;

import com.intelsenseai.entity.User;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendAnalystRequestReceivedEmail(User user) {
        // Stub: replace with real email implementation.
        System.out.printf("[Notification] Analyst request received for %s (%s)\n", user.getEmail(), user.getUsername());
    }

    public void sendAnalystApprovalEmail(User user) {
        // Stub: replace with real email implementation.
        System.out.printf("[Notification] Analyst approved for %s (%s)\n", user.getEmail(), user.getUsername());
    }

    public void sendAnalystRejectionEmail(User user, String reason) {
        // Stub: replace with real email implementation.
        System.out.printf("[Notification] Analyst rejected for %s (%s) reason=%s\n", user.getEmail(), user.getUsername(), reason);
    }
}
