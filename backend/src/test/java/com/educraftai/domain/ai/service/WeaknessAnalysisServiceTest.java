package com.educraftai.domain.ai.service;

import com.educraftai.domain.ai.entity.WeaknessReport;
import com.educraftai.domain.ai.repository.WeaknessReportRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.infra.ai.AiClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

/**
 * {@link WeaknessAnalysisService} 단위 테스트.
 * <p>AI 호출 경로는 실제로 타지 않고 {@link AiClient}를 목킹하며,
 * PENDING 상태 레코드 생성, 중복 방지, 오답 0건 시 스킵 등 핵심 정책을 검증.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("WeaknessAnalysisService 단위 테스트")
class WeaknessAnalysisServiceTest {

    private WeaknessAnalysisService service;

    @Mock private WeaknessReportRepository weaknessReportRepository;
    @Mock private QuizSubmissionRepository quizSubmissionRepository;
    @Mock private AiClient aiClient;

    @BeforeEach
    void setUp() {
        service = new WeaknessAnalysisService(
                weaknessReportRepository, quizSubmissionRepository, aiClient, new ObjectMapper());
    }

    @Nested
    @DisplayName("createPendingAndAnalyzeAsync")
    class CreatePending {

        @Test
        @DisplayName("오답이 0개면 분석 생략 — 레코드 생성 안 됨")
        void skipWhenNoIncorrect() {
            service.createPendingAndAnalyzeAsync(1L, 10L, 100L, 0);

            then(weaknessReportRepository).should(never()).save(any());
        }

        @Test
        @DisplayName("이미 동일 submission 리포트가 있으면 중복 생성 안 됨")
        void skipWhenAlreadyExists() {
            given(weaknessReportRepository.findByQuizSubmissionId(100L))
                    .willReturn(Optional.of(WeaknessReport.builder().build()));

            service.createPendingAndAnalyzeAsync(1L, 10L, 100L, 3);

            then(weaknessReportRepository).should(never()).save(any());
        }

        @Test
        @DisplayName("오답 있고 리포트 없을 때 PENDING 레코드 저장")
        void savesPendingRecord() {
            given(weaknessReportRepository.findByQuizSubmissionId(100L)).willReturn(Optional.empty());
            org.mockito.ArgumentCaptor<WeaknessReport> captor = org.mockito.ArgumentCaptor.forClass(WeaknessReport.class);
            given(weaknessReportRepository.save(any(WeaknessReport.class)))
                    .willAnswer(inv -> inv.getArgument(0));

            service.createPendingAndAnalyzeAsync(1L, 10L, 100L, 3);

            then(weaknessReportRepository).should().save(captor.capture());
            WeaknessReport saved = captor.getValue();
            assertThat(saved.getUserId()).isEqualTo(1L);
            assertThat(saved.getCourseId()).isEqualTo(10L);
            assertThat(saved.getQuizSubmissionId()).isEqualTo(100L);
            assertThat(saved.getIncorrectQuestionCount()).isEqualTo(3);
            assertThat(saved.getAnalysisStatus()).isEqualTo(WeaknessReport.AnalysisStatus.PENDING);
        }
    }

    @Nested
    @DisplayName("조회 API")
    class Queries {

        @Test
        @DisplayName("본인 submission의 리포트 조회 성공")
        void getByQuizSubmission_ownReport() {
            WeaknessReport report = WeaknessReport.builder()
                    .userId(1L).courseId(10L).quizSubmissionId(100L).build();
            given(weaknessReportRepository.findByQuizSubmissionId(100L)).willReturn(Optional.of(report));

            var info = service.getByQuizSubmission(1L, 100L);

            assertThat(info.getQuizSubmissionId()).isEqualTo(100L);
            assertThat(info.getAnalysisStatus()).isEqualTo("PENDING");
        }

        @Test
        @DisplayName("타인 submission 리포트는 WEAKNESS_REPORT_NOT_FOUND")
        void getByQuizSubmission_notOwner() {
            WeaknessReport report = WeaknessReport.builder()
                    .userId(999L).courseId(10L).quizSubmissionId(100L).build();
            given(weaknessReportRepository.findByQuizSubmissionId(100L)).willReturn(Optional.of(report));

            assertThatThrownBy(() -> service.getByQuizSubmission(1L, 100L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.WEAKNESS_REPORT_NOT_FOUND);
        }

        @Test
        @DisplayName("존재하지 않는 submission 리포트는 WEAKNESS_REPORT_NOT_FOUND")
        void getByQuizSubmission_notFound() {
            given(weaknessReportRepository.findByQuizSubmissionId(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> service.getByQuizSubmission(1L, 999L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.WEAKNESS_REPORT_NOT_FOUND);
        }
    }
}
