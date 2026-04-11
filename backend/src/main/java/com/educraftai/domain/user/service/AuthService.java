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

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private static final SecureRandom random = new SecureRandom();

    @Transactional
    public AuthResponse.Token register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(request.getRole())
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.Token.builder()
                .accessToken(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    public AuthResponse.Token login(AuthRequest.Login request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.Token.builder()
                .accessToken(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    public AuthResponse.UserInfo getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return AuthResponse.UserInfo.from(user);
    }

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

    @Transactional
    public void changePasswordWithTemp(AuthRequest.ChangePassword request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getTempPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex <= 2) return email;
        String local = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        int showCount = Math.min(3, local.length());
        return local.substring(0, showCount) + "*".repeat(local.length() - showCount) + domain;
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
