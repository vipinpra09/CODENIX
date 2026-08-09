package com.codenix.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class McqRequest {

    @NotBlank(message = "question is required")
    private String question;

    @NotBlank(message = "optionA is required")
    private String optionA;

    @NotBlank(message = "optionB is required")
    private String optionB;

    @NotBlank(message = "optionC is required")
    private String optionC;

    @NotBlank(message = "optionD is required")
    private String optionD;

    @NotNull(message = "correctAnswer is required")
    @Min(value = 0, message = "correctAnswer must be between 0 and 3")
    private Integer correctAnswer;

    @NotBlank(message = "topic is required")
    private String topic;

    @NotBlank(message = "difficulty is required")
    private String difficulty;

    @Size(max = 2000, message = "explanation too long")
    private String explanation;

    @NotNull(message = "xp is required")
    @Min(value = 0, message = "xp must not be negative")
    private Integer xp;

    @NotBlank(message = "status is required")
    private String status;
}
