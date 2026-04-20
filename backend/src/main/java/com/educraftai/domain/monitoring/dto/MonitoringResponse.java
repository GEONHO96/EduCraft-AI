package com.educraftai.domain.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class MonitoringResponse {

    /** 반 학생별 진도 요약 (교사 모니터링 테이블 1행) */
    @Getter @Builder @AllArgsConstructor
    public static class StudentProgress {
        private Long studentId;
        private String studentName;
        private String email;
        private double progressRate;
        private int completedMaterialCount;
        private int totalMaterialCount;
        private int quizAttemptCount;
        private Double averageQuizScore;
        private LocalDateTime lastActivityAt;
        private LocalDateTime completedAt;
        private boolean completed;
        /** 현재 시점 기준 N일 초과 미활동이면 true (기본 7일) */
        private boolean inactive;
    }

    /** 반 요약 카드 (상단 3개 카드) */
    @Getter @Builder @AllArgsConstructor
    public static class CourseSummary {
        private Long courseId;
        private String courseTitle;
        private int totalStudents;
        private double averageProgressRate;
        private int completedStudents;
        private int inactiveStudents;
    }
}
