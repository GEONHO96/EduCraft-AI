package com.educraftai.domain.batch.job;

import com.educraftai.domain.ai.entity.AiGenerationLog;
import com.educraftai.domain.ai.repository.AiGenerationLogRepository;
import com.educraftai.domain.batch.entity.DailyAiUsageStats;
import com.educraftai.domain.batch.repository.DailyAiUsageStatsRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DailyAiUsageStatsJobConfig {

    private final UserRepository userRepository;
    private final AiGenerationLogRepository aiLogRepository;
    private final DailyAiUsageStatsRepository statsRepository;

    @Bean
    public Job dailyAiUsageStatsJob(JobRepository jobRepository, Step aiUsageStatsStep) {
        return new JobBuilder("dailyAiUsageStatsJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(aiUsageStatsStep)
                .build();
    }

    @Bean
    public Step aiUsageStatsStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("aiUsageStatsStep", jobRepository)
                .tasklet(aiUsageStatsTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet aiUsageStatsTasklet() {
        return (contribution, chunkContext) -> {
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

            List<User> teachers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.TEACHER)
                    .toList();

            log.info("[Batch] 일일 AI 사용 통계 집계 시작 - 날짜: {}, 교강사 수: {}", today, teachers.size());

            int processed = 0;
            for (User teacher : teachers) {
                List<AiGenerationLog> logs = aiLogRepository.findByTeacherId(teacher.getId()).stream()
                        .filter(l -> l.getCreatedAt() != null
                                && !l.getCreatedAt().isBefore(startOfDay)
                                && l.getCreatedAt().isBefore(endOfDay))
                        .toList();

                if (logs.isEmpty()) continue;

                int curriculumCount = (int) logs.stream().filter(l -> "CURRICULUM".equals(l.getResultType())).count();
                int materialCount = (int) logs.stream().filter(l -> "MATERIAL".equals(l.getResultType())).count();
                int quizCount = (int) logs.stream().filter(l -> "QUIZ".equals(l.getResultType())).count();
                int totalTimeSaved = logs.stream()
                        .mapToInt(l -> l.getTimeSavedSeconds() != null ? l.getTimeSavedSeconds() : 0)
                        .sum();

                DailyAiUsageStats stats = statsRepository
                        .findByTeacherIdAndStatsDate(teacher.getId(), today)
                        .orElse(DailyAiUsageStats.builder()
                                .teacherId(teacher.getId())
                                .statsDate(today)
                                .build());

                stats.setGenerationCount(logs.size());
                stats.setCurriculumCount(curriculumCount);
                stats.setMaterialCount(materialCount);
                stats.setQuizCount(quizCount);
                stats.setTotalTimeSavedSeconds(totalTimeSaved);

                statsRepository.save(stats);
                processed++;
            }

            log.info("[Batch] 일일 AI 사용 통계 집계 완료 - 처리된 교강사: {}", processed);
            return RepeatStatus.FINISHED;
        };
    }
}
