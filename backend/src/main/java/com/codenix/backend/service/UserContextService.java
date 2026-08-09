package com.codenix.backend.service;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final AppUserRepository appUserRepository;

    public Optional<AppUser> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            String email = oAuth2User.getAttribute("email");
            String googleId = oAuth2User.getAttribute("sub");
            return Optional.of(upsertFromOAuth(email, googleId, oAuth2User.getAttributes()));
        }

        return Optional.empty();
    }

    private AppUser upsertFromOAuth(String email, String googleId, Map<String, Object> attributes) {
        if (email == null || googleId == null) {
            throw new IllegalStateException("Invalid OAuth principal");
        }

        AppUser user = appUserRepository.findByEmail(email).orElseGet(AppUser::new);
        user.setEmail(email);
        user.setGoogleId(googleId);
        user.setName((String) attributes.getOrDefault("name", email));
        user.setAvatarUrl((String) attributes.get("picture"));
        return appUserRepository.save(user);
    }

    public Optional<Long> getUserIdFromHeader() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return Optional.empty();
        }

        String value = attributes.getRequest().getHeader("X-User-Id");
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }

        try {
            return Optional.of(Long.parseLong(value));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }
}
