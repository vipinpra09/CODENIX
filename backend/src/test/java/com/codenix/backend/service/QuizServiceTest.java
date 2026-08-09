package com.codenix.backend.service;

import com.codenix.backend.dto.QuizSubmitResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class QuizServiceTest {

    private final QuizService quizService = new QuizService();

    @Test
    void shouldScoreQuizAndReturnPercentage() {
        QuizSubmitResponse result = quizService.score(List.of(0, 2, 1), List.of(0, 1, 1));

        assertEquals(2, result.getScore());
        assertEquals(3, result.getTotalQuestions());
        assertEquals(67, result.getPercentage());
        assertEquals(XpService.QUIZ_XP, result.getAwardedXp());
    }
}
