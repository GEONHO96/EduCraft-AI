package com.educraftai.domain.dashboard.service;

import com.educraftai.domain.ai.repository.AiGenerationLogRepository;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.dashboard.dto.DashboardResponse;
import com.educraftai.domain.material.repository.MaterialRepository;
import com.educraftai.domain.quiz.entity.GradeQuizSubmission;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.GradeQuizSubmissionRepository;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final MaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final QuizSubmissionRepository submissionRepository;
    private final GradeQuizSubmissionRepository gradeQuizSubmissionRepository;
    private final AiGenerationLogRepository aiLogRepository;

    private static final Map<String, String> GRADE_LABELS = new HashMap<>() {{
        put("ELEMENTARY_1", "초등 1학년"); put("ELEMENTARY_2", "초등 2학년"); put("ELEMENTARY_3", "초등 3학년");
        put("ELEMENTARY_4", "초등 4학년"); put("ELEMENTARY_5", "초등 5학년"); put("ELEMENTARY_6", "초등 6학년");
        put("MIDDLE_1", "중학 1학년"); put("MIDDLE_2", "중학 2학년"); put("MIDDLE_3", "중학 3학년");
        put("HIGH_1", "고등 1학년"); put("HIGH_2", "고등 2학년"); put("HIGH_3", "고등 3학년");
    }};

    public DashboardResponse.TeacherDashboard getTeacherDashboard(Long teacherId) {
        var courses = courseRepository.findByTeacherId(teacherId);
        int totalStudents = courses.stream()
                .mapToInt(c -> enrollmentRepository.findByCourseId(c.getId()).size())
                .sum();

        Integer totalTimeSaved = aiLogRepository.getTotalTimeSavedByTeacherId(teacherId);
        Long generationCount = aiLogRepository.getGenerationCountByTeacherId(teacherId);

        int hours = totalTimeSaved / 3600;
        int minutes = (totalTimeSaved % 3600) / 60;
        String formatted = String.format("%d시간 %d분", hours, minutes);

        var timeSaved = DashboardResponse.TimeSaved.builder()
                .totalSeconds(totalTimeSaved)
                .generationCount(generationCount)
                .formatted(formatted)
                .build();

        return DashboardResponse.TeacherDashboard.builder()
                .totalCourses(courses.size())
                .totalStudents(totalStudents)
                .totalMaterials(0)
                .totalQuizzes(0)
                .timeSaved(timeSaved)
                .recentActivities(List.of())
                .build();
    }

    public DashboardResponse.StudentDashboard getStudentDashboard(Long studentId) {
        var enrollments = enrollmentRepository.findByStudentId(studentId);
        var submissions = submissionRepository.findByStudentId(studentId);
        var gradeQuizSubmissions = gradeQuizSubmissionRepository.findByStudentIdOrderBySubmittedAtDesc(studentId);

        // 강의 퀴즈 결과
        List<DashboardResponse.QuizResult> recentResults = new ArrayList<>();
        for (var s : submissions) {
            recentResults.add(DashboardResponse.QuizResult.builder()
                    .quizTitle(s.getQuiz().getMaterial().getTitle())
                    .score(s.getScore())
                    .totalQuestions(s.getTotalQuestions())
                    .submittedAt(s.getSubmittedAt().toString())
                    .build());
        }

        // 학년별 AI 퀴즈 결과도 포함
        for (var g : gradeQuizSubmissions) {
            String gradeLabel = GRADE_LABELS.getOrDefault(g.getGrade(), g.getGrade());
            recentResults.add(DashboardResponse.QuizResult.builder()
                    .quizTitle(gradeLabel + " " + g.getSubject() + " 퀴즈")
                    .score(g.getScore())
                    .totalQuestions(g.getTotalQuestions())
                    .submittedAt(g.getSubmittedAt().toString())
                    .build());
        }

        // 최신순 정렬 후 최근 10개만
        recentResults.sort(Comparator.comparing(DashboardResponse.QuizResult::getSubmittedAt).reversed());
        if (recentResults.size() > 10) {
            recentResults = recentResults.subList(0, 10);
        }

        // 전체 퀴즈 수 합산
        int totalQuizCount = submissions.size() + gradeQuizSubmissions.size();

        // 전체 평균 점수 (강의 퀴즈 + 학년별 퀴즈 통합)
        double totalScoreSum = 0;
        int count = 0;
        for (var s : submissions) {
            totalScoreSum += (double) s.getScore() / s.getTotalQuestions() * 100;
            count++;
        }
        for (var g : gradeQuizSubmissions) {
            totalScoreSum += (double) g.getScore() / g.getTotalQuestions() * 100;
            count++;
        }
        double avgScore = count > 0 ? totalScoreSum / count : 0.0;

        return DashboardResponse.StudentDashboard.builder()
                .enrolledCourses(enrollments.size())
                .completedQuizzes(totalQuizCount)
                .averageScore(Math.round(avgScore * 10.0) / 10.0)
                .recentQuizResults(recentResults)
                .build();
    }

    public DashboardResponse.TimeSaved getTimeSaved(Long teacherId) {
        Integer totalTimeSaved = aiLogRepository.getTotalTimeSavedByTeacherId(teacherId);
        Long generationCount = aiLogRepository.getGenerationCountByTeacherId(teacherId);

        int hours = totalTimeSaved / 3600;
        int minutes = (totalTimeSaved % 3600) / 60;

        return DashboardResponse.TimeSaved.builder()
                .totalSeconds(totalTimeSaved)
                .generationCount(generationCount)
                .formatted(String.format("%d시간 %d분", hours, minutes))
                .build();
    }
}
