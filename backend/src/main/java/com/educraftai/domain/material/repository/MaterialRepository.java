package com.educraftai.domain.material.repository;

import com.educraftai.domain.material.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCurriculumId(Long curriculumId);
    List<Material> findByCurriculumIdAndType(Long curriculumId, Material.MaterialType type);
}
