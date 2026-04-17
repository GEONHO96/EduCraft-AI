package com.educraftai.domain.material.entity;

import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "materials", indexes = {
    @Index(name = "idx_material_curriculum", columnList = "curriculum_id")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Material extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String contentJson;

    @Column(nullable = false)
    private Integer difficulty;

    @Builder.Default
    @Column(nullable = false)
    private Boolean aiGenerated = false;

    public enum MaterialType {
        LECTURE, QUIZ, EXERCISE
    }
}
