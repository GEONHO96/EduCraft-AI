package com.educraftai.domain.batch.controller;

import com.educraftai.domain.batch.service.BatchExecutionService;
import com.educraftai.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 배치 작업 수동 실행 API (선생님 전용).
 * <p>실제 실행 로직은 {@link BatchExecutionService}에 위임하고,
 * 예외는 {@link com.educraftai.global.exception.GlobalExceptionHandler}에서 통일 처리한다.
 */
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchController {

    private final BatchExecutionService batchExecutionService;

    /**
     * 배치 잡 실행.
     *
     * @param jobName {@code learning-stats} · {@code ai-usage-stats} · {@code inactive-students}
     */
    @PostMapping("/run/{jobName}")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<Map<String, String>> runJob(@PathVariable String jobName) {
        return ApiResponse.ok(batchExecutionService.runJob(jobName));
    }
}
