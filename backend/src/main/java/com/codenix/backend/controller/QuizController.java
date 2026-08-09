package com.codenix.backend.controller;

import com.codenix.backend.dto.QuizAttemptDto;
import com.codenix.backend.dto.QuizSubmitRequest;
import com.codenix.backend.dto.QuizSubmitResponse;
import com.codenix.backend.service.ContentService;
import com.codenix.backend.service.ProgressService;
import com.codenix.backend.service.QuizService;
import com.codenix.backend.service.UserContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final ContentService contentService;
    private final QuizService quizService;
    private final UserContextService userContextService;
    private final ProgressService progressService;

    @GetMapping("/{topic}")
    public List<Map<String, Object>> quizzesByTopic(@PathVariable String topic) {
        return contentService.quizzesByTopic(topic);
    }

    @PostMapping("/{quizId}/submit")
    public QuizSubmitResponse submit(
            @PathVariable String quizId,
            @Valid @RequestBody QuizSubmitRequest request,
            Authentication authentication
    ) {
        QuizSubmitResponse result = quizService.score(request.getSelectedAnswers(), contentService.quizAnswerKey(quizId));
        userContextService.getCurrentUser(authentication).ifPresent(user -> {
            QuizAttemptDto attempt = new QuizAttemptDto();
            attempt.setQuizId(quizId);
            attempt.setScore(result.getScore());
            attempt.setTotal(result.getTotalQuestions());
            attempt.setPercentage(result.getPercentage());
            progressService.registerQuizAttempt(user, attempt);
        });
        return result;
    }
}
