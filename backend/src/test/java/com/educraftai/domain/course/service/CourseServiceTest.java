package com.educraftai.domain.course.service;

import com.educraftai.domain.course.dto.CourseRequest;
import com.educraftai.domain.course.dto.CourseResponse;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CourseService 단위 테스트")
class CourseServiceTest {

    @InjectMocks private CourseService courseService;
    @Mock private CourseRepository courseRepository;
    @Mock private CourseEnrollmentRepository enrollmentRepository;
    @Mock private UserRepository userRepository;

    private User teacher;
    private User student;
    private Course course;

    @BeforeEach
    void setUp() throws Exception {
        teacher = User.builder().email("teacher@edu.com").name("김교수").role(User.Role.TEACHER).build();
        setId(teacher, 1L);

        student = User.builder().email("student@edu.com").name("홍학생").role(User.Role.STUDENT).grade("MIDDLE_1").build();
        setId(student, 2L);

        course = Course.builder().teacher(teacher).title("수학 기초").subject("수학").description("기초 수학 강의").build();
        setId(course, 10L);
    }

    private void setId(Object obj, Long id) throws Exception {
        var field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    @Nested
    @DisplayName("강의 생성")
    class CreateCourse {

        @Test
        @DisplayName("교강사가 강의를 정상 생성한다")
        void createCourse_success() {
            CourseRequest.Create request = new CourseRequest.Create();
            request.setTitle("웹 프로그래밍");
            request.setSubject("컴퓨터공학");
            request.setDescription("HTML/CSS/JS 입문");

            given(userRepository.findById(1L)).willReturn(Optional.of(teacher));
            given(courseRepository.save(any(Course.class))).willAnswer(inv -> inv.getArgument(0));

            CourseResponse.Info result = courseService.createCourse(1L, request);

            assertThat(result.getTitle()).isEqualTo("웹 프로그래밍");
            assertThat(result.getSubject()).isEqualTo("컴퓨터공학");
            then(courseRepository).should().save(any(Course.class));
        }

        @Test
        @DisplayName("존재하지 않는 교강사로 생성 시 예외를 던진다")
        void createCourse_userNotFound() {
            CourseRequest.Create request = new CourseRequest.Create();
            given(userRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> courseService.createCourse(999L, request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("강의 조회")
    class GetCourses {

        @Test
        @DisplayName("교강사는 자신이 개설한 강의 목록을 조회한다")
        void getMyCourses_teacher() {
            given(userRepository.findById(1L)).willReturn(Optional.of(teacher));
            given(courseRepository.findByTeacherId(1L)).willReturn(List.of(course));

            List<CourseResponse.Info> result = courseService.getMyCourses(1L);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTitle()).isEqualTo("수학 기초");
        }

        @Test
        @DisplayName("학생은 수강 중인 강의 목록을 조회한다")
        void getMyCourses_student() {
            CourseEnrollment enrollment = CourseEnrollment.builder().course(course).student(student).build();
            given(userRepository.findById(2L)).willReturn(Optional.of(student));
            given(enrollmentRepository.findByStudentId(2L)).willReturn(List.of(enrollment));

            List<CourseResponse.Info> result = courseService.getMyCourses(2L);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTitle()).isEqualTo("수학 기초");
        }

        @Test
        @DisplayName("강의 단건 조회 - 존재하면 정보를 반환한다")
        void getCourse_success() {
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));

            CourseResponse.Info result = courseService.getCourse(10L);

            assertThat(result.getTitle()).isEqualTo("수학 기초");
        }

        @Test
        @DisplayName("강의 단건 조회 - 존재하지 않으면 예외를 던진다")
        void getCourse_notFound() {
            given(courseRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> courseService.getCourse(999L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.COURSE_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("수강 신청")
    class Enroll {

        @Test
        @DisplayName("학생이 정상 수강 신청한다")
        void enrollStudent_success() {
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));
            given(userRepository.findById(2L)).willReturn(Optional.of(student));
            given(enrollmentRepository.existsByCourseIdAndStudentId(10L, 2L)).willReturn(false);

            courseService.enrollStudent(10L, 2L);

            then(enrollmentRepository).should().save(any(CourseEnrollment.class));
        }

        @Test
        @DisplayName("이미 수강 중인 강의에 재신청 시 예외를 던진다")
        void enrollStudent_alreadyEnrolled() {
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));
            given(userRepository.findById(2L)).willReturn(Optional.of(student));
            given(enrollmentRepository.existsByCourseIdAndStudentId(10L, 2L)).willReturn(true);

            assertThatThrownBy(() -> courseService.enrollStudent(10L, 2L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.ALREADY_ENROLLED);
        }

        @Test
        @DisplayName("존재하지 않는 강의에 수강 신청 시 예외를 던진다")
        void enrollStudent_courseNotFound() {
            given(courseRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> courseService.enrollStudent(999L, 2L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.COURSE_NOT_FOUND);
        }
    }

    @Test
    @DisplayName("전체 강의 탐색 시 수강생 수와 수강 여부를 포함한다")
    void browseAllCourses() {
        given(courseRepository.findAllByOrderByCreatedAtDesc()).willReturn(List.of(course));
        given(enrollmentRepository.countByCourseId(10L)).willReturn(5L);
        given(enrollmentRepository.existsByCourseIdAndStudentId(10L, 2L)).willReturn(true);

        List<CourseResponse.Browse> result = courseService.browseAllCourses(2L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStudentCount()).isEqualTo(5);
        assertThat(result.get(0).isEnrolled()).isTrue();
    }
}
