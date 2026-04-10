package com.educraftai.domain.quiz.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class QuizRequest {

    @Getter @Setter
    public static class Submit {
        @NotNull
        private String answersJson;
    }
}
