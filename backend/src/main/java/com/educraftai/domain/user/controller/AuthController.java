package com.educraftai.domain.user.controller;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.dto.SocialAuthRequest;
import com.educraftai.domain.user.service.AuthService;
import com.educraftai.domain.user.service.SocialAuthService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SocialAuthService socialAuthService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse.Token> register(@Valid @RequestBody AuthRequest.Register request) {
        return ApiResponse.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse.Token> login(@Valid @RequestBody AuthRequest.Login request) {
        return ApiResponse.ok(authService.login(request));
    }

    @PostMapping("/social-login")
    public ApiResponse<AuthResponse.Token> socialLogin(@Valid @RequestBody SocialAuthRequest request) {
        return ApiResponse.ok(socialAuthService.socialLogin(request));
    }

    @PostMapping("/find-email")
    public ApiResponse<List<String>> findEmail(@Valid @RequestBody AuthRequest.FindEmail request) {
        return ApiResponse.ok(authService.findEmail(request));
    }

    @PostMapping("/reset-password")
    public ApiResponse<Map<String, String>> resetPassword(@Valid @RequestBody AuthRequest.ResetPassword request) {
        String tempPassword = authService.resetPassword(request);
        return ApiResponse.ok(Map.of("tempPassword", tempPassword));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody AuthRequest.ChangePassword request) {
        authService.changePasswordWithTemp(request);
        return ApiResponse.ok(null);
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserInfo> getMyInfo() {
        return ApiResponse.ok(authService.getMyInfo(AuthUtil.getCurrentUserId()));
    }
}
