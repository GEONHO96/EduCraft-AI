package com.educraftai.domain.quiz.repository;

import com.educraftai.domain.quiz.entity.GradeQuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GradeQuizSubmissionRepository extends JpaRepository<GradeQuizSubmission, Long> {
    List<GradeQuizSubmission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);

    /** 학생별 제출 수 */
    long countByStudentId(Long studentId);

    /** 최근 10건 조회 (대시보드용) */
    List<GradeQuizSubmission> findTop10ByStudentIdOrderBySubmittedAtDesc(Long studentId);

    /** 학생별 평균 정답률(%) - DB 집계 */
    @Query("SELECT COALESCE(AVG(g.score * 100.0 / g.totalQuestions), 0) FROM GradeQuizSubmission g WHERE g.student.id = :studentId")
    Double getAverageScorePercentByStudentId(@Param("studentId") Long studentId);
}
