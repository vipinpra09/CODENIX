package com.codenix.backend.service;

import com.codenix.backend.dto.ProgressSummaryDto;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class BadgeService {

    public Set<String> unlockedBadges(ProgressSummaryDto progress) {
        Set<String> badges = new LinkedHashSet<>(progress.getBadges());
        if (!progress.getCompletedLessons().isEmpty()) badges.add("First Step");
        if (progress.getCompletedLessons().stream().anyMatch("intro-c"::equals)) badges.add("Hello World");
        if (progress.getSolvedProblems().size() >= 1) badges.add("Problem Solver");
        if (progress.getQuizAttempts().size() >= 3) badges.add("Quiz Master");
        if (progress.getCurrentStreak() >= 7) badges.add("7-Day Warrior");
        if (progress.getSolvedProblems().stream().anyMatch(id -> id.contains("29") || id.contains("30") || id.contains("31"))) badges.add("Array Explorer");
        if (progress.getSolvedProblems().stream().anyMatch(id -> id.contains("45") || id.contains("46") || id.contains("47"))) badges.add("Pointer Beginner");
        if (progress.getSolvedProblems().size() >= 10) badges.add("Speed Coder");
        if (progress.getXp() >= 100) badges.add("Century");
        if (progress.getXp() >= 500) badges.add("Codenix Master");
        return badges;
    }
}
