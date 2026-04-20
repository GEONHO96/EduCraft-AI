package com.educraftai.domain.progress.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * {@link LearningProgress} 엔티티 도메인 로직 단위 테스트.
 * <p>진도율 계산식과 수료 조건 판정이 스펙대로 동작하는지 검증.
 */
@DisplayName("LearningProgress 도메인 로직")
class LearningProgressTest {

    @Nested
    @DisplayName("자료 완료 체크 멱등성")
    class MaterialCompletion {

        @Test
        @DisplayName("새 자료 체크 시 true 반환, 카운트 증가")
        void markNew() {
            LearningProgress progress = LearningProgress.builder().build();

            boolean added = progress.markMaterialCompleted(10L);

            assertThat(added).isTrue();
            assertThat(progress.getCompletedMaterialCount()).isEqualTo(1);
            assertThat(progress.getCompletedMaterialIds()).containsExactly(10L);
        }

        @Test
        @DisplayName("이미 체크된 자료 재체크 시 false 반환, 카운트 변화 없음")
        void markDuplicate() {
            LearningProgress progress = LearningProgress.builder().build();
            progress.markMaterialCompleted(10L);

            boolean addedAgain = progress.markMaterialCompleted(10L);

            assertThat(addedAgain).isFalse();
            assertThat(progress.getCompletedMaterialCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("체크 해제 시 completedAt 초기화 (수료 취소)")
        void unmarkResetsCompletedAt() {
            LearningProgress progress = LearningProgress.builder().build();
            progress.markMaterialCompleted(10L);
            progress.markCompleted();
            assertThat(progress.getCompletedAt()).isNotNull();

            progress.unmarkMaterialCompleted(10L);

            assertThat(progress.getCompletedAt()).isNull();
        }
    }

    @Nested
    @DisplayName("진도율 계산")
    class ProgressRateCalculation {

        @Test
        @DisplayName("자료 0/10, 퀴즈 미제출 → 0%")
        void emptyProgress() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(10).completedMaterialCount(0).build();

            progress.recalculateProgressRate();

            assertThat(progress.getProgressRate()).isEqualTo(0.0);
        }

        @Test
        @DisplayName("자료 10/10, 퀴즈 미제출 → 70% (자료 70% 가중치)")
        void allMaterialsOnly() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(10).completedMaterialCount(10).build();

            progress.recalculateProgressRate();

            assertThat(progress.getProgressRate()).isEqualTo(70.0);
        }

        @Test
        @DisplayName("자료 10/10, 평균 100점 → 100%")
        void fullCompletion() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(10).completedMaterialCount(10)
                    .averageQuizScore(100.0).quizAttemptCount(1).build();

            progress.recalculateProgressRate();

            assertThat(progress.getProgressRate()).isEqualTo(100.0);
        }

        @Test
        @DisplayName("자료 5/10, 평균 80점 → 35 + 24 = 59%")
        void mixedProgress() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(10).completedMaterialCount(5)
                    .averageQuizScore(80.0).quizAttemptCount(2).build();

            progress.recalculateProgressRate();

            assertThat(progress.getProgressRate()).isEqualTo(59.0);
        }

        @Test
        @DisplayName("총 자료 수 0이면 자료 완료율은 0으로 처리")
        void zeroTotalMaterials() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(0).completedMaterialCount(0)
                    .averageQuizScore(50.0).quizAttemptCount(1).build();

            progress.recalculateProgressRate();

            // 자료는 0%, 퀴즈 0.5 * 30 = 15%
            assertThat(progress.getProgressRate()).isEqualTo(15.0);
        }
    }

    @Nested
    @DisplayName("퀴즈 결과 반영")
    class QuizApplication {

        @Test
        @DisplayName("첫 퀴즈 제출 → 평균 = 점수, 시도 수 1")
        void firstQuiz() {
            LearningProgress progress = LearningProgress.builder().build();

            progress.applyQuizResult(80.0);

            assertThat(progress.getAverageQuizScore()).isEqualTo(80.0);
            assertThat(progress.getQuizAttemptCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("두 번째 퀴즈 제출 → 누적 평균으로 갱신")
        void secondQuiz() {
            LearningProgress progress = LearningProgress.builder().build();
            progress.applyQuizResult(80.0);
            progress.applyQuizResult(60.0);

            assertThat(progress.getAverageQuizScore()).isEqualTo(70.0);
            assertThat(progress.getQuizAttemptCount()).isEqualTo(2);
        }
    }

    @Nested
    @DisplayName("수료 조건 판정")
    class CompletionRequirements {

        @Test
        @DisplayName("자료 100% + 평균 60+ + 퀴즈 1회 이상 시도 → 수료")
        void meetsAll() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(5).completedMaterialCount(5)
                    .averageQuizScore(75.0).quizAttemptCount(2).build();

            assertThat(progress.meetsCompletionRequirements(2)).isTrue();
        }

        @Test
        @DisplayName("자료 미완료 시 수료 조건 불만족")
        void materialIncomplete() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(5).completedMaterialCount(4)
                    .averageQuizScore(90.0).quizAttemptCount(2).build();

            assertThat(progress.meetsCompletionRequirements(2)).isFalse();
        }

        @Test
        @DisplayName("평균 60 미만이면 수료 조건 불만족")
        void scoreTooLow() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(5).completedMaterialCount(5)
                    .averageQuizScore(59.9).quizAttemptCount(2).build();

            assertThat(progress.meetsCompletionRequirements(2)).isFalse();
        }

        @Test
        @DisplayName("퀴즈 시도 수가 요구치 미달이면 수료 조건 불만족")
        void quizAttemptsTooFew() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(5).completedMaterialCount(5)
                    .averageQuizScore(80.0).quizAttemptCount(1).build();

            assertThat(progress.meetsCompletionRequirements(3)).isFalse();
        }

        @Test
        @DisplayName("코스에 퀴즈가 0개면 자료 100%만으로 수료 가능")
        void noQuizzesInCourse() {
            LearningProgress progress = LearningProgress.builder()
                    .totalMaterialCount(5).completedMaterialCount(5).build();

            assertThat(progress.meetsCompletionRequirements(0)).isTrue();
        }
    }
}
