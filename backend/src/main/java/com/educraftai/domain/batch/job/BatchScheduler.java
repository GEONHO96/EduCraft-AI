package com.educraftai.domain.batch.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class BatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job dailyLearningStatsJob;
    private final Job dailyAiUsageStatsJob;
    private final Job inactiveStudentDetectionJob;

    /**
     * 매일 자정에 일일 학습 통계 집계
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void runDailyLearningStatsJob() {
        runJob(dailyLearningStatsJob, "일일 학습 통계 집계");
    }

    /**
     * 매일 새벽 1시에 AI 사용 통계 집계
     */
    @Scheduled(cron = "0 0 1 * * *")
    public void runDailyAiUsageStatsJob() {
        runJob(dailyAiUsageStatsJob, "일일 AI 사용 통계 집계");
    }

    /**
     * 매주 월요일 오전 9시에 비활성 수강생 감지
     */
    @Scheduled(cron = "0 0 9 * * MON")
    public void runInactiveStudentDetectionJob() {
        runJob(inactiveStudentDetectionJob, "비활성 수강생 감지");
    }

    private void runJob(Job job, String jobDescription) {
        try {
            log.info("[Batch Scheduler] {} 배치 시작", jobDescription);
            jobLauncher.run(job, new JobParametersBuilder()
                    .addString("executionTime", LocalDateTime.now().toString())
                    .toJobParameters());
            log.info("[Batch Scheduler] {} 배치 완료", jobDescription);
        } catch (Exception e) {
            log.error("[Batch Scheduler] {} 배치 실행 실패", jobDescription, e);
        }
    }
}
