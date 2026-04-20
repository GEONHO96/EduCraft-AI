package com.educraftai.domain.ai.entity;

import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * AI 오답노트 & 약점 분석 리포트.
 *
 * <p>학생이 퀴즈를 제출하고 오답이 1개 이상 있을 때 비동기로 생성된다.
 * Claude API가 틀린 문항들을 분석해 취약 개념 목록과 학습 권장사항을 제공한다.
 *
 * <p>생성 흐름:
 * <ol>
 *   <li>QuizSubmittedEvent 리스너가 먼저 status=PENDING 레코드 저장</li>
 *   <li>@Async로 Claude API 호출 → 성공 시 COMPLETED, 실패 시 FAILED 업데이트</li>
 *   <li>프론트엔드는 3초 간격 폴링으로 상태를 확인 후 결과 렌더링</li>
 * </ol>
 */
@Entity
@Table(name = "weakness_report",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"quiz_submission_id"})},
        indexes = {
                @Index(name = "idx_weakness_user", columnList = "user_id"),
                @Index(name = "idx_weakness_course", columnList = "course_id"),
                @Index(name = "idx_weakness_submission", columnList = "quiz_submission_id")
        })
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class WeaknessReport extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "quiz_submission_id", nullable = false)
    private Long quizSubmissionId;

    /** 취약 개념 목록 (최대 5개 권장) */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "weakness_report_weak_concepts",
            joinColumns = @JoinColumn(name = "weakness_report_id")
    )
    @Column(name = "concept", length = 255)
    @Builder.Default
    private List<String> weakConcepts = new ArrayList<>();

    /** AI 생성 학습 권장사항 (마크다운) */
    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(nullable = false)
    @Builder.Default
    private Integer incorrectQuestionCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AnalysisStatus analysisStatus = AnalysisStatus.PENDING;

    /** 분석 완료 시각 (COMPLETED/FAILED 전이 시 기록) */
    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    public enum AnalysisStatus {
        PENDING, COMPLETED, FAILED
    }

    /** 분석 성공 시 상태 전이 */
    public void markCompleted(List<String> concepts, String recommendations) {
        this.weakConcepts = concepts;
        this.recommendations = recommendations;
        this.analysisStatus = AnalysisStatus.COMPLETED;
        this.generatedAt = LocalDateTime.now();
    }

    /** 분석 실패 시 상태 전이 (폴백 — 빈 결과) */
    public void markFailed() {
        this.analysisStatus = AnalysisStatus.FAILED;
        this.generatedAt = LocalDateTime.now();
    }
}
