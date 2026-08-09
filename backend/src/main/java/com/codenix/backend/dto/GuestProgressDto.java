package com.codenix.backend.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class GuestProgressDto {
    private List<String> completedLessons = new ArrayList<>();
    private List<String> solvedProblems = new ArrayList<>();
    private List<QuizAttemptDto> quizAttempts = new ArrayList<>();
    private List<String> badges = new ArrayList<>();

    @Min(0)
    private int xp;

    @Min(0)
    private int currentStreak;

    @Min(0)
    private int longestStreak;

    private LocalDate lastActivityDate;
    private String dailyChallengeCompletedOn;
}
