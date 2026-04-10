package com.educraftai.domain.course.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class CourseRequest {

    @Getter @Setter
    public static class Create {
        @NotBlank(message = "강의 제목은 필수입니다.")
        private String title;

        @NotBlank(message = "과목은 필수입니다.")
        private String subject;

        private String description;
    }
}
