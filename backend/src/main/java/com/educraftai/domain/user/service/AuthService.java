package com.educraftai.domain.user.service;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.dto.ProfileUpdateRequest;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.common.EmailService;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.global.security.JwtTokenProvider;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

/**
 * 인증·계정 관리 서비스.
 * <p>회원가입, 로그인, 비밀번호 재설정/변경, 이메일 찾기, 프로필 수정, 계정 탈퇴를 담당한다.
 *
 * <p>규약:
 * <ul>
 *   <li>읽기 메서드는 클래스 레벨 {@code @Transactional(readOnly=true)}로 처리, 쓰기 메서드만 개별 {@code @Transactional}</li>
 *   <li>로그에는 이메일 원문을 찍지 않고 {@link #maskEmail(String)}을 거친다 (PII 보호)</li>
 *   <li>엔티티 조회는 내부 헬퍼({@link #findUserById(Long, ErrorCode)}, {@link #findUserByEmail(String, ErrorCode)})를 사용</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    /** 임시 비밀번호 길이 */
    private static final int TEMP_PASSWORD_LENGTH = 8;
    /** 임시 비밀번호에 사용할 문자 (혼동되기 쉬운 0/O/1/I/l 제외) */
    private static final String TEMP_PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    /** 새 비밀번호 최소 길이 */
    private static final int MIN_PASSWORD_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @PersistenceContext
    private EntityManager em;

    // ─── 가입/로그인 ─────────────────────────────────────────

    /** 이메일 중복 여부 */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /** 회원가입 → 이메일 중복 검사 → 사용자 생성 → JWT 발급 */
    @Transactional
    public AuthResponse.Token register(AuthRequest.Register request) {
        log.info("[Auth] 회원가입 요청 email={} role={}", maskEmail(request.getEmail()), request.getRole());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("[Auth] 회원가입 실패(중복) email={}", maskEmail(request.getEmail()));
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = userRepository.save(User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(request.getRole())
                .grade(request.getGrade())
                .build());

        log.info("[Auth] 회원가입 성공 userId={} role={}", user.getId(), user.getRole());
        return issueToken(user);
    }

    /** 이메일/비밀번호 검증 후 JWT 발급 */
    public AuthResponse.Token login(AuthRequest.Login request) {
        log.info("[Auth] 로그인 요청 email={}", maskEmail(request.getEmail()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("[Auth] 로그인 실패(미가입) email={}", maskEmail(request.getEmail()));
                    return new BusinessException(ErrorCode.INVALID_CREDENTIALS);
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[Auth] 로그인 실패(비밀번호) userId={}", user.getId());
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        log.info("[Auth] 로그인 성공 userId={} role={}", user.getId(), user.getRole());
        return issueToken(user);
    }

    // ─── 내 정보 ─────────────────────────────────────────────

    /** 현재 사용자 정보 조회 — 토큰은 유효하지만 DB에 유저가 없으면 재로그인 유도 */
    public AuthResponse.UserInfo getMyInfo(Long userId) {
        return AuthResponse.UserInfo.from(findUserById(userId, ErrorCode.UNAUTHORIZED));
    }

    /** 프로필 수정 — 닉네임, 프로필 이미지 */
    @Transactional
    public AuthResponse.UserInfo updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = findUserById(userId);

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname().isBlank() ? null : request.getNickname().trim());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage().isBlank() ? null : request.getProfileImage());
        }

        log.info("[Auth] 프로필 수정 userId={} nickname={}", userId, user.getNickname());
        return AuthResponse.UserInfo.from(user);
    }

    // ─── 이메일 찾기 / 비밀번호 재설정 ────────────────────────

    /** 이름으로 이메일 찾기 (마스킹 처리) */
    public List<String> findEmail(AuthRequest.FindEmail request) {
        List<User> users = userRepository.findByName(request.getName());
        if (users.isEmpty()) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return users.stream()
                .filter(u -> u.getEmail() != null)
                .map(u -> maskEmail(u.getEmail()))
                .toList();
    }

    /** 비밀번호 초기화 — 이메일로 사용자 조회 후 임시 비밀번호 발급 */
    @Transactional
    public String resetPassword(String email) {
        User user = findUserByEmail(email, ErrorCode.USER_NOT_FOUND);

        // 소셜 로그인 전용 계정은 비밀번호 자체가 없어 재설정 불가
        if (user.getPassword() == null) {
            throw new BusinessException(ErrorCode.SOCIAL_LOGIN_NO_PASSWORD);
        }

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        log.info("[Auth] 임시 비밀번호 발급 userId={}", user.getId());

        // 이메일 발송 시도 (실패해도 임시 비밀번호는 DB에 이미 저장됨)
        emailService.sendTempPasswordEmail(email, user.getName(), tempPassword);

        return tempPassword;
    }

    /** 임시 비밀번호 검증 후 새 비밀번호로 변경 */
    @Transactional
    public void changePasswordWithTemp(AuthRequest.ChangePassword request) {
        User user = findUserByEmail(request.getEmail(), ErrorCode.USER_NOT_FOUND);

        if (!passwordEncoder.matches(request.getTempPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        log.info("[Auth] 임시 비밀번호로 변경 완료 userId={}", user.getId());
    }

    /** 로그인 상태에서 현재 비밀번호 검증 후 새 비밀번호로 변경 */
    @Transactional
    public void changeMyPassword(Long userId, AuthRequest.ChangeMyPassword request) {
        User user = findUserById(userId);

        if (user.getPassword() == null) {
            throw new BusinessException(ErrorCode.SOCIAL_LOGIN_NO_PASSWORD);
        }
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (request.getNewPassword().length() < MIN_PASSWORD_LENGTH) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        log.info("[Auth] 비밀번호 변경 userId={}", userId);
    }

    // ─── 계정 탈퇴 ──────────────────────────────────────────

    /** 계정 탈퇴 — 비밀번호 검증 후 사용자 및 관련 데이터 모두 삭제 */
    @Transactional
    public void deleteAccount(Long userId, String password) {
        User user = findUserById(userId);

        // 일반 로그인 사용자는 비밀번호 필수 확인
        if (user.getPassword() != null) {
            if (password == null || !passwordEncoder.matches(password, user.getPassword())) {
                throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
            }
        }

        deleteAllUserRelatedData(userId);
        userRepository.delete(user);
        log.info("[Auth] 계정 탈퇴 userId={}", userId);
    }

    /**
     * 사용자와 연관된 모든 데이터를 FK 의존 순서에 맞게 삭제.
     *
     * <p>TODO: 도메인 경계를 위해 각 도메인 Repository나 CleanupService로 분할 이관 필요 (Phase 5).
     */
    private void deleteAllUserRelatedData(Long userId) {
        // 1. SNS: 사용자 게시글의 댓글·좋아요 (다른 사용자 포함)
        nativeDelete("DELETE FROM post_comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = :uid)", userId);
        nativeDelete("DELETE FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE author_id = :uid)", userId);
        // 2. SNS: 다른 글에 남긴 사용자의 댓글·좋아요
        nativeDelete("DELETE FROM post_comments WHERE author_id = :uid", userId);
        nativeDelete("DELETE FROM post_likes WHERE user_id = :uid", userId);
        // 3. SNS: 사용자 게시글, 팔로우
        nativeDelete("DELETE FROM posts WHERE author_id = :uid", userId);
        nativeDelete("DELETE FROM follows WHERE follower_id = :uid OR following_id = :uid", userId);
        // 4. 퀴즈: 사용자(학생)의 제출 기록
        nativeDelete("DELETE FROM quiz_submissions WHERE student_id = :uid", userId);
        nativeDelete("DELETE FROM grade_quiz_submissions WHERE student_id = :uid", userId);
        // 5. 수강: 사용자(학생) 수강 내역 + 사용자(교사) 강의의 수강 내역
        nativeDelete("DELETE FROM course_enrollments WHERE student_id = :uid", userId);
        nativeDelete("DELETE FROM course_enrollments WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = :uid)", userId);
        // 6. 교사 강의 체인: quiz_submissions → quizzes → materials → curriculums → courses
        nativeDelete("DELETE FROM quiz_submissions WHERE quiz_id IN (SELECT q.id FROM quizzes q JOIN materials m ON q.material_id = m.id JOIN curriculums c ON m.curriculum_id = c.id JOIN courses co ON c.course_id = co.id WHERE co.teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM quizzes WHERE material_id IN (SELECT m.id FROM materials m JOIN curriculums c ON m.curriculum_id = c.id JOIN courses co ON c.course_id = co.id WHERE co.teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM materials WHERE curriculum_id IN (SELECT c.id FROM curriculums c JOIN courses co ON c.course_id = co.id WHERE co.teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM curriculums WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM courses WHERE teacher_id = :uid", userId);
        // 7. AI 로그·통계
        nativeDelete("DELETE FROM ai_generation_logs WHERE teacher_id = :uid", userId);
        nativeDelete("DELETE FROM daily_ai_usage_stats WHERE teacher_id = :uid", userId);
        nativeDelete("DELETE FROM daily_learning_stats WHERE student_id = :uid", userId);
        // 8. 구독·결제
        nativeDelete("DELETE FROM payments WHERE user_id = :uid", userId);
        nativeDelete("DELETE FROM subscriptions WHERE user_id = :uid", userId);
    }

    // ─── 내부 헬퍼 ───────────────────────────────────────────

    private void nativeDelete(String sql, Long userId) {
        em.createNativeQuery(sql).setParameter("uid", userId).executeUpdate();
    }

    /** 사용자를 id로 조회하거나 USER_NOT_FOUND 예외 */
    private User findUserById(Long userId) {
        return findUserById(userId, ErrorCode.USER_NOT_FOUND);
    }

    /** 사용자를 id로 조회하거나 지정한 ErrorCode 예외 */
    private User findUserById(Long userId, ErrorCode onMissing) {
        return userRepository.findById(userId).orElseThrow(() -> new BusinessException(onMissing));
    }

    /** 사용자를 이메일로 조회하거나 지정한 ErrorCode 예외 */
    private User findUserByEmail(String email, ErrorCode onMissing) {
        return userRepository.findByEmail(email).orElseThrow(() -> new BusinessException(onMissing));
    }

    private AuthResponse.Token issueToken(User user) {
        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.Token.builder()
                .accessToken(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    /** 이메일 로컬 파트 마스킹 (예: abc***@domain.com) */
    private String maskEmail(String email) {
        if (email == null) return null;
        int at = email.indexOf('@');
        if (at <= 2) return email;
        String local = email.substring(0, at);
        String domain = email.substring(at);
        int show = Math.min(3, local.length());
        return local.substring(0, show) + "*".repeat(local.length() - show) + domain;
    }

    /** 8자리 임시 비밀번호 생성 (0/O/1/I/l 등 혼동 문자 제외) */
    private String generateTempPassword() {
        StringBuilder sb = new StringBuilder(TEMP_PASSWORD_LENGTH);
        for (int i = 0; i < TEMP_PASSWORD_LENGTH; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(RANDOM.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
