package com.educraftai.domain.progress.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 퀴즈 제출이 완료되었음을 알리는 도메인 이벤트.
 *
 * <p>{@link com.educraftai.domain.quiz.service.QuizService#submitQuiz} 종료 시
 * 발행되며, {@code @TransactionalEventListener(phase = AFTER_COMMIT)}이 이를 받아서
 * 학습 진도 재계산 및 약점 분석 트리거를 수행한다.
 *
 * <p>트랜잭션 분리: 퀴즈 제출 트랜잭션이 커밋된 이후에만 후속 처리가 일어나므로,
 * 후속 작업 실패가 퀴즈 제출 자체를 롤백시키지 않는다.
 */
@Getter
@AllArgsConstructor
public class QuizSubmittedEvent {
    private final Long userId;
    private final Long courseId;
    private final Long quizId;
    private final Long quizSubmissionId;
    /** 점수 백분율 (0~100) — 진도율 계산에 사용 */
    private final double scorePercent;
    /** 오답 수 — 약점 분석 트리거 판단용 */
    private final int incorrectCount;
}
