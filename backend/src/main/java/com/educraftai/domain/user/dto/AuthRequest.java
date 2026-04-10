package com.educraftai.domain.user.dto;

import com.educraftai.domain.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class AuthRequest {

    @Getter @Setter
    public static class Register {
        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;

        @NotBlank(message = "이름은 필수입니다.")
        private String name;

        @NotNull(message = "역할은 필수입니다.")
        private User.Role role;
    }

    @Getter @Setter
    public static class Login {
        @NotBlank(message = "이메일은 필수입니다.")
        @Email
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;
    }
}
