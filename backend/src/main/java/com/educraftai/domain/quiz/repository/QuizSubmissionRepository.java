package com.educraftai.domain.quiz.repository;

import com.educraftai.domain.quiz.entity.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    Optional<QuizSubmission> findByQuizIdAndStudentId(Long quizId, Long studentId);
    boolean existsByQuizIdAndStudentId(Long quizId, Long studentId);
    List<QuizSubmission> findByStudentId(Long studentId);
    List<QuizSubmission> findByQuizId(Long quizId);
}
