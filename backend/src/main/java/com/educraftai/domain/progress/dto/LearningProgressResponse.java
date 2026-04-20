package com.educraftai.domain.progress.dto;

import com.educraftai.domain.progress.entity.LearningProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

public class LearningProgressResponse {

    /** 학생 본인 진도 상세 응답 */
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Info {
        private Long courseId;
        private int totalMaterialCount;
        private int completedMaterialCount;
        private Set<Long> completedMaterialIds;
        private Double averageQuizScore;
        private int quizAttemptCount;
        private double progressRate;
        private LocalDateTime lastActivityAt;
        private LocalDateTime completedAt;
        private boolean completed;

        public static Info from(LearningProgress p) {
            return Info.builder()
                    .courseId(p.getCourseId())
                    .totalMaterialCount(p.getTotalMaterialCount())
                    .completedMaterialCount(p.getCompletedMaterialCount())
                    .completedMaterialIds(p.getCompletedMaterialIds())
                    .averageQuizScore(p.getAverageQuizScore())
                    .quizAttemptCount(p.getQuizAttemptCount())
                    .progressRate(p.getProgressRate())
                    .lastActivityAt(p.getLastActivityAt())
                    .completedAt(p.getCompletedAt())
                    .completed(p.getCompletedAt() != null)
                    .build();
        }
    }

    /** 내 강의 진도 요약 (MyProgressPage용) */
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Summary {
        private Long courseId;
        private String courseTitle;
        private String subject;
        private double progressRate;
        private int completedMaterialCount;
        private int totalMaterialCount;
        private LocalDateTime lastActivityAt;
        private boolean completed;
    }
}
