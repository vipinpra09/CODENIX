package com.codenix.backend.service;

import com.codenix.backend.dto.DashboardDto;
import com.codenix.backend.entity.McqStatus;
import com.codenix.backend.repository.AppUserRepository;
import com.codenix.backend.repository.McqRepository;
import com.codenix.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AppUserRepository appUserRepository;
    private final McqRepository mcqRepository;
    private final QuizRepository quizRepository;

    @Transactional(readOnly = true)
    public DashboardDto dashboard() {
        return DashboardDto.builder()
                .totalUsers(appUserRepository.count())
                .totalMcqs(mcqRepository.count())
                .totalQuizzes(quizRepository.count())
                .publishedMcqs(mcqRepository.countByStatus(McqStatus.PUBLISHED))
                .publishedQuizzes(quizRepository.countByStatus(McqStatus.PUBLISHED))
                .build();
    }
}
