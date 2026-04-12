package com.educraftai.domain.user.dto;

import com.educraftai.domain.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 소셜 로그인 Authorization Code 요청 DTO
 * 프론트엔드에서 받은 authorization code를 백엔드에서 access token으로 교환할 때 사용
 */
@Getter
@Setter
public class SocialCodeRequest {

    @NotBlank(message = "인증 코드는 필수입니다.")
    private String code;

    /** Naver OAuth에서 CSRF 방지용으로 사용 */
    private String state;

    @NotNull(message = "소셜 제공자는 필수입니다.")
    private User.SocialProvider provider;

    /** 신규 가입 시 역할 (기존 사용자는 무시됨) */
    private User.Role role;

    @NotBlank(message = "리다이렉트 URI는 필수입니다.")
    private String redirectUri;
}
