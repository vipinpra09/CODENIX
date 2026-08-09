package com.codenix.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = @UniqueConstraint(name = "uq_lesson_progress_user_lesson", columnNames = {"user_id", "lesson_id"}))
@Getter
@Setter
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "lesson_id", nullable = false)
    private String lessonId;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "completed_at")
    private Instant completedAt;
}
