package com.codenix.backend.repository;

import com.codenix.backend.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizIdOrderByPosition(Long quizId);

    Optional<QuizQuestion> findByQuizIdAndMcqId(Long quizId, Long mcqId);

    void deleteByQuizIdAndMcqId(Long quizId, Long mcqId);

    long countByQuizId(Long quizId);
}
