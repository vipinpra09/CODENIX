package com.codenix.backend.service;

import com.codenix.backend.entity.Difficulty;
import org.springframework.stereotype.Service;

@Service
public class XpService {

    public static final int LESSON_XP = 20;
    public static final int QUIZ_XP = 15;
    public static final int DAILY_CHALLENGE_XP = 25;

    public int problemXp(Difficulty difficulty) {
        return switch (difficulty) {
            case BEGINNER, EASY -> 10;
            case MEDIUM -> 20;
            case CHALLENGE -> 30;
        };
    }

    public int levelFromXp(int xp) {
        return Math.max(1, (xp / 100) + 1);
    }
}
