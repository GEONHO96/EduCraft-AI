package com.educraftai.domain.user.service;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.global.security.JwtTokenProvider;
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
    private static final SecureRandom random = new SecureRandom();

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

    /** 현재 사용자 정보 조회 */
    public AuthResponse.UserInfo getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
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

    /** 비밀번호 초기화 - 임시 비밀번호 생성 후 저장 */
    @Transactional
    public String resetPassword(AuthRequest.ResetPassword request) {
        User user = userRepository.findByEmailAndName(request.getEmail(), request.getName())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getPassword() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        log.info("[Auth] 임시 비밀번호 발급 - email: {}", request.getEmail());
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
