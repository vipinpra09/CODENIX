package com.codenix.backend.controller;

import com.codenix.backend.entity.DailyChallengeProgress;
import com.codenix.backend.repository.DailyChallengeProgressRepository;
import com.codenix.backend.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/daily-challenge")
@RequiredArgsConstructor
public class DailyChallengeController {

    private final DailyChallengeProgressRepository repository;
    private final UserContextService userContextService;

    @GetMapping
    public Map<String, String> getChallenge() {
        return Map.of(
                "id", LocalDate.now().toString(),
                "title", "Sum of digits",
                "description", "Write a C program to find sum of digits in a positive integer"
        );
    }

    @PostMapping("/complete")
    public Map<String, String> complete(Authentication authentication) {
        var user = userContextService.getCurrentUser(authentication).orElseThrow(() -> new IllegalStateException("Authentication required"));
        String challengeId = LocalDate.now().toString();
        DailyChallengeProgress progress = repository.findByUserAndChallengeId(user, challengeId).orElseGet(DailyChallengeProgress::new);
        progress.setUser(user);
        progress.setChallengeId(challengeId);
        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        repository.save(progress);
        return Map.of("status", "completed");
    }
}
