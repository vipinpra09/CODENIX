package com.codenix.backend.service;

import com.codenix.backend.dto.ProgressSummaryDto;
import com.codenix.backend.dto.QuizAttemptDto;
import lombok.Builder;
import lombok.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressMergeService {

    public MergeResult merge(ProgressSummaryDto cloud, List<String> guestLessons, List<String> guestProblems, List<QuizAttemptDto> guestAttempts) {
        List<String> mergedLessons = mergeUnique(cloud.getCompletedLessons(), guestLessons);
        List<String> mergedProblems = mergeUnique(cloud.getSolvedProblems(), guestProblems);
        List<QuizAttemptDto> mergedAttempts = mergeAttempts(cloud.getQuizAttempts(), guestAttempts);

        int newLessons = (int) mergedLessons.stream().filter(id -> !cloud.getCompletedLessons().contains(id)).count();
        int newProblems = (int) mergedProblems.stream().filter(id -> !cloud.getSolvedProblems().contains(id)).count();
        int newAttempts = (int) mergedAttempts.stream()
                .filter(attempt -> cloud.getQuizAttempts().stream().noneMatch(existing -> existing.getQuizId().equals(attempt.getQuizId())))
                .count();

        return MergeResult.builder()
                .lessons(mergedLessons)
                .problems(mergedProblems)
                .attempts(mergedAttempts)
                .newLessons(newLessons)
                .newProblems(newProblems)
                .newAttempts(newAttempts)
                .build();
    }

    private List<String> mergeUnique(List<String> first, List<String> second) {
        List<String> merged = new ArrayList<>(first);
        for (String item : second) {
            if (!merged.contains(item)) {
                merged.add(item);
            }
        }
        return merged;
    }

    private List<QuizAttemptDto> mergeAttempts(List<QuizAttemptDto> cloud, List<QuizAttemptDto> guest) {
        List<QuizAttemptDto> merged = new ArrayList<>(cloud);
        for (QuizAttemptDto attempt : guest) {
            boolean exists = merged.stream().anyMatch(existing -> existing.getQuizId().equals(attempt.getQuizId()));
            if (!exists) {
                merged.add(attempt);
            }
        }
        return merged;
    }

    @Value
    @Builder
    public static class MergeResult {
        List<String> lessons;
        List<String> problems;
        List<QuizAttemptDto> attempts;
        int newLessons;
        int newProblems;
        int newAttempts;
    }
}
