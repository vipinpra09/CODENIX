package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ProgressSummaryDto {
    private List<String> completedLessons;
    private List<String> solvedProblems;
    private List<QuizAttemptDto> quizAttempts;
    private List<String> badges;
    private int xp;
    private int level;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastActivityDate;
}
