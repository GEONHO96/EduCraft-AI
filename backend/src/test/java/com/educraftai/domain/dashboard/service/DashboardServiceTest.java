package com.educraftai.domain.dashboard.service;

import com.educraftai.domain.ai.repository.AiGenerationLogRepository;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.domain.dashboard.dto.DashboardResponse;
import com.educraftai.domain.material.entity.Material;
import com.educraftai.domain.material.repository.MaterialRepository;
import com.educraftai.domain.quiz.entity.GradeQuizSubmission;
import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.GradeQuizSubmissionRepository;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.domain.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DashboardService 단위 테스트")
class DashboardServiceTest {

    @InjectMocks private DashboardService dashboardService;
    @Mock private CourseRepository courseRepository;
    @Mock private CourseEnrollmentRepository enrollmentRepository;
    @Mock private MaterialRepository materialRepository;
    @Mock private QuizRepository quizRepository;
    @Mock private QuizSubmissionRepository submissionRepository;
    @Mock private GradeQuizSubmissionRepository gradeQuizSubmissionRepository;
    @Mock private AiGenerationLogRepository aiLogRepository;

    private User teacher;
    private User student;
    private Course course;
    private Course course2;
    private Curriculum curriculum;
    private Material material;
    private Quiz quiz;

    @BeforeEach
    void setUp() throws Exception {
        teacher = User.builder().email("teacher@edu.com").name("김교수").role(User.Role.TEACHER).build();
        setId(teacher, 1L);

        student = User.builder().email("student@edu.com").name("홍학생").role(User.Role.STUDENT).grade("MIDDLE_2").build();
        setId(student, 2L);

        course = Course.builder().teacher(teacher).title("수학 기초").subject("수학").description("기초 수학").build();
        setId(course, 10L);

        course2 = Course.builder().teacher(teacher).title("영어 입문").subject("영어").description("기초 영어").build();
        setId(course2, 20L);

        curriculum = Curriculum.builder().course(course).weekNumber(1).topic("사칙연산").build();
        setId(curriculum, 1L);

        material = Material.builder().curriculum(curriculum).type(Material.MaterialType.QUIZ)
                .title("1주차 퀴즈").difficulty(1).build();
        setId(material, 1L);

        quiz = Quiz.builder().material(material).questionsJson("{}").timeLimit(30).build();
        setId(quiz, 100L);
        setField(quiz, "createdAt", LocalDateTime.now());
    }

    private void setId(Object obj, Long id) throws Exception {
        var field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    private void setField(Object obj, String fieldName, Object value) throws Exception {
        // BaseEntity 같은 부모 클래스에 선언된 필드까지 탐색
        Class<?> clazz = obj.getClass();
        NoSuchFieldException last = null;
        while (clazz != null) {
            try {
                var field = clazz.getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(obj, value);
                return;
            } catch (NoSuchFieldException e) {
                last = e;
                clazz = clazz.getSuperclass();
            }
        }
        throw last != null ? last : new NoSuchFieldException(fieldName);
    }

    @Nested
    @DisplayName("교사 대시보드")
    class TeacherDashboard {

        @Test
        @DisplayName("강의, 학생 수, 자료/퀴즈 수, 절약 시간을 포함한다")
        void getTeacherDashboard_success() {
            given(courseRepository.findByTeacherId(1L)).willReturn(List.of(course, course2));
            given(enrollmentRepository.countByCourseIdIn(List.of(10L, 20L))).willReturn(15L);
            given(materialRepository.countByCourseIds(List.of(10L, 20L))).willReturn(8L);
            given(quizRepository.countByCourseIds(List.of(10L, 20L))).willReturn(4L);
            given(aiLogRepository.getTotalTimeSavedByTeacherId(1L)).willReturn(7380);  // 2시간 3분
            given(aiLogRepository.getGenerationCountByTeacherId(1L)).willReturn(15L);

            DashboardResponse.TeacherDashboard result = dashboardService.getTeacherDashboard(1L);

            assertThat(result.getTotalCourses()).isEqualTo(2);
            assertThat(result.getTotalStudents()).isEqualTo(15);
            assertThat(result.getTotalMaterials()).isEqualTo(8);
            assertThat(result.getTotalQuizzes()).isEqualTo(4);
            assertThat(result.getTimeSaved().getTotalSeconds()).isEqualTo(7380);
            assertThat(result.getTimeSaved().getGenerationCount()).isEqualTo(15L);
            assertThat(result.getTimeSaved().getFormatted()).isEqualTo("2시간 3분");
        }

        @Test
        @DisplayName("강의가 없으면 모든 수치가 0이다")
        void getTeacherDashboard_noCourses() {
            given(courseRepository.findByTeacherId(1L)).willReturn(Collections.emptyList());
            given(aiLogRepository.getTotalTimeSavedByTeacherId(1L)).willReturn(0);
            given(aiLogRepository.getGenerationCountByTeacherId(1L)).willReturn(0L);

            DashboardResponse.TeacherDashboard result = dashboardService.getTeacherDashboard(1L);

            assertThat(result.getTotalCourses()).isEqualTo(0);
            assertThat(result.getTotalStudents()).isEqualTo(0);
            assertThat(result.getTotalMaterials()).isEqualTo(0);
            assertThat(result.getTotalQuizzes()).isEqualTo(0);
            assertThat(result.getTimeSaved().getFormatted()).isEqualTo("0시간 0분");
        }

        @Test
        @DisplayName("절약 시간이 분 단위만 있어도 정상 포맷팅된다")
        void getTeacherDashboard_minutesOnly() {
            given(courseRepository.findByTeacherId(1L)).willReturn(List.of(course));
            given(enrollmentRepository.countByCourseIdIn(List.of(10L))).willReturn(3L);
            given(materialRepository.countByCourseIds(List.of(10L))).willReturn(2L);
            given(quizRepository.countByCourseIds(List.of(10L))).willReturn(1L);
            given(aiLogRepository.getTotalTimeSavedByTeacherId(1L)).willReturn(2700);  // 45분
            given(aiLogRepository.getGenerationCountByTeacherId(1L)).willReturn(5L);

            DashboardResponse.TeacherDashboard result = dashboardService.getTeacherDashboard(1L);

            assertThat(result.getTimeSaved().getFormatted()).isEqualTo("0시간 45분");
        }
    }

    @Nested
    @DisplayName("학생 대시보드")
    class StudentDashboard {

        @Test
        @DisplayName("수강 강의 수, 퀴즈 수, 평균 점수를 포함한다")
        void getStudentDashboard_success() throws Exception {
            CourseEnrollment enrollment = CourseEnrollment.builder().course(course).student(student).build();
            setId(enrollment, 1L);

            QuizSubmission sub1 = QuizSubmission.builder().quiz(quiz).student(student)
                    .answersJson("[\"2\",\"6\"]").score(2).totalQuestions(2).build();
            setId(sub1, 1L);
            setField(sub1, "submittedAt", LocalDateTime.of(2026, 4, 10, 10, 0));

            QuizSubmission sub2 = QuizSubmission.builder().quiz(quiz).student(student)
                    .answersJson("[\"2\",\"5\"]").score(1).totalQuestions(2).build();
            setId(sub2, 2L);
            setField(sub2, "submittedAt", LocalDateTime.of(2026, 4, 11, 10, 0));

            given(enrollmentRepository.findByStudentId(2L)).willReturn(List.of(enrollment));
            given(submissionRepository.findByStudentId(2L)).willReturn(List.of(sub1, sub2));
            given(gradeQuizSubmissionRepository.findByStudentIdOrderBySubmittedAtDesc(2L))
                    .willReturn(Collections.emptyList());

            DashboardResponse.StudentDashboard result = dashboardService.getStudentDashboard(2L);

            assertThat(result.getEnrolledCourses()).isEqualTo(1);
            assertThat(result.getCompletedQuizzes()).isEqualTo(2);
            // sub1: 2/2=100%, sub2: 1/2=50% → 평균 75.0
            assertThat(result.getAverageScore()).isEqualTo(75.0);
            assertThat(result.getRecentQuizResults()).hasSize(2);
        }

        @Test
        @DisplayName("퀴즈 없으면 평균 점수 0이다")
        void getStudentDashboard_noQuizzes() throws Exception {
            CourseEnrollment enrollment = CourseEnrollment.builder().course(course).student(student).build();
            setId(enrollment, 1L);

            given(enrollmentRepository.findByStudentId(2L)).willReturn(List.of(enrollment));
            given(submissionRepository.findByStudentId(2L)).willReturn(Collections.emptyList());
            given(gradeQuizSubmissionRepository.findByStudentIdOrderBySubmittedAtDesc(2L))
                    .willReturn(Collections.emptyList());

            DashboardResponse.StudentDashboard result = dashboardService.getStudentDashboard(2L);

            assertThat(result.getEnrolledCourses()).isEqualTo(1);
            assertThat(result.getCompletedQuizzes()).isEqualTo(0);
            assertThat(result.getAverageScore()).isEqualTo(0.0);
            assertThat(result.getRecentQuizResults()).isEmpty();
        }

        @Test
        @DisplayName("강의 퀴즈와 학년별 퀴즈 결과를 통합한다")
        void getStudentDashboard_mergesGradeQuiz() throws Exception {
            CourseEnrollment enrollment = CourseEnrollment.builder().course(course).student(student).build();
            setId(enrollment, 1L);

            QuizSubmission sub1 = QuizSubmission.builder().quiz(quiz).student(student)
                    .answersJson("[\"2\"]").score(2).totalQuestions(2).build();
            setId(sub1, 1L);
            setField(sub1, "submittedAt", LocalDateTime.of(2026, 4, 10, 10, 0));

            GradeQuizSubmission gradeSub1 = GradeQuizSubmission.builder()
                    .student(student).grade("MIDDLE_2").subject("수학")
                    .score(8).totalQuestions(10).build();
            setId(gradeSub1, 1L);
            setField(gradeSub1, "submittedAt", LocalDateTime.of(2026, 4, 11, 14, 0));

            GradeQuizSubmission gradeSub2 = GradeQuizSubmission.builder()
                    .student(student).grade("ELEMENTARY_3").subject("영어")
                    .score(7).totalQuestions(10).build();
            setId(gradeSub2, 2L);
            setField(gradeSub2, "submittedAt", LocalDateTime.of(2026, 4, 12, 9, 0));

            given(enrollmentRepository.findByStudentId(2L)).willReturn(List.of(enrollment));
            given(submissionRepository.findByStudentId(2L)).willReturn(List.of(sub1));
            given(gradeQuizSubmissionRepository.findByStudentIdOrderBySubmittedAtDesc(2L))
                    .willReturn(List.of(gradeSub2, gradeSub1));

            DashboardResponse.StudentDashboard result = dashboardService.getStudentDashboard(2L);

            assertThat(result.getCompletedQuizzes()).isEqualTo(3);
            assertThat(result.getRecentQuizResults()).hasSize(3);

            // sub1: 2/2=100%, gradeSub1: 8/10=80%, gradeSub2: 7/10=70% → 평균 83.3
            assertThat(result.getAverageScore()).isEqualTo(83.3);

            // 학년별 퀴즈 타이틀에 한글 학년 라벨이 포함된다
            List<String> titles = result.getRecentQuizResults().stream()
                    .map(DashboardResponse.QuizResult::getQuizTitle).toList();
            assertThat(titles).anyMatch(t -> t.contains("중학 2학년") && t.contains("수학"));
            assertThat(titles).anyMatch(t -> t.contains("초등 3학년") && t.contains("영어"));
            assertThat(titles).anyMatch(t -> t.contains("1주차 퀴즈"));
        }

        @Test
        @DisplayName("최근 결과는 최신순으로 정렬되고 최대 10개이다")
        void getStudentDashboard_sortedAndLimited() throws Exception {
            CourseEnrollment enrollment = CourseEnrollment.builder().course(course).student(student).build();
            setId(enrollment, 1L);

            // 11개의 학년별 퀴즈 생성 (10개 제한 테스트)
            List<GradeQuizSubmission> gradeSubs = new java.util.ArrayList<>();
            for (int i = 1; i <= 11; i++) {
                GradeQuizSubmission gs = GradeQuizSubmission.builder()
                        .student(student).grade("MIDDLE_2").subject("수학")
                        .score(i).totalQuestions(10).build();
                setId(gs, (long) i);
                setField(gs, "submittedAt", LocalDateTime.of(2026, 4, i, 10, 0));
                gradeSubs.add(gs);
            }
            Collections.reverse(gradeSubs); // 최신순 정렬

            given(enrollmentRepository.findByStudentId(2L)).willReturn(List.of(enrollment));
            given(submissionRepository.findByStudentId(2L)).willReturn(Collections.emptyList());
            given(gradeQuizSubmissionRepository.findByStudentIdOrderBySubmittedAtDesc(2L))
                    .willReturn(gradeSubs);

            DashboardResponse.StudentDashboard result = dashboardService.getStudentDashboard(2L);

            assertThat(result.getCompletedQuizzes()).isEqualTo(11);
            assertThat(result.getRecentQuizResults()).hasSize(10);

            // 최신순 정렬 확인 (첫 번째가 가장 최신)
            String firstSubmittedAt = result.getRecentQuizResults().get(0).getSubmittedAt();
            String lastSubmittedAt = result.getRecentQuizResults().get(9).getSubmittedAt();
            assertThat(firstSubmittedAt).isGreaterThan(lastSubmittedAt);
        }
    }

    @Nested
    @DisplayName("절약 시간 조회")
    class GetTimeSaved {

        @Test
        @DisplayName("시간과 분이 정상 포맷팅된다")
        void getTimeSaved_success() {
            given(aiLogRepository.getTotalTimeSavedByTeacherId(1L)).willReturn(5400);  // 1시간 30분
            given(aiLogRepository.getGenerationCountByTeacherId(1L)).willReturn(10L);

            DashboardResponse.TimeSaved result = dashboardService.getTimeSaved(1L);

            assertThat(result.getTotalSeconds()).isEqualTo(5400);
            assertThat(result.getGenerationCount()).isEqualTo(10L);
            assertThat(result.getFormatted()).isEqualTo("1시간 30분");
        }

        @Test
        @DisplayName("절약 시간이 0이면 0시간 0분을 반환한다")
        void getTimeSaved_zero() {
            given(aiLogRepository.getTotalTimeSavedByTeacherId(1L)).willReturn(0);
            given(aiLogRepository.getGenerationCountByTeacherId(1L)).willReturn(0L);

            DashboardResponse.TimeSaved result = dashboardService.getTimeSaved(1L);

            assertThat(result.getTotalSeconds()).isEqualTo(0);
            assertThat(result.getFormatted()).isEqualTo("0시간 0분");
        }
    }
}
