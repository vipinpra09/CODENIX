package com.codenix.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class QuizSubmitRequest {
    @NotEmpty
    private List<Integer> selectedAnswers;
}
