package com.educraftai.domain.batch.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_ai_usage_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"teacher_id", "stats_date"})
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DailyAiUsageStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Column(name = "stats_date", nullable = false)
    private LocalDate statsDate;

    private int generationCount;

    private int curriculumCount;

    private int materialCount;

    private int quizCount;

    private int totalTimeSavedSeconds;
}
