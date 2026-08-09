package com.codenix.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "quiz_attempts", indexes = @Index(name = "idx_quiz_attempt_user", columnList = "user_id"))
@Getter
@Setter
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "quiz_id", nullable = false)
    private String quizId;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer percentage;

    @Column(name = "attempted_at", nullable = false)
    private Instant attemptedAt;
}
