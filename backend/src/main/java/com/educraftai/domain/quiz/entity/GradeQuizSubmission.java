package com.educraftai.domain.quiz.entity;

import com.educraftai.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * GradeQuizSubmission - 학년별 AI 퀴즈 제출 기록
 * 오프라인 퀴즈(GradeQuizPage)에서 풀어진 결과를 저장한다.
 * 기존 QuizSubmission은 강의 기반 Quiz 엔티티를 필요로 하므로,
 * 학년별 퀴즈는 별도 엔티티로 관리한다.
 */
@Entity
@Table(name = "grade_quiz_submissions")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GradeQuizSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    /** 학년 코드 (ELEMENTARY_1 ~ HIGH_3) */
    @Column(nullable = false, length = 20)
    private String grade;

    /** 과목 (국어, 영어, 수학) */
    @Column(nullable = false, length = 20)
    private String subject;

    /** 맞은 문제 수 */
    @Column(nullable = false)
    private Integer score;

    /** 전체 문제 수 */
    @Column(nullable = false)
    private Integer totalQuestions;

    @CreationTimestamp
    private LocalDateTime submittedAt;
}
