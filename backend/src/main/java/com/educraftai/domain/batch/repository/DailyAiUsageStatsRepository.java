package com.educraftai.domain.batch.repository;

import com.educraftai.domain.batch.entity.DailyAiUsageStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyAiUsageStatsRepository extends JpaRepository<DailyAiUsageStats, Long> {
    Optional<DailyAiUsageStats> findByTeacherIdAndStatsDate(Long teacherId, LocalDate statsDate);
    List<DailyAiUsageStats> findByTeacherIdOrderByStatsDateDesc(Long teacherId);
    List<DailyAiUsageStats> findByStatsDate(LocalDate statsDate);
}
