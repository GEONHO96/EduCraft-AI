package com.educraftai.domain.curriculum.dto;

import com.educraftai.domain.curriculum.entity.Curriculum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class CurriculumResponse {

    @Getter @Builder @AllArgsConstructor
    public static class Info {
        private Long id;
        private Long courseId;
        private Integer weekNumber;
        private String topic;
        private String objectives;
        private String contentJson;
        private Boolean aiGenerated;
        private LocalDateTime createdAt;

        public static Info from(Curriculum curriculum) {
            return Info.builder()
                    .id(curriculum.getId())
                    .courseId(curriculum.getCourse().getId())
                    .weekNumber(curriculum.getWeekNumber())
                    .topic(curriculum.getTopic())
                    .objectives(curriculum.getObjectives())
                    .contentJson(curriculum.getContentJson())
                    .aiGenerated(curriculum.getAiGenerated())
                    .createdAt(curriculum.getCreatedAt())
                    .build();
        }
    }
}
