package com.intelsenseai.dto;

public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String company;
    private String department;
    private String jobTitle;
    private String experience;
    private String reasonForAccess;
    private String currentPassword;
    private String password;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
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
    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
