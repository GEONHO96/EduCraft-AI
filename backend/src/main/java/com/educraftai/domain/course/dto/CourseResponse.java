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

    /** 강의 탐색용 DTO - 수강생 수, 수강 여부 포함 */
    @Getter @Builder @AllArgsConstructor
    public static class Browse {
        private Long id;
        private String title;
        private String subject;
        private String description;
        private String teacherName;
        private long studentCount;
        private boolean enrolled;
        private LocalDateTime createdAt;

        public static Browse from(Course course, long studentCount, boolean enrolled) {
            return Browse.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .subject(course.getSubject())
                    .description(course.getDescription())
                    .teacherName(course.getTeacher().getName())
                    .studentCount(studentCount)
                    .enrolled(enrolled)
                    .createdAt(course.getCreatedAt())
                    .build();
        }
    }
}
