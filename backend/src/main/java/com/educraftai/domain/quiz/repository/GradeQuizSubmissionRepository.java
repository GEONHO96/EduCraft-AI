package com.educraftai.domain.quiz.repository;

import com.educraftai.domain.quiz.entity.GradeQuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeQuizSubmissionRepository extends JpaRepository<GradeQuizSubmission, Long> {
    List<GradeQuizSubmission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
}
