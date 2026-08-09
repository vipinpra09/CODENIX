package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class McqDto {
    private Long id;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Integer correctAnswer;
    private String topic;
    private String difficulty;
    private String explanation;
    private Integer xp;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
