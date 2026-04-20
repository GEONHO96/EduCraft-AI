package com.educraftai.domain.ai.dto;

import com.educraftai.domain.ai.entity.WeaknessReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class WeaknessReportResponse {

    @Getter @Builder @AllArgsConstructor
    public static class Info {
        private Long id;
        private Long courseId;
        private Long quizSubmissionId;
        private String analysisStatus;        // PENDING / COMPLETED / FAILED
        private List<String> weakConcepts;
        private String recommendations;
        private int incorrectQuestionCount;
        private LocalDateTime generatedAt;

        public static Info from(WeaknessReport report) {
            return Info.builder()
                    .id(report.getId())
                    .courseId(report.getCourseId())
                    .quizSubmissionId(report.getQuizSubmissionId())
                    .analysisStatus(report.getAnalysisStatus().name())
                    .weakConcepts(report.getWeakConcepts())
                    .recommendations(report.getRecommendations())
                    .incorrectQuestionCount(report.getIncorrectQuestionCount())
                    .generatedAt(report.getGeneratedAt())
                    .build();
        }
    }

    /** 반 공통 약점 TOP N 집계 (교사 모니터링용) */
    @Getter @Builder @AllArgsConstructor
    public static class TopConcept {
        private String concept;
        private long count;
    }
}
