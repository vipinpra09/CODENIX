package com.codenix.backend.service;

import com.codenix.backend.entity.UserProgress;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class StreakService {

    public void applyActivity(UserProgress progress, LocalDate activityDate) {
        LocalDate last = progress.getLastActivityDate();
        if (last != null && !activityDate.isAfter(last)) {
            return;
        }

        if (last == null) {
            progress.setCurrentStreak(1);
        } else {
            long days = ChronoUnit.DAYS.between(last, activityDate);
            progress.setCurrentStreak(days == 1 ? progress.getCurrentStreak() + 1 : 1);
        }

        progress.setLongestStreak(Math.max(progress.getLongestStreak(), progress.getCurrentStreak()));
        progress.setLastActivityDate(activityDate);
    }
}
