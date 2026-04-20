package com.educraftai.domain.monitoring.service;

import com.educraftai.domain.ai.service.WeaknessAnalysisService;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.progress.entity.LearningProgress;
import com.educraftai.domain.progress.repository.LearningProgressRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

/**
 * {@link TeacherMonitoringService} 단위 테스트.
 * <p>소유자 검증과 요약 계산(평균 진도율, 수료 인원, 비활성 인원)을 검증.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TeacherMonitoringService 단위 테스트")
class TeacherMonitoringServiceTest {

    @InjectMocks private TeacherMonitoringService service;
    @Mock private CourseRepository courseRepository;
    @Mock private LearningProgressRepository progressRepository;
    @Mock private UserRepository userRepository;
    @Mock private WeaknessAnalysisService weaknessAnalysisService;

    private User teacher;
    private User otherTeacher;
    private Course course;

    @BeforeEach
    void setUp() throws Exception {
        teacher = User.builder().email("t@edu.com").name("담당교사").role(User.Role.TEACHER).build();
        setId(teacher, 1L);
        otherTeacher = User.builder().email("o@edu.com").name("다른교사").role(User.Role.TEACHER).build();
        setId(otherTeacher, 2L);
        course = Course.builder().title("알고리즘").subject("CS").teacher(teacher).build();
        setId(course, 10L);
    }

    private static void setId(Object obj, Long id) throws Exception {
        Field field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    @Nested
    @DisplayName("소유자 검증")
    class OwnershipCheck {

        @Test
        @DisplayName("담당 교사가 아니면 TEACHER_COURSE_ACCESS_DENIED")
        void notOwner() {
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));

            assertThatThrownBy(() -> service.getCourseSummary(otherTeacher.getId(), 10L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.TEACHER_COURSE_ACCESS_DENIED);
        }

        @Test
        @DisplayName("존재하지 않는 코스는 COURSE_NOT_FOUND")
        void courseNotFound() {
            given(courseRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> service.getCourseSummary(teacher.getId(), 999L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.COURSE_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("반 요약 계산")
    class CourseSummary {

        @Test
        @DisplayName("학생 3명 — 평균 진도·수료·비활성 집계")
        void computesSummary() {
            LearningProgress p1 = LearningProgress.builder()
                    .userId(11L).courseId(10L).progressRate(100.0)
                    .lastActivityAt(LocalDateTime.now().minusDays(1)).build();
            p1.markCompleted();
            LearningProgress p2 = LearningProgress.builder()
                    .userId(12L).courseId(10L).progressRate(50.0)
                    .lastActivityAt(LocalDateTime.now().minusDays(1)).build();
            LearningProgress p3 = LearningProgress.builder()
                    .userId(13L).courseId(10L).progressRate(30.0)
                    .lastActivityAt(LocalDateTime.now().minusDays(30)).build(); // 비활성

            given(courseRepository.findById(10L)).willReturn(Optional.of(course));
            given(progressRepository.findByCourseIdOrderByProgressRateDesc(10L))
                    .willReturn(List.of(p1, p2, p3));

            var summary = service.getCourseSummary(1L, 10L);

            assertThat(summary.getTotalStudents()).isEqualTo(3);
            assertThat(summary.getAverageProgressRate()).isEqualTo((100.0 + 50.0 + 30.0) / 3);
            assertThat(summary.getCompletedStudents()).isEqualTo(1);
            assertThat(summary.getInactiveStudents()).isEqualTo(1);
        }

        @Test
        @DisplayName("학생 0명 — 평균 0, 모두 0")
        void emptyCourse() {
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));
            given(progressRepository.findByCourseIdOrderByProgressRateDesc(10L)).willReturn(List.of());

            var summary = service.getCourseSummary(1L, 10L);

            assertThat(summary.getTotalStudents()).isEqualTo(0);
            assertThat(summary.getAverageProgressRate()).isEqualTo(0.0);
            assertThat(summary.getCompletedStudents()).isEqualTo(0);
            assertThat(summary.getInactiveStudents()).isEqualTo(0);
        }
    }
}
