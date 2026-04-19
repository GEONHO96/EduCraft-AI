package com.educraftai.domain.batch.service;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

/**
 * {@link BatchExecutionService} 단위 테스트.
 * <p>Phase 2 리팩토링으로 BatchController에서 이관된 분기·JobLauncher 호출·예외 변환 로직을 검증한다.
 *
 * <p>주의: {@code @InjectMocks}는 Lombok {@code @RequiredArgsConstructor}와 조합 시
 * 같은 타입(Job) 필드 여러 개를 이름으로 구분하지 못한다 (컴파일러 파라미터 이름 보존 이슈).
 * 그래서 {@link #setUp()}에서 수동으로 생성자를 호출해 올바른 순서로 주입한다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("BatchExecutionService 단위 테스트")
class BatchExecutionServiceTest {

    private BatchExecutionService batchExecutionService;

    @Mock private JobLauncher jobLauncher;
    @Mock private Job dailyLearningStatsJob;
    @Mock private Job dailyAiUsageStatsJob;
    @Mock private Job inactiveStudentDetectionJob;

    @BeforeEach
    void setUp() {
        batchExecutionService = new BatchExecutionService(
                jobLauncher, dailyLearningStatsJob, dailyAiUsageStatsJob, inactiveStudentDetectionJob);
    }

    @Nested
    @DisplayName("잡 이름 분기 및 실행")
    class RunJob {

        @Test
        @DisplayName("learning-stats 호출 시 dailyLearningStatsJob을 실행한다")
        void learningStats() throws Exception {
            Map<String, String> result = batchExecutionService.runJob("learning-stats");

            assertThat(result.get("job")).isEqualTo("learning-stats");
            assertThat(result.get("status")).isEqualTo("COMPLETED");
            assertThat(result.get("executedAt")).isNotBlank();
            then(jobLauncher).should(times(1)).run(eq(dailyLearningStatsJob), any(JobParameters.class));
        }

        @Test
        @DisplayName("ai-usage-stats 호출 시 dailyAiUsageStatsJob을 실행한다")
        void aiUsageStats() throws Exception {
            batchExecutionService.runJob("ai-usage-stats");

            then(jobLauncher).should().run(eq(dailyAiUsageStatsJob), any(JobParameters.class));
        }

        @Test
        @DisplayName("inactive-students 호출 시 inactiveStudentDetectionJob을 실행한다")
        void inactiveStudents() throws Exception {
            batchExecutionService.runJob("inactive-students");

            then(jobLauncher).should().run(eq(inactiveStudentDetectionJob), any(JobParameters.class));
        }
    }

    @Nested
    @DisplayName("에러 처리")
    class ErrorHandling {

        @Test
        @DisplayName("알 수 없는 잡 이름은 BATCH_JOB_NOT_FOUND 예외를 던진다")
        void unknownJobName() {
            assertThatThrownBy(() -> batchExecutionService.runJob("does-not-exist"))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.BATCH_JOB_NOT_FOUND);
        }

        @Test
        @DisplayName("JobLauncher 실행 중 예외가 발생하면 BATCH_JOB_FAILED로 변환된다")
        void jobExecutionFailure() throws Exception {
            given(jobLauncher.run(eq(dailyLearningStatsJob), any(JobParameters.class)))
                    .willThrow(new RuntimeException("DB 연결 실패"));

            assertThatThrownBy(() -> batchExecutionService.runJob("learning-stats"))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.BATCH_JOB_FAILED);
        }
    }
}
