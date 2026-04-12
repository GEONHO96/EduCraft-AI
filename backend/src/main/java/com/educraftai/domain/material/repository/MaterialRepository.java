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
}
