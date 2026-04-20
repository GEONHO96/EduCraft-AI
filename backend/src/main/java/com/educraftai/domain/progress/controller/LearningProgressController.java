package com.educraftai.domain.progress.controller;

import com.educraftai.domain.progress.dto.CertificateResponse;
import com.educraftai.domain.progress.dto.LearningProgressResponse;
import com.educraftai.domain.progress.service.CertificateService;
import com.educraftai.domain.progress.service.LearningProgressService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 학습 진도 & 수료증 API 컨트롤러 (학생 본인 관점).
 * <p>교사용 모니터링 엔드포인트는 {@code TeacherMonitoringController}에 분리된다.
 */
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class LearningProgressController {

    private final LearningProgressService progressService;
    private final CertificateService certificateService;

    // ─── 자료 완료 체크 ───

    /** 자료 완료 체크 (토글 방식 아님 — 별도 DELETE로 해제) */
    @PostMapping("/materials/{materialId}/complete")
    public ApiResponse<LearningProgressResponse.Info> completeMaterial(@CurrentUserId Long userId,
                                                                       @PathVariable Long materialId) {
        return ApiResponse.ok(progressService.completeMaterial(userId, materialId));
    }

    /** 자료 완료 체크 해제 */
    @DeleteMapping("/materials/{materialId}/complete")
    public ApiResponse<LearningProgressResponse.Info> uncompleteMaterial(@CurrentUserId Long userId,
                                                                         @PathVariable Long materialId) {
        return ApiResponse.ok(progressService.uncompleteMaterial(userId, materialId));
    }

    // ─── 진도 조회 ───

    /** 특정 코스 진도 상세 (완료 자료 ID 집합 포함) */
    @GetMapping("/courses/{courseId}")
    public ApiResponse<LearningProgressResponse.Info> getCourseProgress(@CurrentUserId Long userId,
                                                                        @PathVariable Long courseId) {
        return ApiResponse.ok(progressService.getCourseProgress(userId, courseId));
    }

    /** 수강 중인 전체 코스의 진도 요약 리스트 */
    @GetMapping("/me")
    public ApiResponse<List<LearningProgressResponse.Summary>> getMyProgressList(@CurrentUserId Long userId) {
        return ApiResponse.ok(progressService.getMyProgressList(userId));
    }

    // ─── 수료증 ───

    /** 내 수료증 목록 (최근 발급순) */
    @GetMapping("/certificates")
    public ApiResponse<List<CertificateResponse.Info>> getMyCertificates(@CurrentUserId Long userId) {
        return ApiResponse.ok(certificateService.getMyCertificates(userId));
    }

    /** 수료증 단건 조회 (본인 소유 검증) */
    @GetMapping("/certificates/{certificateNumber}")
    public ApiResponse<CertificateResponse.Info> getCertificate(@CurrentUserId Long userId,
                                                                @PathVariable String certificateNumber) {
        return ApiResponse.ok(certificateService.getByCertificateNumber(userId, certificateNumber));
    }
}
