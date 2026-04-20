package com.educraftai.domain.progress.dto;

import com.educraftai.domain.progress.entity.Certificate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class CertificateResponse {

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Info {
        private Long id;
        private String certificateNumber;
        private Long courseId;
        private String courseTitle;
        private String studentName;
        private LocalDateTime issuedAt;
        private double finalScore;

        public static Info from(Certificate c) {
            return Info.builder()
                    .id(c.getId())
                    .certificateNumber(c.getCertificateNumber())
                    .courseId(c.getCourseId())
                    .courseTitle(c.getCourseTitle())
                    .studentName(c.getStudentName())
                    .issuedAt(c.getIssuedAt())
                    .finalScore(c.getFinalScore())
                    .build();
        }
    }
}
