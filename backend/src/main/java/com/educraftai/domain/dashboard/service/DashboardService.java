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
        List<Long> courseIds = courses.stream().map(c -> c.getId()).toList();

        // N+1 방지: 배치 쿼리로 한 번에 집계
        long totalStudents = courseIds.isEmpty() ? 0 : enrollmentRepository.countByCourseIdIn(courseIds);
        long totalMaterials = courseIds.isEmpty() ? 0 : materialRepository.countByCourseIds(courseIds);
        long totalQuizzes = courseIds.isEmpty() ? 0 : quizRepository.countByCourseIds(courseIds);

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
                .totalStudents((int) totalStudents)
                .totalMaterials((int) totalMaterials)
                .totalQuizzes((int) totalQuizzes)
                .timeSaved(timeSaved)
                .recentActivities(List.of())
                .build();
    }

    public DashboardResponse.StudentDashboard getStudentDashboard(Long studentId) {
        long enrolledCourseCount = enrollmentRepository.countByStudentId(studentId);

        // DB 집계로 전체 퀴즈 수 조회 (메모리에 전체 로드 방지)
        long quizCount = submissionRepository.countByStudentId(studentId);
        long gradeQuizCount = gradeQuizSubmissionRepository.countByStudentId(studentId);
        long totalQuizCount = quizCount + gradeQuizCount;

        // DB 집계로 평균 점수 계산 (가중 평균)
        double quizAvg = submissionRepository.getAverageScorePercentByStudentId(studentId);
        double gradeQuizAvg = gradeQuizSubmissionRepository.getAverageScorePercentByStudentId(studentId);
        double avgScore = totalQuizCount > 0
                ? (quizAvg * quizCount + gradeQuizAvg * gradeQuizCount) / totalQuizCount
                : 0.0;

        // 최근 결과: 각 소스에서 최근 10건만 조회 후 병합
        List<DashboardResponse.QuizResult> recentResults = new ArrayList<>();

        for (var s : submissionRepository.findTop10ByStudentIdOrderBySubmittedAtDesc(studentId)) {
            recentResults.add(DashboardResponse.QuizResult.builder()
                    .quizTitle(s.getQuiz().getMaterial().getTitle())
                    .score(s.getScore())
                    .totalQuestions(s.getTotalQuestions())
                    .submittedAt(s.getSubmittedAt().toString())
                    .build());
        }

        for (var g : gradeQuizSubmissionRepository.findTop10ByStudentIdOrderBySubmittedAtDesc(studentId)) {
            String gradeLabel = GRADE_LABELS.getOrDefault(g.getGrade(), g.getGrade());
            recentResults.add(DashboardResponse.QuizResult.builder()
                    .quizTitle(gradeLabel + " " + g.getSubject() + " 퀴즈")
                    .score(g.getScore())
                    .totalQuestions(g.getTotalQuestions())
                    .submittedAt(g.getSubmittedAt().toString())
                    .build());
        }

        // 병합 후 최신순 정렬, 최대 10건
        recentResults.sort(Comparator.comparing(DashboardResponse.QuizResult::getSubmittedAt).reversed());
        if (recentResults.size() > 10) {
            recentResults = recentResults.subList(0, 10);
        }

        return DashboardResponse.StudentDashboard.builder()
                .enrolledCourses((int) enrolledCourseCount)
                .completedQuizzes((int) totalQuizCount)
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
