package com.codenix.backend.service;

import com.codenix.backend.dto.ProgressSummaryDto;
import com.codenix.backend.dto.QuizAttemptDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProgressMergeServiceTest {

    private final ProgressMergeService mergeService = new ProgressMergeService();

    @Test
    void shouldMergeGuestAndCloudProgressWithoutDuplicates() {
        QuizAttemptDto cloudAttempt = new QuizAttemptDto();
        cloudAttempt.setQuizId("q1");
        cloudAttempt.setScore(1);
        cloudAttempt.setTotal(1);
        cloudAttempt.setPercentage(100);

        QuizAttemptDto guestDuplicate = new QuizAttemptDto();
        guestDuplicate.setQuizId("q1");
        guestDuplicate.setScore(1);
        guestDuplicate.setTotal(1);
        guestDuplicate.setPercentage(100);

        QuizAttemptDto guestNew = new QuizAttemptDto();
        guestNew.setQuizId("q2");
        guestNew.setScore(1);
        guestNew.setTotal(1);
        guestNew.setPercentage(100);

        ProgressSummaryDto cloud = ProgressSummaryDto.builder()
                .completedLessons(List.of("intro-c"))
                .solvedProblems(List.of("problem-1"))
                .quizAttempts(List.of(cloudAttempt))
                .badges(List.of("First Step"))
                .xp(45)
                .level(1)
                .currentStreak(1)
                .longestStreak(1)
                .build();

        ProgressMergeService.MergeResult result = mergeService.merge(
                cloud,
                List.of("intro-c", "loops"),
                List.of("problem-1", "problem-2"),
                List.of(guestDuplicate, guestNew)
        );

        assertEquals(2, result.getLessons().size());
        assertEquals(2, result.getProblems().size());
        assertEquals(2, result.getAttempts().size());
        assertEquals(1, result.getNewLessons());
        assertEquals(1, result.getNewProblems());
        assertEquals(1, result.getNewAttempts());
    }
}
