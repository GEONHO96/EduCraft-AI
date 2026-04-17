package com.educraftai.domain.ai.entity;

import com.educraftai.domain.user.entity.User;
import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_generation_logs", indexes = {
    @Index(name = "idx_ai_log_teacher", columnList = "teacher_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AiGenerationLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(nullable = false)
    private String resultType;

    private Integer timeSavedSeconds;
}
