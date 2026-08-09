package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizSubmitResponse {
    private int score;
    private int totalQuestions;
    private int percentage;
    private int awardedXp;
}
