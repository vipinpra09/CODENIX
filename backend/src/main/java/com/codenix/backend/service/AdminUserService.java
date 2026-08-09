package com.codenix.backend.service;

import com.codenix.backend.dto.AdminUserDto;
import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.Role;
import com.codenix.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AppUserRepository appUserRepository;

    @Transactional(readOnly = true)
    public Page<AdminUserDto> listUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(Math.max(size, 1), 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AppUser> users = (search == null || search.isBlank())
                ? appUserRepository.findAll(pageable)
                : appUserRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(search.trim(), search.trim(), pageable);
        return users.map(this::toDto);
    }

    @Transactional
    public AdminUserDto updateRole(Long id, String role, String currentUserEmail) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getEmail().equals(currentUserEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot change your own role");
        }

        Role newRole;
        try {
            newRole = Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }

        user.setRole(newRole);
        return toDto(appUserRepository.save(user));
    }

    private AdminUserDto toDto(AppUser user) {
        return AdminUserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
