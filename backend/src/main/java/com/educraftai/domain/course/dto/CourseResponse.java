package com.educraftai.domain.course.dto;

import com.educraftai.domain.course.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class CourseResponse {

    @Getter @Builder @AllArgsConstructor
    public static class Info {
        private Long id;
        private String title;
        private String subject;
        private String description;
        private String teacherName;
        private LocalDateTime createdAt;

        public static Info from(Course course) {
            return Info.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .subject(course.getSubject())
                    .description(course.getDescription())
                    .teacherName(course.getTeacher().getName())
                    .createdAt(course.getCreatedAt())
                    .build();
        }
    }
}
