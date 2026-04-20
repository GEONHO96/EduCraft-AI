package com.educraftai.domain.ai.repository;

import com.educraftai.domain.ai.entity.WeaknessReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WeaknessReportRepository extends JpaRepository<WeaknessReport, Long> {

    Optional<WeaknessReport> findByQuizSubmissionId(Long quizSubmissionId);

    List<WeaknessReport> findByUserIdAndCourseIdOrderByCreatedAtDesc(Long userId, Long courseId);

    List<WeaknessReport> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * 특정 코스의 반 전체 공통 취약 개념 TOP N.
     * <p>`weakness_report_weak_concepts` ElementCollection 테이블을 집계.
     * 반환 Object[] 구조: [concept(String), count(Long)]
     */
    @Query(value = "SELECT concept, COUNT(*) AS cnt " +
            "FROM weakness_report_weak_concepts wc " +
            "JOIN weakness_report wr ON wc.weakness_report_id = wr.id " +
            "WHERE wr.course_id = :courseId AND wr.analysis_status = 'COMPLETED' " +
            "GROUP BY concept " +
            "ORDER BY cnt DESC",
            nativeQuery = true)
    List<Object[]> findTopConceptsByCourseId(@Param("courseId") Long courseId);
}
