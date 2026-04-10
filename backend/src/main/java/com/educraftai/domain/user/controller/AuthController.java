package com.educraftai.domain.user.controller;

import com.educraftai.domain.user.dto.AuthRequest;
import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.service.AuthService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse.Token> register(@Valid @RequestBody AuthRequest.Register request) {
        return ApiResponse.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse.Token> login(@Valid @RequestBody AuthRequest.Login request) {
        return ApiResponse.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserInfo> getMyInfo() {
        return ApiResponse.ok(authService.getMyInfo(AuthUtil.getCurrentUserId()));
    }
}
