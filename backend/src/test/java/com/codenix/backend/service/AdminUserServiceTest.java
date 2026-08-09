package com.codenix.backend.service;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.Role;
import com.codenix.backend.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private AdminUserService adminUserService;

    @Test
    void updateRoleShouldPromoteToAdmin() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setEmail("student@example.com");
        user.setRole(Role.STUDENT);

        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(appUserRepository.save(user)).thenReturn(user);

        var dto = adminUserService.updateRole(1L, "ADMIN", "admin@example.com");

        assertEquals(Role.ADMIN, user.getRole());
        assertEquals("ADMIN", dto.getRole());
    }

    @Test
    void updateRoleShouldRejectInvalidRole() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setEmail("student@example.com");

        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(ResponseStatusException.class, () -> adminUserService.updateRole(1L, "SUPERUSER", "admin@example.com"));
    }

    @Test
    void updateRoleShouldRejectSelfDemotion() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setEmail("admin@example.com");

        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(ResponseStatusException.class, () -> adminUserService.updateRole(1L, "STUDENT", "admin@example.com"));
    }
}
