package com.educraftai.domain.progress.service;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.progress.entity.Certificate;
import com.educraftai.domain.progress.entity.LearningProgress;
import com.educraftai.domain.progress.repository.CertificateRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

/**
 * {@link CertificateService} 단위 테스트.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CertificateService 단위 테스트")
class CertificateServiceTest {

    @InjectMocks private CertificateService certificateService;
    @Mock private CertificateRepository certificateRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private UserRepository userRepository;

    private User user;
    private Course course;

    @org.junit.jupiter.api.BeforeEach
    void setUp() throws Exception {
        user = User.builder().email("s@edu.com").name("홍길동").role(User.Role.STUDENT).build();
        setId(user, 1L);
        course = Course.builder().title("알고리즘 입문").subject("수학").teacher(user).build();
        setId(course, 10L);
    }

    private static void setId(Object obj, Long id) throws Exception {
        Field field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    @Nested
    @DisplayName("issueIfEligible")
    class IssueIfEligible {

        @Test
        @DisplayName("수료 조건 만족 + 기존 발급 없음 → 신규 발급")
        void issuesNewCertificate() {
            LearningProgress progress = LearningProgress.builder()
                    .userId(1L).courseId(10L).progressRate(100.0).build();
            progress.markCompleted();

            given(certificateRepository.existsByUserIdAndCourseId(1L, 10L)).willReturn(false);
            given(userRepository.findById(1L)).willReturn(Optional.of(user));
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));
            given(certificateRepository.save(any(Certificate.class))).willAnswer(inv -> inv.getArgument(0));

            Certificate result = certificateService.issueIfEligible(progress);

            assertThat(result).isNotNull();
            assertThat(result.getStudentName()).isEqualTo("홍길동");
            assertThat(result.getCourseTitle()).isEqualTo("알고리즘 입문");
            assertThat(result.getCertificateNumber()).startsWith("EDU-").contains("-10-1");
            assertThat(result.getFinalScore()).isEqualTo(100.0);
        }

        @Test
        @DisplayName("completedAt이 null이면 no-op (null 반환)")
        void notCompletedYet() {
            LearningProgress progress = LearningProgress.builder()
                    .userId(1L).courseId(10L).build();  // completedAt 없음

            Certificate result = certificateService.issueIfEligible(progress);

            assertThat(result).isNull();
            then(certificateRepository).should(never()).save(any());
        }

        @Test
        @DisplayName("이미 발급된 경우 no-op")
        void alreadyIssued() {
            LearningProgress progress = LearningProgress.builder()
                    .userId(1L).courseId(10L).build();
            progress.markCompleted();
            given(certificateRepository.existsByUserIdAndCourseId(1L, 10L)).willReturn(true);

            Certificate result = certificateService.issueIfEligible(progress);

            assertThat(result).isNull();
            then(certificateRepository).should(never()).save(any());
        }

        @Test
        @DisplayName("닉네임이 있으면 닉네임을 학생명으로 사용")
        void prefersNickname() {
            user.setNickname("닉네임맨");
            LearningProgress progress = LearningProgress.builder()
                    .userId(1L).courseId(10L).progressRate(100.0).build();
            progress.markCompleted();

            given(certificateRepository.existsByUserIdAndCourseId(1L, 10L)).willReturn(false);
            given(userRepository.findById(1L)).willReturn(Optional.of(user));
            given(courseRepository.findById(10L)).willReturn(Optional.of(course));
            given(certificateRepository.save(any(Certificate.class))).willAnswer(inv -> inv.getArgument(0));

            Certificate result = certificateService.issueIfEligible(progress);

            assertThat(result.getStudentName()).isEqualTo("닉네임맨");
        }
    }

    @Nested
    @DisplayName("getByCertificateNumber")
    class GetByCertificateNumber {

        @Test
        @DisplayName("본인 수료증 조회 성공")
        void ownCertificate() {
            Certificate cert = Certificate.builder()
                    .userId(1L).courseId(10L)
                    .certificateNumber("EDU-20260420-10-1")
                    .issuedAt(LocalDateTime.now()).finalScore(95.0)
                    .studentName("홍길동").courseTitle("알고리즘 입문").build();
            given(certificateRepository.findByCertificateNumber("EDU-20260420-10-1"))
                    .willReturn(Optional.of(cert));

            var info = certificateService.getByCertificateNumber(1L, "EDU-20260420-10-1");

            assertThat(info.getStudentName()).isEqualTo("홍길동");
            assertThat(info.getCourseTitle()).isEqualTo("알고리즘 입문");
        }

        @Test
        @DisplayName("타인 수료증 접근 시 CERTIFICATE_NOT_FOUND")
        void otherUserCertificate() {
            Certificate cert = Certificate.builder()
                    .userId(999L).courseId(10L).certificateNumber("EDU-X")
                    .issuedAt(LocalDateTime.now()).finalScore(95.0)
                    .studentName("남").courseTitle("과정").build();
            given(certificateRepository.findByCertificateNumber("EDU-X"))
                    .willReturn(Optional.of(cert));

            assertThatThrownBy(() -> certificateService.getByCertificateNumber(1L, "EDU-X"))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.CERTIFICATE_NOT_FOUND);
        }

        @Test
        @DisplayName("존재하지 않는 수료증 번호")
        void notFound() {
            given(certificateRepository.findByCertificateNumber("NOPE"))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() -> certificateService.getByCertificateNumber(1L, "NOPE"))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.CERTIFICATE_NOT_FOUND);
        }
    }
}
