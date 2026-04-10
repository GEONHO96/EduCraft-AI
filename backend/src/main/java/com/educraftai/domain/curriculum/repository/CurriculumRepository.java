package com.educraftai.domain.curriculum.repository;

import com.educraftai.domain.curriculum.entity.Curriculum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CurriculumRepository extends JpaRepository<Curriculum, Long> {
    List<Curriculum> findByCourseIdOrderByWeekNumber(Long courseId);
}
