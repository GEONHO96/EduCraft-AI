package com.educraftai.domain.dashboard.controller;

import com.educraftai.domain.dashboard.dto.DashboardResponse;
import com.educraftai.domain.dashboard.service.DashboardService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 대시보드 API 컨트롤러.
 * <p>선생님·학생 각자의 학습/운영 현황 통계를 반환한다.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /** 선생님 대시보드 — 강의 수, 수강생, AI 사용량 등 */
    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<DashboardResponse.TeacherDashboard> getTeacherDashboard(@CurrentUserId Long userId) {
        return ApiResponse.ok(dashboardService.getTeacherDashboard(userId));
    }

    /** 학생 대시보드 — 수강 강의, 퀴즈 성적, 진도 등 */
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<DashboardResponse.StudentDashboard> getStudentDashboard(@CurrentUserId Long userId) {
        return ApiResponse.ok(dashboardService.getStudentDashboard(userId));
    }

    /** AI가 절약해준 시간 집계 (선생님 전용) */
    @GetMapping("/time-saved")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<DashboardResponse.TimeSaved> getTimeSaved(@CurrentUserId Long userId) {
        return ApiResponse.ok(dashboardService.getTimeSaved(userId));
    }
}
