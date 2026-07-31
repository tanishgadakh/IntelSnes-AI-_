package com.intelsenseai.dto;

public class RegistrationRequest {
    private String username;
    private String email;
    private String password;
    private String role;
    private String fullName;
    private String phone;
    private String company;
    private String department;
    private String jobTitle;
    private String experience;
    private String reasonForAccess;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
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
}
