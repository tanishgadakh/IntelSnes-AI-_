package com.intelsenseai.dto;

import com.intelsenseai.entity.Status;
import com.intelsenseai.entity.User;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String company;
    private String department;
    private String jobTitle;
    private String experience;
    private String reasonForAccess;
    private String rejectionReason;
    private String role;
    private Status status;

    public UserResponse() { }

    public UserResponse(Long id, String username, String email, String firstName, String lastName, String phone, String company, String department, String jobTitle, String experience, String reasonForAccess, String rejectionReason, String role, Status status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.company = company;
        this.department = department;
        this.jobTitle = jobTitle;
        this.experience = experience;
        this.reasonForAccess = reasonForAccess;
        this.rejectionReason = rejectionReason;
        this.role = role;
        this.status = status;
    }

    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getCompany(),
                user.getDepartment(),
                user.getJobTitle(),
                user.getExperience(),
                user.getReasonForAccess(),
                user.getRejectionReason(),
                user.getRole().name(),
                user.getStatus()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getReasonForAccess() { return reasonForAccess; }
    public void setReasonForAccess(String reasonForAccess) { this.reasonForAccess = reasonForAccess; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
