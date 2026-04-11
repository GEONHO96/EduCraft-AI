package com.educraftai.domain.course.controller;

import com.educraftai.domain.course.dto.CourseRequest;
import com.educraftai.domain.course.dto.CourseResponse;
import com.educraftai.domain.course.service.CourseService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 강의 관리 API 컨트롤러
 * 강의 생성, 조회, 수강 신청 등을 처리한다.
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    /** 강의 생성 (선생님 전용) */
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<CourseResponse.Info> createCourse(@Valid @RequestBody CourseRequest.Create request) {
        return ApiResponse.ok(courseService.createCourse(AuthUtil.getCurrentUserId(), request));
    }

    /** 내 강의 목록 조회 (선생님: 개설한 강의, 학생: 수강 중인 강의) */
    @GetMapping
    public ApiResponse<List<CourseResponse.Info>> getMyCourses() {
        return ApiResponse.ok(courseService.getMyCourses(AuthUtil.getCurrentUserId()));
    }

    /** 전체 강의 탐색 (수강생 수, 수강 여부 포함) */
    @GetMapping("/browse")
    public ApiResponse<List<CourseResponse.Browse>> browseCourses(
            @RequestParam(required = false) String keyword) {
        Long userId = AuthUtil.getCurrentUserId();
        if (keyword != null && !keyword.isBlank()) {
            return ApiResponse.ok(courseService.searchCourses(keyword, userId));
        }
        return ApiResponse.ok(courseService.browseAllCourses(userId));
    }

    /** 강의 단건 조회 */
    @GetMapping("/{courseId}")
    public ApiResponse<CourseResponse.Info> getCourse(@PathVariable Long courseId) {
        return ApiResponse.ok(courseService.getCourse(courseId));
    }

    /** 수강 신청 (학생 전용) */
    @PostMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<Void> enrollStudent(@PathVariable Long courseId) {
        courseService.enrollStudent(courseId, AuthUtil.getCurrentUserId());
        return ApiResponse.ok();
    }
}
