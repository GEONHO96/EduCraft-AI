package com.educraftai.domain.progress.entity;

import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 코스 수료증 메타데이터.
 *
 * <p>수료 조건을 만족한 학생에게 자동 발급되며, PDF 렌더링은 out of scope.
 * 웹 페이지에서 상세 정보를 열람할 수 있도록 메타데이터만 저장한다.
 *
 * <p>발급 시점의 학생 이름·코스 제목을 스냅샷으로 보관하여,
 * 이후 사용자 정보가 변경되어도 수료증 내용은 불변하게 유지된다.
 */
@Entity
@Table(name = "certificates",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "course_id"})},
        indexes = {
                @Index(name = "idx_cert_user", columnList = "user_id"),
                @Index(name = "idx_cert_number", columnList = "certificate_number")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Certificate extends BaseEntity {

    private static final DateTimeFormatter NUMBER_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    /** 수료증 번호 (공개 식별자). "EDU-{yyyyMMdd}-{courseId}-{userId}" 형식 */
    @Column(name = "certificate_number", nullable = false, unique = true, length = 50)
    private String certificateNumber;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    /** 발급 시점 진도율·점수 스냅샷 (0.0 ~ 100.0) */
    @Column(name = "final_score", nullable = false)
    private Double finalScore;

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "course_title", nullable = false, length = 255)
    private String courseTitle;

    /** 수료증 번호 생성 헬퍼 */
    public static String buildCertificateNumber(Long courseId, Long userId) {
        return "EDU-" + LocalDateTime.now().format(NUMBER_DATE_FORMAT)
                + "-" + courseId + "-" + userId;
    }
}
