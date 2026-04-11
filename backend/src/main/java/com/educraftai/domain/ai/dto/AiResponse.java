package com.educraftai.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class AiResponse {

    @Getter @Builder @AllArgsConstructor
    public static class CurriculumResult {
        private Long courseId;
        private List<WeekPlan> weeks;
        private Integer timeSavedSeconds;
    }

    @Getter @Builder @AllArgsConstructor
    public static class WeekPlan {
        private Integer weekNumber;
        private String topic;
        private String objectives;
        private String content;
    }

    @Getter @Builder @AllArgsConstructor
    public static class MaterialResult {
        private Long materialId;
        private String title;
        private String contentJson;
        private Integer timeSavedSeconds;
    }

    @Getter @Builder @AllArgsConstructor
    public static class QuizResult {
        private Long quizId;
        private Long materialId;
        private String questionsJson;
        private Integer questionCount;
        private Integer timeSavedSeconds;
    }

    /** 학년별 AI 퀴즈 생성 결과 (DB 저장 없이 바로 반환) */
    @Getter @Builder @AllArgsConstructor
    public static class GradeQuizResult {
        private String questionsJson;
        private Integer questionCount;
        private String grade;
        private String subject;
    }

    @Getter @Builder @AllArgsConstructor
    public static class SupplementResult {
        private String explanationJson;
        private String additionalQuestionsJson;
        private Integer timeSavedSeconds;
    }
}
