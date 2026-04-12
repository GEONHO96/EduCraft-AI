package com.educraftai.domain.user.service;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.common.EmailService;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.global.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService 단위 테스트")
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private EmailService emailService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("test@edu.com")
                .password("encodedPassword")
                .name("홍길동")
                .role(User.Role.STUDENT)
                .grade("MIDDLE_1")
                .build();
        // Reflection으로 ID 설정
        try {
            var field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(testUser, 1L);
        } catch (Exception ignored) {}
    }

    @Nested
    @DisplayName("회원가입")
    class Register {

        @Test
        @DisplayName("정상 회원가입 시 토큰을 반환한다")
        void register_success() {
            // given
            AuthRequest.Register request = new AuthRequest.Register();
            request.setEmail("new@edu.com");
            request.setPassword("password123");
            request.setName("김학생");
            request.setRole(User.Role.STUDENT);
            request.setGrade("MIDDLE_1");

            given(userRepository.existsByEmail("new@edu.com")).willReturn(false);
            given(passwordEncoder.encode("password123")).willReturn("encoded");
            given(userRepository.save(any(User.class))).willAnswer(inv -> {
                User u = inv.getArgument(0);
                try {
                    var field = User.class.getDeclaredField("id");
                    field.setAccessible(true);
                    field.set(u, 2L);
                } catch (Exception ignored) {}
                return u;
            });
            given(jwtTokenProvider.createToken(anyLong(), anyString(), anyString())).willReturn("jwt-token");

            // when
            AuthResponse.Token result = authService.register(request);

            // then
            assertThat(result.getAccessToken()).isEqualTo("jwt-token");
            assertThat(result.getUser().getEmail()).isEqualTo("new@edu.com");
            assertThat(result.getUser().getName()).isEqualTo("김학생");
            then(userRepository).should().save(any(User.class));
        }

        @Test
        @DisplayName("중복 이메일로 가입 시 예외를 던진다")
        void register_duplicateEmail_throwsException() {
            // given
            AuthRequest.Register request = new AuthRequest.Register();
            request.setEmail("test@edu.com");
            request.setPassword("password123");
            request.setName("홍길동");
            request.setRole(User.Role.STUDENT);

            given(userRepository.existsByEmail("test@edu.com")).willReturn(true);

            // when & then
            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.DUPLICATE_EMAIL);
        }
    }

    @Nested
    @DisplayName("로그인")
    class Login {

        @Test
        @DisplayName("올바른 자격 증명으로 로그인 시 토큰을 반환한다")
        void login_success() {
            // given
            AuthRequest.Login request = new AuthRequest.Login();
            request.setEmail("test@edu.com");
            request.setPassword("password123");

            given(userRepository.findByEmail("test@edu.com")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("password123", "encodedPassword")).willReturn(true);
            given(jwtTokenProvider.createToken(1L, "test@edu.com", "STUDENT")).willReturn("jwt-token");

            // when
            AuthResponse.Token result = authService.login(request);

            // then
            assertThat(result.getAccessToken()).isEqualTo("jwt-token");
            assertThat(result.getUser().getEmail()).isEqualTo("test@edu.com");
        }

        @Test
        @DisplayName("잘못된 비밀번호로 로그인 시 예외를 던진다")
        void login_wrongPassword_throwsException() {
            // given
            AuthRequest.Login request = new AuthRequest.Login();
            request.setEmail("test@edu.com");
            request.setPassword("wrong");

            given(userRepository.findByEmail("test@edu.com")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("wrong", "encodedPassword")).willReturn(false);

            // when & then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.INVALID_CREDENTIALS);
        }

        @Test
        @DisplayName("존재하지 않는 이메일로 로그인 시 예외를 던진다")
        void login_emailNotFound_throwsException() {
            // given
            AuthRequest.Login request = new AuthRequest.Login();
            request.setEmail("notfound@edu.com");
            request.setPassword("password123");

            given(userRepository.findByEmail("notfound@edu.com")).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    @Nested
    @DisplayName("내 정보 조회")
    class GetMyInfo {

        @Test
        @DisplayName("사용자 정보를 정상 반환한다")
        void getMyInfo_success() {
            given(userRepository.findById(1L)).willReturn(Optional.of(testUser));

            AuthResponse.UserInfo result = authService.getMyInfo(1L);

            assertThat(result.getEmail()).isEqualTo("test@edu.com");
            assertThat(result.getName()).isEqualTo("홍길동");
        }

        @Test
        @DisplayName("존재하지 않는 사용자 조회 시 예외를 던진다")
        void getMyInfo_notFound_throwsException() {
            given(userRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> authService.getMyInfo(999L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("이메일 찾기")
    class FindEmail {

        @Test
        @DisplayName("이름으로 마스킹된 이메일 목록을 반환한다")
        void findEmail_success() {
            AuthRequest.FindEmail request = new AuthRequest.FindEmail();
            request.setName("홍길동");

            given(userRepository.findByName("홍길동")).willReturn(List.of(testUser));

            List<String> result = authService.findEmail(request);

            assertThat(result).hasSize(1);
            assertThat(result.get(0)).contains("@edu.com");
            // 마스킹 확인: tes*@edu.com 형태
            assertThat(result.get(0)).doesNotStartWith("test@");
        }

        @Test
        @DisplayName("일치하는 사용자가 없으면 예외를 던진다")
        void findEmail_noUser_throwsException() {
            AuthRequest.FindEmail request = new AuthRequest.FindEmail();
            request.setName("없는사람");

            given(userRepository.findByName("없는사람")).willReturn(List.of());

            assertThatThrownBy(() -> authService.findEmail(request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("비밀번호 재설정")
    class ResetPassword {

        @Test
        @DisplayName("임시 비밀번호를 생성하고 이메일을 발송한다")
        void resetPassword_success() {
            AuthRequest.ResetPassword request = new AuthRequest.ResetPassword();
            request.setEmail("test@edu.com");
            request.setName("홍길동");

            given(userRepository.findByEmailAndName("test@edu.com", "홍길동"))
                    .willReturn(Optional.of(testUser));
            given(passwordEncoder.encode(anyString())).willReturn("newEncoded");

            authService.resetPassword(request);

            then(emailService).should().sendTempPasswordEmail(eq("test@edu.com"), eq("홍길동"), anyString());
        }

        @Test
        @DisplayName("소셜 로그인 사용자는 비밀번호 재설정 시 예외를 던진다")
        void resetPassword_socialUser_throwsException() {
            User socialUser = User.builder()
                    .email("social@edu.com")
                    .password(null)
                    .name("소셜유저")
                    .role(User.Role.STUDENT)
                    .build();

            AuthRequest.ResetPassword request = new AuthRequest.ResetPassword();
            request.setEmail("social@edu.com");
            request.setName("소셜유저");

            given(userRepository.findByEmailAndName("social@edu.com", "소셜유저"))
                    .willReturn(Optional.of(socialUser));

            assertThatThrownBy(() -> authService.resetPassword(request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.INVALID_INPUT);
        }
    }

    @Nested
    @DisplayName("비밀번호 변경")
    class ChangePassword {

        @Test
        @DisplayName("올바른 임시 비밀번호로 새 비밀번호를 설정한다")
        void changePasswordWithTemp_success() {
            AuthRequest.ChangePassword request = new AuthRequest.ChangePassword();
            request.setEmail("test@edu.com");
            request.setTempPassword("tempPw123");
            request.setNewPassword("newPw456");

            given(userRepository.findByEmail("test@edu.com")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("tempPw123", "encodedPassword")).willReturn(true);
            given(passwordEncoder.encode("newPw456")).willReturn("newEncoded");

            authService.changePasswordWithTemp(request);

            assertThat(testUser.getPassword()).isEqualTo("newEncoded");
        }

        @Test
        @DisplayName("잘못된 임시 비밀번호로 변경 시 예외를 던진다")
        void changePasswordWithTemp_wrongTemp_throwsException() {
            AuthRequest.ChangePassword request = new AuthRequest.ChangePassword();
            request.setEmail("test@edu.com");
            request.setTempPassword("wrongTemp");
            request.setNewPassword("newPw456");

            given(userRepository.findByEmail("test@edu.com")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("wrongTemp", "encodedPassword")).willReturn(false);

            assertThatThrownBy(() -> authService.changePasswordWithTemp(request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    @Test
    @DisplayName("이메일 중복 확인 - 존재하면 true")
    void existsByEmail_returnsTrue() {
        given(userRepository.existsByEmail("test@edu.com")).willReturn(true);
        assertThat(authService.existsByEmail("test@edu.com")).isTrue();
    }

    @Test
    @DisplayName("이메일 중복 확인 - 없으면 false")
    void existsByEmail_returnsFalse() {
        given(userRepository.existsByEmail("new@edu.com")).willReturn(false);
        assertThat(authService.existsByEmail("new@edu.com")).isFalse();
    }
}
