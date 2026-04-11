package com.educraftai.domain.batch.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_learning_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "stats_date"})
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DailyLearningStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "stats_date", nullable = false)
    private LocalDate statsDate;

    private int quizzesCompleted;

    private int totalScore;

    private int totalQuestions;

    private double averageScore;

    private int enrolledCourses;
}
