package com.educraftai.domain.user.controller;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.dto.SocialAuthRequest;
import com.educraftai.domain.user.dto.SocialCodeRequest;
import com.educraftai.domain.user.service.AuthService;
import com.educraftai.domain.user.service.SocialAuthService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 인증 관련 API 컨트롤러
 * 회원가입, 로그인, 비밀번호 찾기/변경, 내 정보 조회 등을 처리한다.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SocialAuthService socialAuthService;

    /** 회원가입 후 JWT 토큰 발급 */
    @PostMapping("/register")
    public ApiResponse<AuthResponse.Token> register(@Valid @RequestBody AuthRequest.Register request) {
        return ApiResponse.ok(authService.register(request));
    }

    /** 이메일 중복 확인 */
    @GetMapping("/check-email")
    public ApiResponse<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = authService.existsByEmail(email);
        return ApiResponse.ok(Map.of("exists", exists));
    }

    /** 이메일/비밀번호 로그인 후 JWT 토큰 발급 */
    @PostMapping("/login")
    public ApiResponse<AuthResponse.Token> login(@Valid @RequestBody AuthRequest.Login request) {
        return ApiResponse.ok(authService.login(request));
    }

    /** 소셜 로그인 (Google, Kakao, Naver) - access token 방식 */
    @PostMapping("/social-login")
    public ApiResponse<AuthResponse.Token> socialLogin(@Valid @RequestBody SocialAuthRequest request) {
        return ApiResponse.ok(socialAuthService.socialLogin(request));
    }

    /** 소셜 로그인 - authorization code 방식 (Naver/Kakao CORS 우회) */
    @PostMapping("/social-login/code")
    public ApiResponse<AuthResponse.Token> socialLoginWithCode(@Valid @RequestBody SocialCodeRequest request) {
        return ApiResponse.ok(socialAuthService.socialLoginWithCode(request));
    }

    /** 이름으로 이메일 찾기 (마스킹 처리하여 반환) */
    @PostMapping("/find-email")
    public ApiResponse<List<String>> findEmail(@Valid @RequestBody AuthRequest.FindEmail request) {
        return ApiResponse.ok(authService.findEmail(request));
    }

    /** 비밀번호 초기화 (임시 비밀번호를 이메일로 발송) */
    @PostMapping("/reset-password")
    public ApiResponse<Map<String, String>> resetPassword(@Valid @RequestBody AuthRequest.ResetPassword request) {
        authService.resetPassword(request);
        return ApiResponse.ok(Map.of("message", "임시 비밀번호가 이메일로 발송되었습니다."));
    }

    /** 임시 비밀번호로 새 비밀번호 변경 */
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody AuthRequest.ChangePassword request) {
        authService.changePasswordWithTemp(request);
        return ApiResponse.ok(null);
    }

    /** 현재 로그인한 사용자 정보 조회 */
    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserInfo> getMyInfo() {
        return ApiResponse.ok(authService.getMyInfo(AuthUtil.getCurrentUserId()));
    }
}
