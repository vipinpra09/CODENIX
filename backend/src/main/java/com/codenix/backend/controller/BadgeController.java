package com.codenix.backend.controller;

import com.codenix.backend.dto.GuestProgressDto;
import com.codenix.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final ProgressService progressService;

    @GetMapping("/me")
    public List<String> badges(Authentication authentication) {
        GuestProgressDto progress = progressService.getProgress(authentication);
        return progress.getBadges();
    }
}
