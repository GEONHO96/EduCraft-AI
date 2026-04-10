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

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<CourseResponse.Info> createCourse(@Valid @RequestBody CourseRequest.Create request) {
        return ApiResponse.ok(courseService.createCourse(AuthUtil.getCurrentUserId(), request));
    }

    @GetMapping
    public ApiResponse<List<CourseResponse.Info>> getMyCourses() {
        return ApiResponse.ok(courseService.getMyCourses(AuthUtil.getCurrentUserId()));
    }

    @GetMapping("/{courseId}")
    public ApiResponse<CourseResponse.Info> getCourse(@PathVariable Long courseId) {
        return ApiResponse.ok(courseService.getCourse(courseId));
    }

    @PostMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<Void> enrollStudent(@PathVariable Long courseId) {
        courseService.enrollStudent(courseId, AuthUtil.getCurrentUserId());
        return ApiResponse.ok();
    }
}
