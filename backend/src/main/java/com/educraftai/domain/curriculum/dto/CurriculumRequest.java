package com.educraftai.domain.curriculum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class CurriculumRequest {

    @Getter @Setter
    public static class Update {
        @NotNull
        private Integer weekNumber;

        @NotBlank
        private String topic;

        private String objectives;
        private String contentJson;
    }
}
