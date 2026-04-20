package com.educraftai.domain.monitoring.service;

import com.educraftai.domain.ai.dto.WeaknessReportResponse;
import com.educraftai.domain.ai.service.WeaknessAnalysisService;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.monitoring.dto.MonitoringResponse;
import com.educraftai.domain.progress.entity.LearningProgress;
import com.educraftai.domain.progress.repository.LearningProgressRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 교사용 학생 모니터링 서비스.
 *
 * <p>교사는 자신이 담당하는 강의에 대해서만 모니터링 데이터를 조회할 수 있다.
 * {@link #assertTeacherOwnsCourse}가 모든 엔드포인트의 진입점에서 소유자 검증을 수행한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherMonitoringService {

    /** 비활성 학생 판정 기준일 (기본 7일) */
    private static final int INACTIVE_DAYS_DEFAULT = 7;

    private final CourseRepository courseRepository;
    private final LearningProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final WeaknessAnalysisService weaknessAnalysisService;

    // ─── 반 요약 ───

    /** 반 요약 카드 데이터 */
    public MonitoringResponse.CourseSummary getCourseSummary(Long teacherId, Long courseId) {
        Course course = assertTeacherOwnsCourse(teacherId, courseId);
        List<LearningProgress> progresses = progressRepository.findByCourseIdOrderByProgressRateDesc(courseId);

        LocalDateTime threshold = LocalDateTime.now().minusDays(INACTIVE_DAYS_DEFAULT);
        double avgProgress = progresses.stream()
                .mapToDouble(LearningProgress::getProgressRate)
                .average().orElse(0.0);
        long completed = progresses.stream().filter(p -> p.getCompletedAt() != null).count();
        long inactive = progresses.stream()
                .filter(p -> p.getCompletedAt() == null)
                .filter(p -> p.getLastActivityAt().isBefore(threshold))
                .count();

        return MonitoringResponse.CourseSummary.builder()
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .totalStudents(progresses.size())
                .averageProgressRate(avgProgress)
                .completedStudents((int) completed)
                .inactiveStudents((int) inactive)
                .build();
    }

    // ─── 반 학생별 진도 테이블 ───

    /** 반 학생들의 진도 상세 테이블 */
    public List<MonitoringResponse.StudentProgress> getStudentProgressList(Long teacherId, Long courseId) {
        assertTeacherOwnsCourse(teacherId, courseId);
        List<LearningProgress> progresses = progressRepository.findByCourseIdOrderByProgressRateDesc(courseId);
        if (progresses.isEmpty()) return List.of();

        // 학생 ID → User 배치 조회 (N+1 방지)
        List<Long> studentIds = progresses.stream().map(LearningProgress::getUserId).toList();
        Map<Long, User> userById = userRepository.findAllById(studentIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        LocalDateTime threshold = LocalDateTime.now().minusDays(INACTIVE_DAYS_DEFAULT);
        return progresses.stream()
                .map(p -> {
                    User u = userById.get(p.getUserId());
                    String name = u == null ? "(삭제된 사용자)"
                            : (u.getNickname() != null && !u.getNickname().isBlank() ? u.getNickname() : u.getName());
                    boolean inactive = p.getCompletedAt() == null && p.getLastActivityAt().isBefore(threshold);
                    return MonitoringResponse.StudentProgress.builder()
                            .studentId(p.getUserId())
                            .studentName(name)
                            .email(u == null ? "" : u.getEmail())
                            .progressRate(p.getProgressRate())
                            .completedMaterialCount(p.getCompletedMaterialCount())
                            .totalMaterialCount(p.getTotalMaterialCount())
                            .quizAttemptCount(p.getQuizAttemptCount())
                            .averageQuizScore(p.getAverageQuizScore())
                            .lastActivityAt(p.getLastActivityAt())
                            .completedAt(p.getCompletedAt())
                            .completed(p.getCompletedAt() != null)
                            .inactive(inactive)
                            .build();
                })
                .toList();
    }

    // ─── 약점 분석 통합 ───

    /** 반 공통 약점 TOP N */
    public List<WeaknessReportResponse.TopConcept> getCourseWeaknessTop(Long teacherId, Long courseId, int limit) {
        assertTeacherOwnsCourse(teacherId, courseId);
        return weaknessAnalysisService.getTopConcepts(courseId, limit);
    }

    // ─── 공통 권한 검증 ───

    /** 해당 코스의 담당 교사가 맞는지 검증. 아니면 {@link ErrorCode#TEACHER_COURSE_ACCESS_DENIED} */
    private Course assertTeacherOwnsCourse(Long teacherId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));
        if (!course.getTeacher().getId().equals(teacherId)) {
            throw new BusinessException(ErrorCode.TEACHER_COURSE_ACCESS_DENIED);
        }
        return course;
    }
}
