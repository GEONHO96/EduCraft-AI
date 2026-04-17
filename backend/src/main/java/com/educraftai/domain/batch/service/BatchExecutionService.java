package com.educraftai.domain.batch.service;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 배치 잡 수동 실행 서비스.
 *
 * <p>이전에는 {@code BatchController}가 JobLauncher와 Job들을 직접 주입받고
 * switch 분기, JobParameters 조립, 예외 처리를 모두 수행했다. 컨트롤러 책임을 벗어나므로
 * 비즈니스 로직을 이 서비스로 이관하고, 예외도 {@link BusinessException}으로 통일한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchExecutionService {

    private final JobLauncher jobLauncher;
    private final Job dailyLearningStatsJob;
    private final Job dailyAiUsageStatsJob;
    private final Job inactiveStudentDetectionJob;

    /**
     * 잡 이름으로 배치 작업을 즉시 실행하고 실행 요약을 반환한다.
     *
     * @throws BusinessException {@link ErrorCode#BATCH_JOB_NOT_FOUND} 알 수 없는 jobName
     * @throws BusinessException {@link ErrorCode#BATCH_JOB_FAILED} 실행 중 에러
     */
    public Map<String, String> runJob(String jobName) {
        Job job = resolveJob(jobName);
        log.info("[Batch] 수동 배치 실행 요청 - job: {}", jobName);

        try {
            jobLauncher.run(job, new JobParametersBuilder()
                    .addString("executionTime", LocalDateTime.now().toString())
                    .toJobParameters());
        } catch (Exception e) {
            log.error("[Batch] 실행 실패 - job: {}", jobName, e);
            throw new BusinessException(ErrorCode.BATCH_JOB_FAILED);
        }

        return Map.of(
                "job", jobName,
                "status", "COMPLETED",
                "executedAt", LocalDateTime.now().toString()
        );
    }

    private Job resolveJob(String jobName) {
        return switch (jobName) {
            case "learning-stats" -> dailyLearningStatsJob;
            case "ai-usage-stats" -> dailyAiUsageStatsJob;
            case "inactive-students" -> inactiveStudentDetectionJob;
            default -> throw new BusinessException(ErrorCode.BATCH_JOB_NOT_FOUND);
        };
    }
}
