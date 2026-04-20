package com.educraftai.domain.ai.controller;

import com.educraftai.domain.ai.dto.WeaknessReportResponse;
import com.educraftai.domain.ai.service.WeaknessAnalysisService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI 오답노트 & 약점 분석 API 컨트롤러 (학생 관점).
 * <p>교사용 반 통계 엔드포인트는 {@code TeacherMonitoringController}에 분리된다.
 */
@RestController
@RequestMapping("/api/weakness")
@RequiredArgsConstructor
public class WeaknessReportController {

    private final WeaknessAnalysisService weaknessAnalysisService;

    /**
     * 특정 퀴즈 제출의 약점 리포트 조회.
     * <p>프론트엔드는 이 엔드포인트를 3초 간격으로 폴링하면서
     * {@code analysisStatus}가 PENDING → COMPLETED/FAILED 로 전이되는 것을 감지한다.
     */
    @GetMapping("/submissions/{quizSubmissionId}")
    public ApiResponse<WeaknessReportResponse.Info> getBySubmission(@CurrentUserId Long userId,
                                                                    @PathVariable Long quizSubmissionId) {
        return ApiResponse.ok(weaknessAnalysisService.getByQuizSubmission(userId, quizSubmissionId));
    }

    /** 내 약점 리포트 전체 (최근순) */
    @GetMapping("/me")
    public ApiResponse<List<WeaknessReportResponse.Info>> getMyReports(@CurrentUserId Long userId) {
        return ApiResponse.ok(weaknessAnalysisService.getMyReports(userId));
    }

    /** 특정 코스의 내 약점 리포트 이력 */
    @GetMapping("/me/courses/{courseId}")
    public ApiResponse<List<WeaknessReportResponse.Info>> getMyReportsByCourse(@CurrentUserId Long userId,
                                                                               @PathVariable Long courseId) {
        return ApiResponse.ok(weaknessAnalysisService.getMyReportsByCourse(userId, courseId));
    }
}
