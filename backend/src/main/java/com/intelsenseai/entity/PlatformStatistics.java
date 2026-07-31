package com.intelsenseai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "platform_statistics")
public class PlatformStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private long predictions = 2500000L;

    @Column(nullable = false)
    private double accuracy = 99.2;

    @Column(nullable = false)
    private int organizations = 250;

    @Column(nullable = false)
    private int users = 50000;

    public PlatformStatistics() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getPredictions() {
        return predictions;
    }

    public void setPredictions(long predictions) {
        this.predictions = predictions;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public int getOrganizations() {
        return organizations;
    }

    public void setOrganizations(int organizations) {
        this.organizations = organizations;
    }

    public int getUsers() {
        return users;
    }

    public void setUsers(int users) {
        this.users = users;
    }
}
