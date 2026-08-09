package com.codenix.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuizAttemptDto {
    @NotBlank
    private String quizId;

    @Min(0)
    private int score;

    @Min(1)
    private int total;

    @Min(0)
    @Max(100)
    private int percentage;
}
