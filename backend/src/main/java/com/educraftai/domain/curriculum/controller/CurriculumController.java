package com.educraftai.domain.curriculum.controller;

import com.educraftai.domain.curriculum.dto.CurriculumRequest;
import com.educraftai.domain.curriculum.dto.CurriculumResponse;
import com.educraftai.domain.curriculum.service.CurriculumService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;

    @GetMapping("/courses/{courseId}/curriculums")
    public ApiResponse<List<CurriculumResponse.Info>> getCurriculums(@PathVariable Long courseId) {
        return ApiResponse.ok(curriculumService.getCurriculums(courseId));
    }

    @PutMapping("/curriculums/{curriculumId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<CurriculumResponse.Info> updateCurriculum(
            @PathVariable Long curriculumId,
            @Valid @RequestBody CurriculumRequest.Update request) {
        return ApiResponse.ok(curriculumService.updateCurriculum(curriculumId, AuthUtil.getCurrentUserId(), request));
    }

    @DeleteMapping("/curriculums/{curriculumId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<Void> deleteCurriculum(@PathVariable Long curriculumId) {
        curriculumService.deleteCurriculum(curriculumId, AuthUtil.getCurrentUserId());
        return ApiResponse.ok();
    }
}
