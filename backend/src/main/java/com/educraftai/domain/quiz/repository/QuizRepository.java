package com.educraftai.domain.quiz.repository;

import com.educraftai.domain.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByMaterialId(Long materialId);

    /** 여러 강의에 속한 퀴즈 수 (N+1 방지) */
    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.material.curriculum.course.id IN :courseIds")
    long countByCourseIds(@Param("courseIds") List<Long> courseIds);

    /** 특정 강의의 퀴즈 수 — 수료 조건 판정에 사용 */
    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.material.curriculum.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);
}
