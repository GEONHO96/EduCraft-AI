package com.educraftai.domain.monitoring.controller;

import com.educraftai.domain.ai.dto.WeaknessReportResponse;
import com.educraftai.domain.monitoring.dto.MonitoringResponse;
import com.educraftai.domain.monitoring.service.TeacherMonitoringService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 교사 학생 모니터링 API.
 * <p>담당 강의의 반 학생 진도, 비활성 학생, 공통 약점 TOP N을 한데 모아 제공.
 * 모든 엔드포인트는 TEACHER 권한 필수 + 서비스 계층에서 담당 강의 소유자 검증.
 */
@RestController
@RequestMapping("/api/teacher/monitoring")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherMonitoringController {

    private final TeacherMonitoringService teacherMonitoringService;

    /** 반 요약 카드 (학생 수, 평균 진도율, 수료 인원, 비활성 인원) */
    @GetMapping("/courses/{courseId}/summary")
    public ApiResponse<MonitoringResponse.CourseSummary> getCourseSummary(@CurrentUserId Long userId,
                                                                          @PathVariable Long courseId) {
        return ApiResponse.ok(teacherMonitoringService.getCourseSummary(userId, courseId));
    }

    /** 반 학생별 진도 상세 테이블 */
    @GetMapping("/courses/{courseId}/students")
    public ApiResponse<List<MonitoringResponse.StudentProgress>> getStudentProgressList(@CurrentUserId Long userId,
                                                                                        @PathVariable Long courseId) {
        return ApiResponse.ok(teacherMonitoringService.getStudentProgressList(userId, courseId));
    }

    /** 반 공통 약점 TOP N (기본 5개) */
    @GetMapping("/courses/{courseId}/weaknesses/top")
    public ApiResponse<List<WeaknessReportResponse.TopConcept>> getWeaknessTop(@CurrentUserId Long userId,
                                                                               @PathVariable Long courseId,
                                                                               @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.ok(teacherMonitoringService.getCourseWeaknessTop(userId, courseId, limit));
    }
}
