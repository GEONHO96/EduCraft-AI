package com.educraftai.domain.quiz.entity;

import com.educraftai.domain.material.entity.Material;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String questionsJson;

    private Integer timeLimit;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
