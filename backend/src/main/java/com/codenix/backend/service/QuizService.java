package com.codenix.backend.service;

import com.codenix.backend.dto.QuizSubmitResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    public QuizSubmitResponse score(List<Integer> selectedAnswers, List<Integer> correctAnswers) {
        int total = correctAnswers.size();
        int score = 0;
        for (int i = 0; i < total && i < selectedAnswers.size(); i++) {
            if (correctAnswers.get(i).equals(selectedAnswers.get(i))) {
                score++;
            }
        }

        int percentage = total == 0 ? 0 : (int) Math.round((score * 100.0) / total);
        return QuizSubmitResponse.builder()
                .score(score)
                .totalQuestions(total)
                .percentage(percentage)
                .awardedXp(XpService.QUIZ_XP)
                .build();
    }
}
