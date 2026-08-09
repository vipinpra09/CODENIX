package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminUserDto {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private String role;
    private Instant createdAt;
}
