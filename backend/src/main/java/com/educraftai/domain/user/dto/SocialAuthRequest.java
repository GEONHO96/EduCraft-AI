package com.educraftai.domain.user.dto;

import com.educraftai.domain.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialAuthRequest {

    @NotBlank(message = "소셜 액세스 토큰은 필수입니다.")
    private String accessToken;

    @NotNull(message = "소셜 제공자는 필수입니다.")
    private User.SocialProvider provider;

    private User.Role role;
}
