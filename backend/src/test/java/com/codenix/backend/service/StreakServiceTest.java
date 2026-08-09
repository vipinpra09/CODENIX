package com.codenix.backend.service;

import com.codenix.backend.entity.UserProgress;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StreakServiceTest {

    private final StreakService streakService = new StreakService();

    @Test
    void shouldIncreaseStreakOnConsecutiveDays() {
        UserProgress progress = new UserProgress();
        progress.setCurrentStreak(1);
        progress.setLongestStreak(1);
        progress.setLastActivityDate(LocalDate.of(2026, 8, 8));

        streakService.applyActivity(progress, LocalDate.of(2026, 8, 9));

        assertEquals(2, progress.getCurrentStreak());
        assertEquals(2, progress.getLongestStreak());
    }

    @Test
    void shouldResetStreakWhenGapIsMoreThanOneDay() {
        UserProgress progress = new UserProgress();
        progress.setCurrentStreak(5);
        progress.setLongestStreak(5);
        progress.setLastActivityDate(LocalDate.of(2026, 8, 1));

        streakService.applyActivity(progress, LocalDate.of(2026, 8, 9));

        assertEquals(1, progress.getCurrentStreak());
        assertEquals(5, progress.getLongestStreak());
    }
}
