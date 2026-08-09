package com.codenix.backend.controller;

import com.codenix.backend.service.ContentService;
import com.codenix.backend.service.ProgressService;
import com.codenix.backend.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final ContentService contentService;
    private final UserContextService userContextService;
    private final ProgressService progressService;

    @GetMapping
    public List<Map<String, Object>> listLessons() {
        return contentService.lessons();
    }

    @GetMapping("/{lessonId}")
    public Map<String, Object> getLesson(@PathVariable String lessonId) {
        return contentService.lessonById(lessonId).orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
    }

    @PostMapping("/{lessonId}/complete")
    public Map<String, String> completeLesson(@PathVariable String lessonId, Authentication authentication) {
        var user = userContextService.getCurrentUser(authentication).orElseThrow(() -> new IllegalStateException("Authentication required"));
        progressService.registerLessonCompletion(user, lessonId);
        return Map.of("status", "completed");
    }
}
