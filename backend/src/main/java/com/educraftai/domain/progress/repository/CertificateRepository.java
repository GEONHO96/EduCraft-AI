package com.educraftai.domain.progress.repository;

import com.educraftai.domain.progress.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);

    List<Certificate> findByUserIdOrderByIssuedAtDesc(Long userId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    long countByCourseId(Long courseId);
}
