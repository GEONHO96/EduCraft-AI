package com.educraftai.domain.batch.job;

import com.educraftai.domain.batch.entity.DailyLearningStats;
import com.educraftai.domain.batch.repository.DailyLearningStatsRepository;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
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
public class DailyLearningStatsJobConfig {

    private final UserRepository userRepository;
    private final QuizSubmissionRepository submissionRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final DailyLearningStatsRepository statsRepository;

    @Bean
    public Job dailyLearningStatsJob(JobRepository jobRepository, Step learningStatsStep) {
        return new JobBuilder("dailyLearningStatsJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(learningStatsStep)
                .build();
    }

    @Bean
    public Step learningStatsStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("learningStatsStep", jobRepository)
                .tasklet(learningStatsTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet learningStatsTasklet() {
        return (contribution, chunkContext) -> {
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.STUDENT)
                    .toList();

            log.info("[Batch] 일일 학습 통계 집계 시작 - 날짜: {}, 학생 수: {}", today, students.size());

            int processed = 0;
            for (User student : students) {
                var submissions = submissionRepository.findByStudentId(student.getId()).stream()
                        .filter(s -> s.getSubmittedAt() != null
                                && !s.getSubmittedAt().isBefore(startOfDay)
                                && s.getSubmittedAt().isBefore(endOfDay))
                        .toList();

                if (submissions.isEmpty()) continue;

                int totalScore = submissions.stream().mapToInt(s -> s.getScore()).sum();
                int totalQuestions = submissions.stream().mapToInt(s -> s.getTotalQuestions()).sum();
                double avgScore = totalQuestions > 0 ? (double) totalScore / totalQuestions * 100 : 0;
                int enrolledCourses = enrollmentRepository.findByStudentId(student.getId()).size();

                DailyLearningStats stats = statsRepository
                        .findByStudentIdAndStatsDate(student.getId(), today)
                        .orElse(DailyLearningStats.builder()
                                .studentId(student.getId())
                                .statsDate(today)
                                .build());

                stats.setQuizzesCompleted(submissions.size());
                stats.setTotalScore(totalScore);
                stats.setTotalQuestions(totalQuestions);
                stats.setAverageScore(Math.round(avgScore * 10.0) / 10.0);
                stats.setEnrolledCourses(enrolledCourses);

                statsRepository.save(stats);
                processed++;
            }

            log.info("[Batch] 일일 학습 통계 집계 완료 - 처리된 학생: {}", processed);
            return RepeatStatus.FINISHED;
        };
    }
}
