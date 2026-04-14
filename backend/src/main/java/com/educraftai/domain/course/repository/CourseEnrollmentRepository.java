package com.educraftai.domain.course.repository;

import com.educraftai.domain.course.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    List<CourseEnrollment> findByStudentId(Long studentId);
    long countByStudentId(Long studentId);
    Optional<CourseEnrollment> findByCourseIdAndStudentId(Long courseId, Long studentId);
    boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);
    List<CourseEnrollment> findByCourseId(Long courseId);

    /** 강의별 수강생 수 */
    long countByCourseId(Long courseId);

    /** 여러 강의의 총 수강생 수 (N+1 방지) */
    @Query("SELECT COUNT(e) FROM CourseEnrollment e WHERE e.course.id IN :courseIds")
    long countByCourseIdIn(@Param("courseIds") List<Long> courseIds);

    /** 여러 강의별 수강생 수 (배치 조회) */
    @Query("SELECT e.course.id, COUNT(e) FROM CourseEnrollment e WHERE e.course.id IN :ids GROUP BY e.course.id")
    List<Object[]> countGroupByCourseIds(@Param("ids") List<Long> ids);

    /** 특정 학생이 수강 중인 강의 ID 목록 (배치 조회) */
    @Query("SELECT e.course.id FROM CourseEnrollment e WHERE e.student.id = :studentId AND e.course.id IN :courseIds")
    List<Long> findEnrolledCourseIds(@Param("studentId") Long studentId, @Param("courseIds") List<Long> courseIds);
}
