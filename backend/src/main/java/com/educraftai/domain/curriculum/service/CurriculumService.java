package com.educraftai.domain.curriculum.service;

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

/**
 * 커리큘럼(주차) 관리 서비스.
 * <p>조회는 읽기 트랜잭션, 수정·삭제는 쓰기 트랜잭션으로 처리한다.
 * 수정·삭제는 {@link #assertOwner(Curriculum, Long)}로 소유자 검증을 통과해야 한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;

    /** 강의의 커리큘럼 목록 (주차 오름차순) */
    public List<CurriculumResponse.Info> getCurriculums(Long courseId) {
        return curriculumRepository.findByCourseIdOrderByWeekNumber(courseId).stream()
                .map(CurriculumResponse.Info::from)
                .toList();
    }

    /** 커리큘럼 수정 (소유자만) */
    @Transactional
    public CurriculumResponse.Info updateCurriculum(Long curriculumId, Long userId, CurriculumRequest.Update request) {
        Curriculum curriculum = findCurriculum(curriculumId);
        assertOwner(curriculum, userId);

        curriculum.setWeekNumber(request.getWeekNumber());
        curriculum.setTopic(request.getTopic());
        curriculum.setObjectives(request.getObjectives());
        curriculum.setContentJson(request.getContentJson());

        return CurriculumResponse.Info.from(curriculum);
    }

    /** 커리큘럼 삭제 (소유자만) */
    @Transactional
    public void deleteCurriculum(Long curriculumId, Long userId) {
        Curriculum curriculum = findCurriculum(curriculumId);
        assertOwner(curriculum, userId);
        curriculumRepository.delete(curriculum);
    }

    // ─── 내부 헬퍼 ───

    private Curriculum findCurriculum(Long curriculumId) {
        return curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CURRICULUM_NOT_FOUND));
    }

    private void assertOwner(Curriculum curriculum, Long userId) {
        if (!curriculum.getCourse().getTeacher().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_COURSE_OWNER);
        }
    }
}
