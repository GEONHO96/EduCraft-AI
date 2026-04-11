package com.educraftai.domain.batch.controller;

import com.educraftai.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchController {

    private final JobLauncher jobLauncher;
    private final Job dailyLearningStatsJob;
    private final Job dailyAiUsageStatsJob;
    private final Job inactiveStudentDetectionJob;

    @PostMapping("/run/{jobName}")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<Map<String, String>> runJob(@PathVariable String jobName) {
        try {
            Job job = switch (jobName) {
                case "learning-stats" -> dailyLearningStatsJob;
                case "ai-usage-stats" -> dailyAiUsageStatsJob;
                case "inactive-students" -> inactiveStudentDetectionJob;
                default -> throw new IllegalArgumentException("존재하지 않는 배치 작업: " + jobName);
            };

            log.info("[Batch API] 수동 배치 실행 요청 - job: {}", jobName);

            jobLauncher.run(job, new JobParametersBuilder()
                    .addString("executionTime", LocalDateTime.now().toString())
                    .toJobParameters());

            return ApiResponse.ok(Map.of(
                    "job", jobName,
                    "status", "COMPLETED",
                    "executedAt", LocalDateTime.now().toString()
            ));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("BATCH_001", e.getMessage());
        } catch (Exception e) {
            log.error("[Batch API] 배치 실행 실패 - job: {}", jobName, e);
            return ApiResponse.error("BATCH_002", "배치 실행 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
