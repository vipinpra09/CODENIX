package com.codenix.backend.repository;

import com.codenix.backend.entity.McqStatus;
import com.codenix.backend.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Page<Quiz> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    long countByStatus(McqStatus status);

    @Query("select qq.quiz.id, count(qq) from QuizQuestion qq group by qq.quiz.id")
    List<Object[]> countQuestionsByQuiz();
}
