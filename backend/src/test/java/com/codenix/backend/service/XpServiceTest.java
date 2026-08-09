package com.codenix.backend.service;

import com.codenix.backend.entity.Difficulty;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class XpServiceTest {

    private final XpService xpService = new XpService();

    @Test
    void shouldCalculateProblemXpByDifficulty() {
        assertEquals(10, xpService.problemXp(Difficulty.BEGINNER));
        assertEquals(10, xpService.problemXp(Difficulty.EASY));
        assertEquals(20, xpService.problemXp(Difficulty.MEDIUM));
        assertEquals(30, xpService.problemXp(Difficulty.CHALLENGE));
    }

    @Test
    void shouldCalculateLevelFromXp() {
        assertEquals(1, xpService.levelFromXp(0));
        assertEquals(2, xpService.levelFromXp(100));
        assertEquals(4, xpService.levelFromXp(350));
    }
}
