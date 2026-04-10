package com.educraftai.domain.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class DashboardResponse {

    @Getter @Builder @AllArgsConstructor
    public static class TeacherDashboard {
        private Integer totalCourses;
        private Integer totalStudents;
        private Integer totalMaterials;
        private Integer totalQuizzes;
        private TimeSaved timeSaved;
        private List<RecentActivity> recentActivities;
    }

    @Getter @Builder @AllArgsConstructor
    public static class StudentDashboard {
        private Integer enrolledCourses;
        private Integer completedQuizzes;
        private Double averageScore;
        private List<QuizResult> recentQuizResults;
    }

    @Getter @Builder @AllArgsConstructor
    public static class TimeSaved {
        private Integer totalSeconds;
        private Long generationCount;
        private String formatted;
    }

    @Getter @Builder @AllArgsConstructor
    public static class RecentActivity {
        private String type;
        private String description;
        private String createdAt;
    }

    @Getter @Builder @AllArgsConstructor
    public static class QuizResult {
        private String quizTitle;
        private Integer score;
        private Integer totalQuestions;
        private String submittedAt;
    }
}
