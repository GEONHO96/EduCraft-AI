package com.educraftai.domain.curriculum.service;

import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.curriculum.dto.CurriculumRequest;
import com.educraftai.domain.curriculum.dto.CurriculumResponse;
import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.domain.curriculum.repository.CurriculumRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final CourseRepository courseRepository;

    public List<CurriculumResponse.Info> getCurriculums(Long courseId) {
        return curriculumRepository.findByCourseIdOrderByWeekNumber(courseId).stream()
                .map(CurriculumResponse.Info::from)
                .toList();
    }

    @Transactional
    public CurriculumResponse.Info updateCurriculum(Long curriculumId, Long userId, CurriculumRequest.Update request) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CURRICULUM_NOT_FOUND));

        if (!curriculum.getCourse().getTeacher().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_COURSE_OWNER);
        }

        curriculum.setWeekNumber(request.getWeekNumber());
        curriculum.setTopic(request.getTopic());
        curriculum.setObjectives(request.getObjectives());
        curriculum.setContentJson(request.getContentJson());

        return CurriculumResponse.Info.from(curriculum);
    }

    @Transactional
    public void deleteCurriculum(Long curriculumId, Long userId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CURRICULUM_NOT_FOUND));

        if (!curriculum.getCourse().getTeacher().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_COURSE_OWNER);
        }

        curriculumRepository.delete(curriculum);
    }
}
