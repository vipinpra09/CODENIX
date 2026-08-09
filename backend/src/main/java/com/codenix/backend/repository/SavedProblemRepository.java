package com.codenix.backend.repository;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.SavedProblem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedProblemRepository extends JpaRepository<SavedProblem, Long> {
    List<SavedProblem> findByUser(AppUser user);
}
