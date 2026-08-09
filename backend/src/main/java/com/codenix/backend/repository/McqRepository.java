package com.codenix.backend.repository;

import com.codenix.backend.entity.Mcq;
import com.codenix.backend.entity.McqStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface McqRepository extends JpaRepository<Mcq, Long> {
    Page<Mcq> findByQuestionContainingIgnoreCase(String question, Pageable pageable);

    long countByStatus(McqStatus status);

    List<Mcq> findByStatusAndTopicOrderById(McqStatus status, String topic);

    List<Mcq> findByStatus(McqStatus status);
}
