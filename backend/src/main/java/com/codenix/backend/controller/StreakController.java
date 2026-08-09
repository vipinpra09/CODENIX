package com.codenix.backend.controller;

import com.codenix.backend.dto.GuestProgressDto;
import com.codenix.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/streak")
@RequiredArgsConstructor
public class StreakController {

    private final ProgressService progressService;

    @GetMapping("/me")
    public Map<String, Integer> streak(Authentication authentication) {
        GuestProgressDto progress = progressService.getProgress(authentication);
        return Map.of(
                "currentStreak", progress.getCurrentStreak(),
                "longestStreak", progress.getLongestStreak()
        );
    }
}
