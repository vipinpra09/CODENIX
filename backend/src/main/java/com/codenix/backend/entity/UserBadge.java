package com.codenix.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "user_badges", uniqueConstraints = @UniqueConstraint(name = "uq_user_badge", columnNames = {"user_id", "badge_id"}))
@Getter
@Setter
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "badge_id", nullable = false)
    private String badgeId;

    @Column(name = "earned_at", nullable = false)
    private Instant earnedAt;
}
