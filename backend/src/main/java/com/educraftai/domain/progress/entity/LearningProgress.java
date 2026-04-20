package com.educraftai.domain.progress.entity;

import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * 학생별 코스 학습 진도 집계 엔티티.
 *
 * <p>수강 등록 시 초기 레코드가 생성되며, 자료 완료 체크와 퀴즈 제출이 발생할 때마다
 * 서비스 계층에서 재계산하여 {@link #progressRate}를 업데이트한다.
 *
 * <p>진도율 공식:
 * <pre>
 * 자료 완료율 = completedMaterialCount / totalMaterialCount
 * 퀴즈 점수율 = averageQuizScore / 100 (미제출 시 0)
 * progressRate = (자료 완료율 × 0.7 + 퀴즈 점수율 × 0.3) × 100
 * </pre>
 *
 * <p>수료 조건 (만족 시 {@link #completedAt} 기록):
 * <ul>
 *   <li>자료 100% 완료</li>
 *   <li>코스 내 모든 퀴즈 최소 1회 제출</li>
 *   <li>평균 점수 60점 이상</li>
 * </ul>
 */
@Entity
@Table(name = "learning_progress",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "course_id"})},
        indexes = {
                @Index(name = "idx_progress_user", columnList = "user_id"),
                @Index(name = "idx_progress_course", columnList = "course_id"),
                @Index(name = "idx_progress_last_activity", columnList = "last_activity_at")
        })
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LearningProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    /** CourseEnrollment FK (수강 해지 시 동반 처리 추적용) */
    @Column(name = "enrollment_id", nullable = false)
    private Long enrollmentId;

    /**
     * 완료 체크된 Material ID 집합.
     * <p>{@code @ElementCollection}으로 별도 테이블(learning_progress_completed_material_ids)에 저장.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "learning_progress_completed_material_ids",
            joinColumns = @JoinColumn(name = "progress_id")
    )
    @Column(name = "material_id")
    @Builder.Default
    private Set<Long> completedMaterialIds = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private Integer totalMaterialCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer completedMaterialCount = 0;

    /** 평균 퀴즈 점수 (0~100). 퀴즈 미제출 시 null */
    private Double averageQuizScore;

    @Column(nullable = false)
    @Builder.Default
    private Integer quizAttemptCount = 0;

    /** 최종 캐시된 진도율 (0.0 ~ 100.0) */
    @Column(nullable = false)
    @Builder.Default
    private Double progressRate = 0.0;

    /** 마지막 활동 시각 (비활성 학생 판별용) */
    @Column(name = "last_activity_at", nullable = false)
    @Builder.Default
    private LocalDateTime lastActivityAt = LocalDateTime.now();

    /** 100% 달성 + 수료 조건 만족 시각. 미완료면 null */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /** 자료 완료 체크 — 멱등성 유지 (이미 있으면 false 반환) */
    public boolean markMaterialCompleted(Long materialId) {
        boolean added = completedMaterialIds.add(materialId);
        if (added) {
            completedMaterialCount = completedMaterialIds.size();
            lastActivityAt = LocalDateTime.now();
        }
        return added;
    }

    /** 자료 완료 체크 해제 */
    public boolean unmarkMaterialCompleted(Long materialId) {
        boolean removed = completedMaterialIds.remove(materialId);
        if (removed) {
            completedMaterialCount = completedMaterialIds.size();
            lastActivityAt = LocalDateTime.now();
            // 수료 조건 재검토 필요 — completedAt 초기화
            completedAt = null;
        }
        return removed;
    }

    /** 퀴즈 제출 결과 반영 (평균 재계산) */
    public void applyQuizResult(double scorePercent) {
        double currentTotal = (averageQuizScore == null ? 0.0 : averageQuizScore) * quizAttemptCount;
        quizAttemptCount += 1;
        averageQuizScore = (currentTotal + scorePercent) / quizAttemptCount;
        lastActivityAt = LocalDateTime.now();
    }

    /** 진도율 재계산 (공식 적용) */
    public void recalculateProgressRate() {
        double materialRate = totalMaterialCount == 0
                ? 0.0
                : (double) completedMaterialCount / totalMaterialCount;
        double quizRate = averageQuizScore == null ? 0.0 : averageQuizScore / 100.0;
        this.progressRate = Math.min(100.0, (materialRate * 0.7 + quizRate * 0.3) * 100.0);
    }

    /** 수료 조건 만족 여부 판정 */
    public boolean meetsCompletionRequirements(int requiredQuizCount) {
        boolean allMaterialsDone = totalMaterialCount > 0 && completedMaterialCount >= totalMaterialCount;
        boolean allQuizzesAttempted = requiredQuizCount == 0 || quizAttemptCount >= requiredQuizCount;
        boolean qualityThreshold = averageQuizScore == null || averageQuizScore >= 60.0;
        // requiredQuizCount가 0이면 퀴즈 시도 자체가 없어도 통과 가능
        if (requiredQuizCount > 0 && averageQuizScore == null) return false;
        return allMaterialsDone && allQuizzesAttempted && qualityThreshold;
    }

    /** 수료 처리 */
    public void markCompleted() {
        this.completedAt = LocalDateTime.now();
    }
}
