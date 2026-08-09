package com.codenix.backend.repository;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUser(AppUser user);
}
