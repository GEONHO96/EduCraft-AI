package com.educraftai.domain.course.repository;

import com.educraftai.domain.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);

    /** 전체 강의 목록 (최신순) */
    List<Course> findAllByOrderByCreatedAtDesc();

    /** 과목별 강의 검색 */
    List<Course> findBySubjectContainingIgnoreCaseOrderByCreatedAtDesc(String subject);

    /** 제목 또는 과목으로 검색 */
    List<Course> findByTitleContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrderByCreatedAtDesc(String title, String subject);
}
