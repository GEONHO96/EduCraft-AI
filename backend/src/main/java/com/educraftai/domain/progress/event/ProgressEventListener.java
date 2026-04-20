package com.educraftai.domain.progress.event;

import com.educraftai.domain.ai.service.WeaknessAnalysisService;
import com.educraftai.domain.progress.service.LearningProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * {@link QuizSubmittedEvent}를 받아 후속 처리를 수행하는 리스너.
 *
 * <p>{@code phase = AFTER_COMMIT}로 설정해 퀴즈 제출 트랜잭션이 완전히 커밋된 뒤에만
 * 실행된다. 후속 처리(진도 갱신, 약점 분석 트리거)에서 예외가 나도 퀴즈 제출 자체는
 * 이미 커밋되어 있으므로 사용자 플로우에 영향 없음.
 *
 * <p>진도 재계산은 별도 트랜잭션({@code REQUIRES_NEW})에서 동기로 수행하여
 * 학생이 퀴즈 결과 페이지를 열 때 최신 진도율이 보이도록 한다.
 * 약점 분석은 Claude API 호출 비용 때문에 별도 {@code @Async} 스레드에서 처리.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProgressEventListener {

    private final LearningProgressService learningProgressService;
    private final WeaknessAnalysisService weaknessAnalysisService;

    /** 퀴즈 제출 후: 학습 진도율 갱신 (동기) */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onQuizSubmittedUpdateProgress(QuizSubmittedEvent event) {
        try {
            learningProgressService.applyQuizSubmission(
                    event.getUserId(), event.getCourseId(), event.getScorePercent());
        } catch (Exception e) {
            log.error("[Progress] 퀴즈 제출 기반 진도 재계산 실패 userId={} courseId={}",
                    event.getUserId(), event.getCourseId(), e);
        }
    }

    /** 퀴즈 제출 후: AI 약점 분석 트리거 (오답 있을 때만) */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onQuizSubmittedTriggerWeaknessAnalysis(QuizSubmittedEvent event) {
        try {
            weaknessAnalysisService.createPendingAndAnalyzeAsync(
                    event.getUserId(),
                    event.getCourseId(),
                    event.getQuizSubmissionId(),
                    event.getIncorrectCount()
            );
        } catch (Exception e) {
            log.error("[Weakness] 분석 트리거 실패 submissionId={}", event.getQuizSubmissionId(), e);
        }
    }
}
