package com.codenix.backend.mapper;

import com.codenix.backend.dto.GuestProgressDto;
import com.codenix.backend.dto.ProgressSummaryDto;
import com.codenix.backend.dto.QuizAttemptDto;
import com.codenix.backend.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProgressMapper {

    public ProgressSummaryDto toSummary(
            UserProgress userProgress,
            List<LessonProgress> lessons,
            List<ProblemProgress> problems,
            List<QuizAttempt> quizAttempts,
            List<UserBadge> badges
    ) {
        return ProgressSummaryDto.builder()
                .completedLessons(lessons.stream().filter(LessonProgress::isCompleted).map(LessonProgress::getLessonId).toList())
                .solvedProblems(problems.stream().filter(ProblemProgress::isSolved).map(ProblemProgress::getProblemId).toList())
                .quizAttempts(quizAttempts.stream().map(this::toQuizAttempt).toList())
                .badges(badges.stream().map(UserBadge::getBadgeId).toList())
                .xp(userProgress.getXp())
                .level(userProgress.getLevel())
                .currentStreak(userProgress.getCurrentStreak())
                .longestStreak(userProgress.getLongestStreak())
                .lastActivityDate(userProgress.getLastActivityDate())
                .build();
    }

    public GuestProgressDto toGuestProgress(ProgressSummaryDto summary) {
        GuestProgressDto dto = new GuestProgressDto();
        dto.setCompletedLessons(summary.getCompletedLessons());
        dto.setSolvedProblems(summary.getSolvedProblems());
        dto.setQuizAttempts(summary.getQuizAttempts());
        dto.setBadges(summary.getBadges());
        dto.setXp(summary.getXp());
        dto.setCurrentStreak(summary.getCurrentStreak());
        dto.setLongestStreak(summary.getLongestStreak());
        dto.setLastActivityDate(summary.getLastActivityDate());
        return dto;
    }

    public QuizAttemptDto toQuizAttempt(QuizAttempt quizAttempt) {
        QuizAttemptDto dto = new QuizAttemptDto();
        dto.setQuizId(quizAttempt.getQuizId());
        dto.setScore(quizAttempt.getScore());
        dto.setTotal(quizAttempt.getTotalQuestions());
        dto.setPercentage(quizAttempt.getPercentage());
        return dto;
    }
}
