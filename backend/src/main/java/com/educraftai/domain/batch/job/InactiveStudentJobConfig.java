package com.educraftai.domain.batch.job;

import com.educraftai.domain.course.entity.CourseEnrollment;
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

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class InactiveStudentJobConfig {

    private final UserRepository userRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final QuizSubmissionRepository submissionRepository;

    @Bean
    public Job inactiveStudentDetectionJob(JobRepository jobRepository, Step inactiveStudentStep) {
        return new JobBuilder("inactiveStudentDetectionJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(inactiveStudentStep)
                .build();
    }

    @Bean
    public Step inactiveStudentStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("inactiveStudentStep", jobRepository)
                .tasklet(inactiveStudentTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet inactiveStudentTasklet() {
        return (contribution, chunkContext) -> {
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.STUDENT)
                    .toList();

            log.info("[Batch] 비활성 수강생 감지 시작 - 기준: 7일 미활동, 대상 학생 수: {}", students.size());

            int inactiveCount = 0;
            for (User student : students) {
                List<CourseEnrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
                if (enrollments.isEmpty()) continue;

                var submissions = submissionRepository.findByStudentId(student.getId());
                boolean hasRecentActivity = submissions.stream()
                        .anyMatch(s -> s.getSubmittedAt() != null && s.getSubmittedAt().isAfter(sevenDaysAgo));

                if (!hasRecentActivity) {
                    inactiveCount++;
                    log.info("[Batch] 비활성 수강생 감지 - 학생ID: {}, 이름: {}, 수강 강의 수: {}",
                            student.getId(), student.getName(), enrollments.size());
                }
            }

            log.info("[Batch] 비활성 수강생 감지 완료 - 비활성 학생: {}명", inactiveCount);
            return RepeatStatus.FINISHED;
        };
    }
}
