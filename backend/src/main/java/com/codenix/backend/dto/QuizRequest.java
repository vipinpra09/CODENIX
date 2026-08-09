package com.codenix.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuizRequest {

    @NotBlank(message = "title is required")
    @Size(max = 255, message = "title too long")
    private String title;

    @Size(max = 2000, message = "description too long")
    private String description;

    @NotBlank(message = "topic is required")
    private String topic;

    @NotBlank(message = "difficulty is required")
    private String difficulty;

    @NotNull(message = "passingPercentage is required")
    @Min(value = 0, message = "passingPercentage must be between 0 and 100")
    @Max(value = 100, message = "passingPercentage must be between 0 and 100")
    private Integer passingPercentage;

    @NotNull(message = "xp is required")
    @Min(value = 0, message = "xp must not be negative")
    private Integer xp;

    @NotBlank(message = "status is required")
    private String status;

    private List<Long> mcqIds;
}
