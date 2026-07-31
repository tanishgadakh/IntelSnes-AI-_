package com.intelsenseai.dto;

import com.intelsenseai.entity.Status;

public class RegistrationResponse {
    private String token;
    private String role;
    private String username;
    private Status status;

    public RegistrationResponse() { }

    public RegistrationResponse(String token, String role, String username, Status status) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
