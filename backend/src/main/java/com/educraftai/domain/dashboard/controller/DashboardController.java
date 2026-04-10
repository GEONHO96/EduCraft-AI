package com.educraftai.domain.dashboard.controller;

import com.educraftai.domain.dashboard.dto.DashboardResponse;
import com.educraftai.domain.dashboard.service.DashboardService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<DashboardResponse.TeacherDashboard> getTeacherDashboard() {
        return ApiResponse.ok(dashboardService.getTeacherDashboard(AuthUtil.getCurrentUserId()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<DashboardResponse.StudentDashboard> getStudentDashboard() {
        return ApiResponse.ok(dashboardService.getStudentDashboard(AuthUtil.getCurrentUserId()));
    }

    @GetMapping("/time-saved")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<DashboardResponse.TimeSaved> getTimeSaved() {
        return ApiResponse.ok(dashboardService.getTimeSaved(AuthUtil.getCurrentUserId()));
    }
}
