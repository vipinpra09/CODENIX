package com.codenix.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "problem_progress", uniqueConstraints = @UniqueConstraint(name = "uq_problem_progress_user_problem", columnNames = {"user_id", "problem_id"}))
@Getter
@Setter
public class ProblemProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "problem_id", nullable = false)
    private String problemId;

    @Column(nullable = false)
    private boolean solved;

    @Column(nullable = false)
    private Integer attempts = 0;

    @Column(name = "solved_at")
    private Instant solvedAt;
}
