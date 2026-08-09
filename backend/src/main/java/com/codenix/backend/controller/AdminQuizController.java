package com.codenix.backend.controller;

import com.codenix.backend.dto.QuizDto;
import com.codenix.backend.dto.QuizQuestionRequest;
import com.codenix.backend.dto.QuizRequest;
import com.codenix.backend.service.AdminQuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/quizzes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminQuizController {

    private final AdminQuizService adminQuizService;

    @GetMapping
    public Page<QuizDto> listQuizzes(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return adminQuizService.listQuizzes(search, page, size);
    }

    @GetMapping("/{id}")
    public QuizDto get(@PathVariable Long id) {
        return adminQuizService.get(id);
    }

    @PostMapping
    public QuizDto create(@Valid @RequestBody QuizRequest request) {
        return adminQuizService.create(request);
    }

    @PutMapping("/{id}")
    public QuizDto update(@PathVariable Long id, @Valid @RequestBody QuizRequest request) {
        return adminQuizService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        adminQuizService.delete(id);
    }

    @PatchMapping("/{id}/status")
    public QuizDto updateStatus(@PathVariable Long id, @RequestBody QuizRequest request) {
        return adminQuizService.updateStatus(id, request.getStatus());
    }

    @PatchMapping("/{id}/publish")
    public QuizDto publish(@PathVariable Long id) {
        return adminQuizService.updateStatus(id, "PUBLISHED");
    }

    @PostMapping("/{id}/questions")
    public QuizDto addQuestion(@PathVariable Long id, @Valid @RequestBody QuizQuestionRequest request) {
        return adminQuizService.addQuestion(id, request.getMcqId());
    }

    @DeleteMapping("/{id}/questions/{mcqId}")
    public QuizDto removeQuestion(@PathVariable Long id, @PathVariable Long mcqId) {
        return adminQuizService.removeQuestion(id, mcqId);
    }
}
