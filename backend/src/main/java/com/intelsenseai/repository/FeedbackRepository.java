package com.intelsenseai.repository;

import com.intelsenseai.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
	java.util.List<Feedback> findByCreatedBy(String createdBy);
}
