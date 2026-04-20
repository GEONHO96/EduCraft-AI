package com.educraftai.domain.progress.event;

import com.educraftai.domain.progress.service.LearningProgressService;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
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
 * <p>진도 재계산은 별도 트랜잭션({@code REQUIRES_NEW})에서 수행하여
 * 리스너 안에서도 쓰기 가능.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProgressEventListener {

    private final LearningProgressService learningProgressService;
    private final QuizSubmissionRepository quizSubmissionRepository;

    /** 퀴즈 제출 후: 학습 진도율 갱신 */
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

    /**
     * {@link QuizSubmission#getQuiz()}를 통해 courseId를 안전하게 획득.
     * (이벤트에 courseId가 이미 실려 있지만, 참조용 헬퍼로 유지 — Phase 3에서 약점 분석 추가 시 확장.)
     */
    QuizSubmission findSubmission(Long submissionId) {
        return quizSubmissionRepository.findById(submissionId).orElse(null);
    }
}
