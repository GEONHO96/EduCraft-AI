package com.educraftai.domain.course.repository;

import com.educraftai.domain.course.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    List<CourseEnrollment> findByStudentId(Long studentId);
    Optional<CourseEnrollment> findByCourseIdAndStudentId(Long courseId, Long studentId);
    boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);
    List<CourseEnrollment> findByCourseId(Long courseId);

    /** 강의별 수강생 수 */
    long countByCourseId(Long courseId);
}
