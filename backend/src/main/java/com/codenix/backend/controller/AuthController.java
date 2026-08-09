package com.codenix.backend.controller;

import com.codenix.backend.dto.UserProfileDto;
import com.codenix.backend.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserContextService userContextService;

    @GetMapping("/me")
    public UserProfileDto me(Authentication authentication) {
        return userContextService.getCurrentUser(authentication)
                .map(user -> UserProfileDto.builder()
                        .id(String.valueOf(user.getId()))
                        .name(user.getName())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .role(user.getRole().name())
                        .build())
                .orElse(null);
    }
}
