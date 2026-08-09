package com.codenix.backend.controller;

import com.codenix.backend.dto.AdminUserDto;
import com.codenix.backend.dto.RoleUpdateRequest;
import com.codenix.backend.service.AdminUserService;
import com.codenix.backend.service.UserContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final UserContextService userContextService;

    @GetMapping
    public Page<AdminUserDto> listUsers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return adminUserService.listUsers(search, page, size);
    }

    @PatchMapping("/{id}/role")
    public AdminUserDto updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequest request,
            Authentication authentication
    ) {
        return adminUserService.updateRole(id, request.getRole(), userContextService.getCurrentUserEmail(authentication));
    }
}
