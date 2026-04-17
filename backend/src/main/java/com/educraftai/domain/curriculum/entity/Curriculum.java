package com.educraftai.domain.curriculum.entity;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "curriculums", indexes = {
    @Index(name = "idx_curriculum_course", columnList = "course_id")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Curriculum extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Integer weekNumber;

    @Column(nullable = false)
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(columnDefinition = "LONGTEXT")
    private String contentJson;

    @Builder.Default
    @Column(nullable = false)
    private Boolean aiGenerated = false;
}
