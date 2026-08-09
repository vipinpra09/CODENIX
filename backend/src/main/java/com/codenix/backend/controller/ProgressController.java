package com.codenix.backend.controller;

import com.codenix.backend.dto.GuestProgressDto;
import com.codenix.backend.dto.ProgressSyncRequest;
import com.codenix.backend.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping("/me")
    public GuestProgressDto progress(Authentication authentication) {
        return progressService.getProgress(authentication);
    }

    @PostMapping("/sync")
    public GuestProgressDto sync(Authentication authentication, @Valid @RequestBody ProgressSyncRequest request) {
        return progressService.sync(authentication, request.getGuestProgress());
    }
}
