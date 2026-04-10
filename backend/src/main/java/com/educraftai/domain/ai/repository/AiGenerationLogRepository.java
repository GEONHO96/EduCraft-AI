package com.educraftai.domain.ai.repository;

import com.educraftai.domain.ai.entity.AiGenerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AiGenerationLogRepository extends JpaRepository<AiGenerationLog, Long> {
    List<AiGenerationLog> findByTeacherId(Long teacherId);

    @Query("SELECT COALESCE(SUM(a.timeSavedSeconds), 0) FROM AiGenerationLog a WHERE a.teacher.id = :teacherId")
    Integer getTotalTimeSavedByTeacherId(Long teacherId);

    @Query("SELECT COUNT(a) FROM AiGenerationLog a WHERE a.teacher.id = :teacherId")
    Long getGenerationCountByTeacherId(Long teacherId);
}
