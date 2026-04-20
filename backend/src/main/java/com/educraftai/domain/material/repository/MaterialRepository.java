package com.educraftai.domain.material.repository;

import com.educraftai.domain.material.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCurriculumId(Long curriculumId);
    List<Material> findByCurriculumIdAndType(Long curriculumId, Material.MaterialType type);

    /** 여러 강의에 속한 자료 수 (N+1 방지) */
    @Query("SELECT COUNT(m) FROM Material m WHERE m.curriculum.course.id IN :courseIds")
    long countByCourseIds(@Param("courseIds") List<Long> courseIds);

    /** 특정 강의의 자료 수 — 진도율 계산 분모 */
    @Query("SELECT COUNT(m) FROM Material m WHERE m.curriculum.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);

    /** 특정 자료가 해당 강의 소속인지 검증 */
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END " +
            "FROM Material m WHERE m.id = :materialId AND m.curriculum.course.id = :courseId")
    boolean existsByIdAndCourseId(@Param("materialId") Long materialId, @Param("courseId") Long courseId);

    /** 여러 커리큘럼에 속한 자료를 한 번에 배치 조회 (N+1 방지) */
    @Query("SELECT m FROM Material m WHERE m.curriculum.id IN :curriculumIds ORDER BY m.curriculum.id, m.id")
    List<Material> findByCurriculumIdIn(@Param("curriculumIds") List<Long> curriculumIds);
}
