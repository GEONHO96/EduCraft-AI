package com.educraftai.domain.quiz.dto;

import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class QuizResponse {

    @Getter @Builder @AllArgsConstructor
    public static class Info {
        private Long id;
        private Long materialId;
        private String questionsJson;
        private Integer timeLimit;
        private LocalDateTime createdAt;

        public static Info from(Quiz quiz) {
            return Info.builder()
                    .id(quiz.getId())
                    .materialId(quiz.getMaterial().getId())
                    .questionsJson(quiz.getQuestionsJson())
                    .timeLimit(quiz.getTimeLimit())
                    .createdAt(quiz.getCreatedAt())
                    .build();
        }
    }

    @Getter @Builder @AllArgsConstructor
    public static class SubmissionResult {
        private Long id;
        private Long quizId;
        private Integer score;
        private Integer totalQuestions;
        private String answersJson;
        private LocalDateTime submittedAt;

        public static SubmissionResult from(QuizSubmission submission) {
            return SubmissionResult.builder()
                    .id(submission.getId())
                    .quizId(submission.getQuiz().getId())
                    .score(submission.getScore())
                    .totalQuestions(submission.getTotalQuestions())
                    .answersJson(submission.getAnswersJson())
                    .submittedAt(submission.getSubmittedAt())
                    .build();
        }
    }
}
