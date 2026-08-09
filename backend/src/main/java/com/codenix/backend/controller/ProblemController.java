package com.codenix.backend.controller;

import com.codenix.backend.entity.Difficulty;
import com.codenix.backend.service.ContentService;
import com.codenix.backend.service.ProgressService;
import com.codenix.backend.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ContentService contentService;
    private final UserContextService userContextService;
    private final ProgressService progressService;

    @GetMapping
    public List<Map<String, Object>> listProblems() {
        return contentService.problems();
    }

    @GetMapping("/{problemId}")
    public Map<String, Object> getProblem(@PathVariable String problemId) {
        return contentService.problemById(problemId).orElseThrow(() -> new IllegalArgumentException("Problem not found"));
    }

    @PostMapping("/{problemId}/solve")
    public Map<String, String> solveProblem(
            @PathVariable String problemId,
            @RequestParam(defaultValue = "EASY") Difficulty difficulty,
            Authentication authentication
    ) {
        var user = userContextService.getCurrentUser(authentication).orElseThrow(() -> new IllegalStateException("Authentication required"));
        progressService.registerProblemSolve(user, problemId, difficulty);
        return Map.of("status", "solved");
    }
}
