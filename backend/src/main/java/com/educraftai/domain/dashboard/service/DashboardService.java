package com.educraftai.domain.dashboard.service;

import com.educraftai.domain.ai.repository.AiGenerationLogRepository;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.dashboard.dto.DashboardResponse;
import com.educraftai.domain.material.repository.MaterialRepository;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final MaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final QuizSubmissionRepository submissionRepository;
    private final AiGenerationLogRepository aiLogRepository;

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

        double avgScore = submissions.stream()
                .mapToDouble(s -> (double) s.getScore() / s.getTotalQuestions() * 100)
                .average()
                .orElse(0.0);

        List<DashboardResponse.QuizResult> recentResults = submissions.stream()
                .map(s -> DashboardResponse.QuizResult.builder()
                        .quizTitle(s.getQuiz().getMaterial().getTitle())
                        .score(s.getScore())
                        .totalQuestions(s.getTotalQuestions())
                        .submittedAt(s.getSubmittedAt().toString())
                        .build())
                .toList();

        return DashboardResponse.StudentDashboard.builder()
                .enrolledCourses(enrollments.size())
                .completedQuizzes(submissions.size())
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
