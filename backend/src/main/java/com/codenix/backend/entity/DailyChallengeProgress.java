package com.codenix.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "daily_challenge_progress", uniqueConstraints = @UniqueConstraint(name = "uq_daily_challenge_user_challenge", columnNames = {"user_id", "challenge_id"}))
@Getter
@Setter
public class DailyChallengeProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "challenge_id", nullable = false)
    private String challengeId;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "completed_at")
    private Instant completedAt;
}
