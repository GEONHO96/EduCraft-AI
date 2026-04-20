package com.educraftai.domain.curriculum.dto;

import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.domain.material.entity.Material;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

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
        /**
         * 이 커리큘럼에 속한 학습 자료 목록.
         * <p>진도 페이지의 자료별 완료 체크박스 UI 지원 목적.
         * 목록 조회 시 함께 내려보내 프론트 호출 횟수를 줄인다.
         */
        private List<MaterialSummary> materials;

        public static Info from(Curriculum curriculum) {
            return from(curriculum, List.of());
        }

        public static Info from(Curriculum curriculum, List<Material> materials) {
            return Info.builder()
                    .id(curriculum.getId())
                    .courseId(curriculum.getCourse().getId())
                    .weekNumber(curriculum.getWeekNumber())
                    .topic(curriculum.getTopic())
                    .objectives(curriculum.getObjectives())
                    .contentJson(curriculum.getContentJson())
                    .aiGenerated(curriculum.getAiGenerated())
                    .createdAt(curriculum.getCreatedAt())
                    .materials(materials.stream().map(MaterialSummary::from).toList())
                    .build();
        }
    }

    /** 커리큘럼 목록 응답에 포함되는 자료 요약 */
    @Getter @Builder @AllArgsConstructor
    public static class MaterialSummary {
        private Long id;
        private String type;
        private String title;
        private Integer difficulty;
        private Boolean aiGenerated;

        public static MaterialSummary from(Material material) {
            return MaterialSummary.builder()
                    .id(material.getId())
                    .type(material.getType().name())
                    .title(material.getTitle())
                    .difficulty(material.getDifficulty())
                    .aiGenerated(material.getAiGenerated())
                    .build();
        }
    }
}
