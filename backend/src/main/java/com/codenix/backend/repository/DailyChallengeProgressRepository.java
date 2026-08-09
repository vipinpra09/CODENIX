package com.codenix.backend.repository;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.DailyChallengeProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DailyChallengeProgressRepository extends JpaRepository<DailyChallengeProgress, Long> {
    Optional<DailyChallengeProgress> findByUserAndChallengeId(AppUser user, String challengeId);
}
