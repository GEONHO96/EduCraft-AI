package com.educraftai.domain.quiz.repository;

import com.educraftai.domain.quiz.entity.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    Optional<QuizSubmission> findByQuizIdAndStudentId(Long quizId, Long studentId);
    boolean existsByQuizIdAndStudentId(Long quizId, Long studentId);
    List<QuizSubmission> findByStudentId(Long studentId);
    List<QuizSubmission> findByQuizId(Long quizId);

    /** 학생별 제출 수 */
    long countByStudentId(Long studentId);

    /** 최근 10건 조회 (대시보드용) */
    List<QuizSubmission> findTop10ByStudentIdOrderBySubmittedAtDesc(Long studentId);

    /** 학생별 평균 정답률(%) - DB 집계 */
    @Query("SELECT COALESCE(AVG(s.score * 100.0 / s.totalQuestions), 0) FROM QuizSubmission s WHERE s.student.id = :studentId")
    Double getAverageScorePercentByStudentId(@Param("studentId") Long studentId);
}
