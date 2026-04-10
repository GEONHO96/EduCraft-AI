package com.educraftai.domain.quiz.repository;

import com.educraftai.domain.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByMaterialId(Long materialId);
}
