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
import java.util.stream.Collectors;

/**
 * 인증/인가 비즈니스 로직 서비스
 * 회원가입, 로그인, 비밀번호 관리, 이메일 찾기 등을 담당한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private static final SecureRandom random = new SecureRandom();

    @PersistenceContext
    private EntityManager em;

    /** 이메일 중복 확인 */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /** 회원가입 - 이메일 중복 검사 후 사용자 생성 및 JWT 발급 */
    @Transactional
    public AuthResponse.Token register(AuthRequest.Register request) {
        log.info("[회원가입 요청] email={}, name={}, role={}", request.getEmail(), request.getName(), request.getRole());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("[회원가입 실패] 이메일 중복 - email={}", request.getEmail());
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(request.getRole())
                .grade(request.getGrade())
                .build();

        userRepository.save(user);
        log.info("[회원가입 성공] userId={}, email={}, role={}", user.getId(), user.getEmail(), user.getRole());

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.Token.builder()
                .accessToken(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    /** 로그인 - 이메일/비밀번호 검증 후 JWT 발급 */
    public AuthResponse.Token login(AuthRequest.Login request) {
        log.info("[로그인 요청] email={}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("[로그인 실패] 존재하지 않는 이메일 - email={}", request.getEmail());
                    return new BusinessException(ErrorCode.INVALID_CREDENTIALS);
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[로그인 실패] 비밀번호 불일치 - email={}", request.getEmail());
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        log.info("[로그인 성공] userId={}, email={}, role={}", user.getId(), user.getEmail(), user.getRole());
        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.Token.builder()
                .accessToken(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    /** 현재 사용자 정보 조회 — JWT는 유효하지만 DB에 유저가 없으면 재로그인 유도 */
    public AuthResponse.UserInfo getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("[인증 만료] JWT의 userId={}가 DB에 존재하지 않음 — 재로그인 필요", userId);
                    return new BusinessException(ErrorCode.UNAUTHORIZED);
                });
        return AuthResponse.UserInfo.from(user);
    }

    /** 프로필 수정 — 닉네임, 프로필 이미지 변경 */
    @Transactional
    public AuthResponse.UserInfo updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname().isBlank() ? null : request.getNickname().trim());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage().isBlank() ? null : request.getProfileImage());
        }

        log.info("[프로필 수정] userId={}, nickname={}", userId, user.getNickname());
        return AuthResponse.UserInfo.from(user);
    }

    /** 이름으로 이메일 찾기 (일부 마스킹 처리) */
    public List<String> findEmail(AuthRequest.FindEmail request) {
        List<User> users = userRepository.findByName(request.getName());
        if (users.isEmpty()) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return users.stream()
                .filter(u -> u.getEmail() != null)
                .map(u -> maskEmail(u.getEmail()))
                .collect(Collectors.toList());
    }

    /** 비밀번호 초기화 - 이메일만으로 사용자 조회 후 임시 비밀번호 발급 */
    @Transactional
    public String resetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 소셜 로그인 전용 계정(비밀번호 없음)은 비밀번호 재설정 불가
        if (user.getPassword() == null) {
            throw new BusinessException(ErrorCode.SOCIAL_LOGIN_NO_PASSWORD);
        }

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        log.info("[Auth] 임시 비밀번호 발급 - email: {}", email);

        // 이메일 발송 시도 (실패해도 임시 비밀번호는 DB에 저장됨)
        emailService.sendTempPasswordEmail(email, user.getName(), tempPassword);

        return tempPassword;
    }

    /** 임시 비밀번호 검증 후 새 비밀번호로 변경 */
    @Transactional
    public void changePasswordWithTemp(AuthRequest.ChangePassword request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getTempPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    }

    /** 로그인 상태에서 현재 비밀번호 확인 후 새 비밀번호로 변경 */
    @Transactional
    public void changeMyPassword(Long userId, AuthRequest.ChangeMyPassword request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 소셜 로그인 사용자는 비밀번호 변경 불가
        if (user.getPassword() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        // 새 비밀번호 길이 검증
        if (request.getNewPassword().length() < 6) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        log.info("[비밀번호 변경] userId={}", userId);
    }

    /** 계정 탈퇴 - 비밀번호 확인 후 사용자 및 관련 데이터 모두 삭제 */
    @Transactional
    public void deleteAccount(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 일반 로그인 사용자: 비밀번호 검증
        if (user.getPassword() != null) {
            if (password == null || !passwordEncoder.matches(password, user.getPassword())) {
                throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
            }
        }

        deleteAllUserRelatedData(userId);
        userRepository.delete(user);
        log.info("[계정 탈퇴] userId={}, email={}", userId, user.getEmail());
    }

    /** 사용자와 연관된 모든 데이터를 FK 의존 순서에 맞게 삭제 */
    private void deleteAllUserRelatedData(Long userId) {
        // ── 1. SNS: 사용자 게시글의 댓글·좋아요 (다른 사용자 포함) ──
        nativeDelete("DELETE FROM post_comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = :uid)", userId);
        nativeDelete("DELETE FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE author_id = :uid)", userId);

        // ── 2. SNS: 다른 게시글에 남긴 사용자의 댓글·좋아요 ──
        nativeDelete("DELETE FROM post_comments WHERE author_id = :uid", userId);
        nativeDelete("DELETE FROM post_likes WHERE user_id = :uid", userId);

        // ── 3. SNS: 사용자 게시글, 팔로우 ──
        nativeDelete("DELETE FROM posts WHERE author_id = :uid", userId);
        nativeDelete("DELETE FROM follows WHERE follower_id = :uid OR following_id = :uid", userId);

        // ── 4. 퀴즈: 사용자(학생)의 제출 기록 ──
        nativeDelete("DELETE FROM quiz_submissions WHERE student_id = :uid", userId);
        nativeDelete("DELETE FROM grade_quiz_submissions WHERE student_id = :uid", userId);

        // ── 5. 수강: 사용자(학생) 수강 내역 + 사용자(교사) 강의의 수강 내역 ──
        nativeDelete("DELETE FROM course_enrollments WHERE student_id = :uid", userId);
        nativeDelete("DELETE FROM course_enrollments WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = :uid)", userId);

        // ── 6. 교사 강의 체인: quiz_submissions → quizzes → materials → curriculums → courses ──
        nativeDelete("DELETE FROM quiz_submissions WHERE quiz_id IN (SELECT q.id FROM quizzes q JOIN materials m ON q.material_id = m.id JOIN curriculums c ON m.curriculum_id = c.id JOIN courses co ON c.course_id = co.id WHERE co.teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM quizzes WHERE material_id IN (SELECT m.id FROM materials m JOIN curriculums c ON m.curriculum_id = c.id JOIN courses co ON c.course_id = co.id WHERE co.teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM materials WHERE curriculum_id IN (SELECT c.id FROM curriculums c JOIN courses co ON c.course_id = co.id WHERE co.teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM curriculums WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = :uid)", userId);
        nativeDelete("DELETE FROM courses WHERE teacher_id = :uid", userId);

        // ── 7. AI 로그, 통계 ──
        nativeDelete("DELETE FROM ai_generation_logs WHERE teacher_id = :uid", userId);
        nativeDelete("DELETE FROM daily_ai_usage_stats WHERE teacher_id = :uid", userId);
        nativeDelete("DELETE FROM daily_learning_stats WHERE student_id = :uid", userId);

        // ── 8. 구독, 결제 ──
        nativeDelete("DELETE FROM payments WHERE user_id = :uid", userId);
        nativeDelete("DELETE FROM subscriptions WHERE user_id = :uid", userId);
    }

    private void nativeDelete(String sql, Long userId) {
        em.createNativeQuery(sql).setParameter("uid", userId).executeUpdate();
    }

    /** 이메일 로컬 파트를 마스킹 (예: abc***@domain.com) */
    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex <= 2) return email;
        String local = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        int showCount = Math.min(3, local.length());
        return local.substring(0, showCount) + "*".repeat(local.length() - showCount) + domain;
    }

    /** 8자리 임시 비밀번호 생성 (혼동 문자 제외) */
    private String generateTempPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
