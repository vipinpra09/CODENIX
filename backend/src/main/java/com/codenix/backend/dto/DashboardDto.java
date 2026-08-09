package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDto {
    private long totalUsers;
    private long totalMcqs;
    private long totalQuizzes;
    private long publishedMcqs;
    private long publishedQuizzes;
}
