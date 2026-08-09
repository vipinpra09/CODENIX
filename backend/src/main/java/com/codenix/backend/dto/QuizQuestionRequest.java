package com.codenix.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuizQuestionRequest {
    @NotNull(message = "mcqId is required")
    private Long mcqId;
}
