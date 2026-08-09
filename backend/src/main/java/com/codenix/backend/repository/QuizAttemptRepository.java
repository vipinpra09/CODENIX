package com.codenix.backend.repository;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUser(AppUser user);
}
