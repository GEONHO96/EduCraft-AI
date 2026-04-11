package com.educraftai.domain.batch.repository;

import com.educraftai.domain.batch.entity.DailyLearningStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyLearningStatsRepository extends JpaRepository<DailyLearningStats, Long> {
    Optional<DailyLearningStats> findByStudentIdAndStatsDate(Long studentId, LocalDate statsDate);
    List<DailyLearningStats> findByStudentIdOrderByStatsDateDesc(Long studentId);
    List<DailyLearningStats> findByStatsDate(LocalDate statsDate);
}
