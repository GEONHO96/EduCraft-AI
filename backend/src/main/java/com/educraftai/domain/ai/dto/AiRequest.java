package com.educraftai.domain.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class AiRequest {

    @Getter @Setter
    public static class GenerateCurriculum {
        @NotNull
        private Long courseId;

        @NotBlank(message = "과목은 필수입니다.")
        private String subject;

        @NotBlank(message = "주제는 필수입니다.")
        private String topic;

        @NotNull(message = "총 주차 수는 필수입니다.")
        private Integer totalWeeks;

        private String targetLevel;
        private String additionalRequirements;
    }

    @Getter @Setter
    public static class GenerateMaterial {
        @NotNull
        private Long curriculumId;

        @NotBlank(message = "자료 유형은 필수입니다.")
        private String type;

        private Integer difficulty;
        private String additionalRequirements;
    }

    @Getter @Setter
    public static class GenerateQuiz {
        @NotNull
        private Long curriculumId;

        @NotNull(message = "문제 수는 필수입니다.")
        private Integer questionCount;

        private Integer difficulty;
        private String questionTypes;
        private String additionalRequirements;
    }

    /** 학년별 AI 퀴즈 생성 요청 (학생용) */
    @Getter @Setter
    public static class GenerateGradeQuiz {
        @NotBlank(message = "학년 정보는 필수입니다.")
        private String grade;        // ELEMENTARY_1 ~ HIGH_3

        @NotBlank(message = "과목은 필수입니다.")
        private String subject;      // 국어, 영어, 수학

        private Integer questionCount; // 기본 5문제
        private Integer difficulty;    // 1~5, 기본 3
    }

    @Getter @Setter
    public static class GenerateSupplement {
        @NotNull
        private Long quizSubmissionId;

        private String additionalRequirements;
    }
}
