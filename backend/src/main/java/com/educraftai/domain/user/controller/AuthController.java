package com.educraftai.domain.user.controller;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.dto.ProfileUpdateRequest;
import com.educraftai.domain.user.dto.SocialAuthRequest;
import com.educraftai.domain.user.dto.SocialCodeRequest;
import com.educraftai.domain.user.service.AuthService;
import com.educraftai.domain.user.service.SocialAuthService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 인증 관련 API 컨트롤러.
 * <p>회원가입, 로그인(일반/소셜), 비밀번호 찾기/변경, 내 정보 조회·수정, 계정 탈퇴를 처리한다.
 * <p>인증이 필요한 엔드포인트는 {@link CurrentUserId @CurrentUserId}로 사용자 ID를 주입받는다.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SocialAuthService socialAuthService;

    // ─── 가입/로그인 ───────────────────────────────────────────

    /** 회원가입 후 JWT 토큰 발급 */
    @PostMapping("/register")
    public ApiResponse<AuthResponse.Token> register(@Valid @RequestBody AuthRequest.Register request) {
        return ApiResponse.ok(authService.register(request));
    }

    /** 이메일 중복 확인 */
    @GetMapping("/check-email")
    public ApiResponse<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        return ApiResponse.ok(Map.of("exists", authService.existsByEmail(email)));
    }

    /** 이메일/비밀번호 로그인 후 JWT 토큰 발급 */
    @PostMapping("/login")
    public ApiResponse<AuthResponse.Token> login(@Valid @RequestBody AuthRequest.Login request) {
        return ApiResponse.ok(authService.login(request));
    }

    /** 소셜 로그인 (Google/Kakao/Naver) - access token 방식 */
    @PostMapping("/social-login")
    public ApiResponse<AuthResponse.Token> socialLogin(@Valid @RequestBody SocialAuthRequest request) {
        return ApiResponse.ok(socialAuthService.socialLogin(request));
    }

    /** 소셜 로그인 - authorization code 방식 (Naver/Kakao CORS 우회) */
    @PostMapping("/social-login/code")
    public ApiResponse<AuthResponse.Token> socialLoginWithCode(@Valid @RequestBody SocialCodeRequest request) {
        return ApiResponse.ok(socialAuthService.socialLoginWithCode(request));
    }

    // ─── 계정 찾기/비밀번호 재설정 ─────────────────────────────

    /** 이름으로 이메일 찾기 (마스킹 처리하여 반환) */
    @PostMapping("/find-email")
    public ApiResponse<List<String>> findEmail(@Valid @RequestBody AuthRequest.FindEmail request) {
        return ApiResponse.ok(authService.findEmail(request));
    }

    /** 비밀번호 초기화 — 이메일만으로 임시 비밀번호 발급 */
    @PostMapping("/reset-password")
    public ApiResponse<Map<String, String>> resetPassword(@Valid @RequestBody AuthRequest.ResetPassword request) {
        String tempPassword = authService.resetPassword(request.getEmail());
        return ApiResponse.ok(Map.of(
                "message", "임시 비밀번호가 발급되었습니다.",
                "tempPassword", tempPassword
        ));
    }

    /** 임시 비밀번호로 새 비밀번호 설정 */
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody AuthRequest.ChangePassword request) {
        authService.changePasswordWithTemp(request);
        return ApiResponse.ok();
    }

    // ─── 로그인 상태 (@CurrentUserId 필요) ─────────────────────

    /** 로그인 상태에서 비밀번호 변경 (현재 비밀번호 검증) */
    @PutMapping("/password")
    public ApiResponse<Map<String, String>> changeMyPassword(@CurrentUserId Long userId,
                                                             @Valid @RequestBody AuthRequest.ChangeMyPassword request) {
        authService.changeMyPassword(userId, request);
        return ApiResponse.ok(Map.of("message", "비밀번호가 변경되었습니다."));
    }

    /** 현재 로그인한 사용자 정보 조회 */
    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserInfo> getMyInfo(@CurrentUserId Long userId) {
        return ApiResponse.ok(authService.getMyInfo(userId));
    }

    /** 계정 탈퇴 (비밀번호 확인 후 삭제) */
    @PostMapping("/delete-account")
    public ApiResponse<Map<String, String>> deleteAccount(@CurrentUserId Long userId,
                                                          @Valid @RequestBody AuthRequest.DeleteAccount request) {
        authService.deleteAccount(userId, request.getPassword());
        return ApiResponse.ok(Map.of("message", "계정이 삭제되었습니다."));
    }

    /** 프로필 수정 (닉네임, 프로필 이미지) */
    @PutMapping("/profile")
    public ApiResponse<AuthResponse.UserInfo> updateProfile(@CurrentUserId Long userId,
                                                            @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.ok(authService.updateProfile(userId, request));
    }
}
