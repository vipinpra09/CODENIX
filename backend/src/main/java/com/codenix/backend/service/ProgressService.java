package com.codenix.backend.service;

import com.codenix.backend.dto.GuestProgressDto;
import com.codenix.backend.dto.ProgressSummaryDto;
import com.codenix.backend.dto.QuizAttemptDto;
import com.codenix.backend.entity.*;
import com.codenix.backend.mapper.ProgressMapper;
import com.codenix.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserContextService userContextService;
    private final UserProgressRepository userProgressRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final ProblemProgressRepository problemProgressRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final ProgressMapper progressMapper;
    private final XpService xpService;
    private final StreakService streakService;
    private final BadgeService badgeService;
    private final ProgressMergeService progressMergeService;

    @Transactional(readOnly = true)
    public GuestProgressDto getProgress(Authentication authentication) {
        return userContextService.getCurrentUser(authentication)
                .map(this::summaryForUser)
                .map(progressMapper::toGuestProgress)
                .orElseGet(GuestProgressDto::new);
    }

    @Transactional
    public GuestProgressDto sync(Authentication authentication, GuestProgressDto guestProgress) {
        AppUser user = userContextService.getCurrentUser(authentication)
                .orElseThrow(() -> new IllegalStateException("Authentication required"));

        ProgressSummaryDto cloud = summaryForUser(user);

        ProgressMergeService.MergeResult mergeResult = progressMergeService.merge(
                cloud,
                guestProgress.getCompletedLessons(),
                guestProgress.getSolvedProblems(),
                guestProgress.getQuizAttempts()
        );

        int earnedLessonXp = mergeResult.getNewLessons() * XpService.LESSON_XP;
        int earnedProblemXp = mergeResult.getNewProblems() * 10;
        int earnedQuizXp = mergeResult.getNewAttempts() * XpService.QUIZ_XP;

        UserProgress progress = getOrCreateProgress(user);
        progress.setXp(progress.getXp() + earnedLessonXp + earnedProblemXp + earnedQuizXp);
        progress.setCurrentStreak(Math.max(progress.getCurrentStreak(), guestProgress.getCurrentStreak()));
        progress.setLongestStreak(Math.max(progress.getLongestStreak(), guestProgress.getLongestStreak()));

        LocalDate activityDate = guestProgress.getLastActivityDate() != null ? guestProgress.getLastActivityDate() : LocalDate.now();
        streakService.applyActivity(progress, activityDate);
        progress.setLevel(xpService.levelFromXp(progress.getXp()));
        userProgressRepository.save(progress);

        persistCompletionState(user, mergeResult.getLessons(), mergeResult.getProblems(), mergeResult.getAttempts());

        ProgressSummaryDto mergedSummary = summaryForUser(user);
        Set<String> unlocked = badgeService.unlockedBadges(mergedSummary);
        persistBadges(user, unlocked);

        return progressMapper.toGuestProgress(summaryForUser(user));
    }

    public void registerLessonCompletion(AppUser user, String lessonId) {
        LessonProgress lessonProgress = lessonProgressRepository.findByUserAndLessonId(user, lessonId).orElseGet(LessonProgress::new);
        if (!lessonProgress.isCompleted()) {
            lessonProgress.setUser(user);
            lessonProgress.setLessonId(lessonId);
            lessonProgress.setCompleted(true);
            lessonProgress.setCompletedAt(Instant.now());
            lessonProgressRepository.save(lessonProgress);

            UserProgress progress = getOrCreateProgress(user);
            progress.setXp(progress.getXp() + XpService.LESSON_XP);
            streakService.applyActivity(progress, LocalDate.now());
            progress.setLevel(xpService.levelFromXp(progress.getXp()));
            userProgressRepository.save(progress);
        }
    }

    public void registerProblemSolve(AppUser user, String problemId, Difficulty difficulty) {
        ProblemProgress problem = problemProgressRepository.findByUserAndProblemId(user, problemId).orElseGet(ProblemProgress::new);
        problem.setUser(user);
        problem.setProblemId(problemId);
        problem.setAttempts(problem.getAttempts() + 1);
        if (!problem.isSolved()) {
            problem.setSolved(true);
            problem.setSolvedAt(Instant.now());
            problemProgressRepository.save(problem);

            UserProgress progress = getOrCreateProgress(user);
            progress.setXp(progress.getXp() + xpService.problemXp(difficulty));
            streakService.applyActivity(progress, LocalDate.now());
            progress.setLevel(xpService.levelFromXp(progress.getXp()));
            userProgressRepository.save(progress);
            return;
        }
        problemProgressRepository.save(problem);
    }

    public void registerQuizAttempt(AppUser user, QuizAttemptDto attempt) {
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setUser(user);
        quizAttempt.setQuizId(attempt.getQuizId());
        quizAttempt.setScore(attempt.getScore());
        quizAttempt.setTotalQuestions(attempt.getTotal());
        quizAttempt.setPercentage(attempt.getPercentage());
        quizAttempt.setAttemptedAt(Instant.now());
        quizAttemptRepository.save(quizAttempt);

        UserProgress progress = getOrCreateProgress(user);
        progress.setXp(progress.getXp() + XpService.QUIZ_XP);
        streakService.applyActivity(progress, LocalDate.now());
        progress.setLevel(xpService.levelFromXp(progress.getXp()));
        userProgressRepository.save(progress);
    }

    private ProgressSummaryDto summaryForUser(AppUser user) {
        UserProgress progress = getOrCreateProgress(user);
        return progressMapper.toSummary(
                progress,
                lessonProgressRepository.findByUserAndCompletedTrue(user),
                problemProgressRepository.findByUserAndSolvedTrue(user),
                quizAttemptRepository.findByUser(user),
                userBadgeRepository.findByUser(user)
        );
    }

    private UserProgress getOrCreateProgress(AppUser user) {
        return userProgressRepository.findByUser(user).orElseGet(() -> {
            UserProgress progress = new UserProgress();
            progress.setUser(user);
            progress.setXp(0);
            progress.setLevel(1);
            progress.setCurrentStreak(0);
            progress.setLongestStreak(0);
            return userProgressRepository.save(progress);
        });
    }

    private void persistCompletionState(AppUser user, List<String> lessons, List<String> problems, List<QuizAttemptDto> attempts) {
        List<QuizAttempt> existingAttempts = quizAttemptRepository.findByUser(user);
        for (String lessonId : lessons) {
            LessonProgress lesson = lessonProgressRepository.findByUserAndLessonId(user, lessonId).orElseGet(LessonProgress::new);
            lesson.setUser(user);
            lesson.setLessonId(lessonId);
            lesson.setCompleted(true);
            lesson.setCompletedAt(Instant.now());
            lessonProgressRepository.save(lesson);
        }

        for (String problemId : problems) {
            ProblemProgress problem = problemProgressRepository.findByUserAndProblemId(user, problemId).orElseGet(ProblemProgress::new);
            problem.setUser(user);
            problem.setProblemId(problemId);
            problem.setSolved(true);
            problem.setSolvedAt(Instant.now());
            if (problem.getAttempts() == null || problem.getAttempts() == 0) {
                problem.setAttempts(1);
            }
            problemProgressRepository.save(problem);
        }

        for (QuizAttemptDto attempt : attempts) {
            boolean exists = existingAttempts.stream().anyMatch(existing -> existing.getQuizId().equals(attempt.getQuizId()));
            if (!exists) {
                QuizAttempt quizAttempt = new QuizAttempt();
                quizAttempt.setUser(user);
                quizAttempt.setQuizId(attempt.getQuizId());
                quizAttempt.setScore(attempt.getScore());
                quizAttempt.setTotalQuestions(attempt.getTotal());
                quizAttempt.setPercentage(attempt.getPercentage());
                quizAttempt.setAttemptedAt(Instant.now());
                quizAttemptRepository.save(quizAttempt);
            }
        }
    }

    private void persistBadges(AppUser user, Set<String> unlocked) {
        Set<String> existing = userBadgeRepository.findByUser(user).stream().map(UserBadge::getBadgeId).collect(java.util.stream.Collectors.toSet());
        for (String badgeId : unlocked) {
            if (!existing.contains(badgeId)) {
                UserBadge badge = new UserBadge();
                badge.setUser(user);
                badge.setBadgeId(badgeId);
                badge.setEarnedAt(Instant.now());
                userBadgeRepository.save(badge);
            }
        }
    }
}
