package com.intelsenseai.repository;

import com.intelsenseai.entity.PlatformStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlatformStatisticsRepository extends JpaRepository<PlatformStatistics, Long> {
    Optional<PlatformStatistics> findTopByOrderByIdDesc();
}
