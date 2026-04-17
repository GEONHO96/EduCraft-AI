package com.educraftai.domain.curriculum.controller;

import com.educraftai.domain.curriculum.dto.CurriculumRequest;
import com.educraftai.domain.curriculum.dto.CurriculumResponse;
import com.educraftai.domain.curriculum.service.CurriculumService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 커리큘럼(주차별 수업) 관리 API 컨트롤러.
 *
 * <p>URL 구조: 강의 하위 커리큘럼 조회는 {@code /api/courses/{courseId}/curriculums},
 * 커리큘럼 단건 수정·삭제는 {@code /api/curriculums/{curriculumId}}.
 */
@RestController
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;

    /** 특정 강의의 커리큘럼 목록 조회 */
    @GetMapping("/api/courses/{courseId}/curriculums")
    public ApiResponse<List<CurriculumResponse.Info>> getCurriculums(@PathVariable Long courseId) {
        return ApiResponse.ok(curriculumService.getCurriculums(courseId));
    }

    /** 커리큘럼 수정 (선생님 전용 — 해당 강의 소유자 검증) */
    @PutMapping("/api/curriculums/{curriculumId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<CurriculumResponse.Info> updateCurriculum(@CurrentUserId Long userId,
                                                                 @PathVariable Long curriculumId,
                                                                 @Valid @RequestBody CurriculumRequest.Update request) {
        return ApiResponse.ok(curriculumService.updateCurriculum(curriculumId, userId, request));
    }

    /** 커리큘럼 삭제 (선생님 전용 — 해당 강의 소유자 검증) */
    @DeleteMapping("/api/curriculums/{curriculumId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<Void> deleteCurriculum(@CurrentUserId Long userId, @PathVariable Long curriculumId) {
        curriculumService.deleteCurriculum(curriculumId, userId);
        return ApiResponse.ok();
    }
}
