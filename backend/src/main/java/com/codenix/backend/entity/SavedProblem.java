package com.codenix.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "saved_problems", uniqueConstraints = @UniqueConstraint(name = "uq_saved_problem", columnNames = {"user_id", "problem_id"}))
@Getter
@Setter
public class SavedProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "problem_id", nullable = false)
    private String problemId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
