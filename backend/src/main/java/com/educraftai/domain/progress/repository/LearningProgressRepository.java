package com.educraftai.domain.progress.repository;

import com.educraftai.domain.progress.entity.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

    Optional<LearningProgress> findByUserIdAndCourseId(Long userId, Long courseId);

    List<LearningProgress> findByUserIdOrderByLastActivityAtDesc(Long userId);

    List<LearningProgress> findByCourseIdOrderByProgressRateDesc(Long courseId);

    /**
     * 특정 코스에서 최근 N일간 활동이 없는(또는 임계 시각 이전) 학생 진도 목록.
     * 교사 모니터링 페이지의 "비활성 학생" 필터용.
     */
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.courseId = :courseId AND lp.lastActivityAt < :threshold " +
            "ORDER BY lp.lastActivityAt ASC")
    List<LearningProgress> findInactiveByCourseId(
            @Param("courseId") Long courseId,
            @Param("threshold") LocalDateTime threshold
    );

    /** 특정 학생이 해당 코스에 수강 중인지 (진도 레코드 존재 여부로 판정) */
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}
