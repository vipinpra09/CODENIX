package com.codenix.backend.repository;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    List<LessonProgress> findByUserAndCompletedTrue(AppUser user);
    Optional<LessonProgress> findByUserAndLessonId(AppUser user, String lessonId);
}
