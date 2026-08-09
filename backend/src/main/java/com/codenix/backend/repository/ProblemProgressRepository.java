package com.codenix.backend.repository;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.ProblemProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProblemProgressRepository extends JpaRepository<ProblemProgress, Long> {
    List<ProblemProgress> findByUserAndSolvedTrue(AppUser user);
    Optional<ProblemProgress> findByUserAndProblemId(AppUser user, String problemId);
}
