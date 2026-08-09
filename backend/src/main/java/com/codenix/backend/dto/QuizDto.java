package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class QuizDto {
    private Long id;
    private String title;
    private String description;
    private String topic;
    private String difficulty;
    private Integer passingPercentage;
    private Integer xp;
    private String status;
    private Integer questionCount;
    private List<McqDto> questions;
    private Instant createdAt;
    private Instant updatedAt;
}
