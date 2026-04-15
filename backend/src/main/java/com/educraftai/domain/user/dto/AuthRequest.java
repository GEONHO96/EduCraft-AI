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

        /** 학생 학년 (STUDENT일 때 필수, 예: ELEMENTARY_1 ~ HIGH_3) */
        private String grade;
    }

    @Getter @Setter
    public static class Login {
        @NotBlank(message = "이메일은 필수입니다.")
        @Email
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;
    }

    @Getter @Setter
    public static class FindEmail {
        @NotBlank(message = "이름은 필수입니다.")
        private String name;
    }

    @Getter @Setter
    public static class ResetPassword {
        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String email;

        @NotBlank(message = "이름은 필수입니다.")
        private String name;
    }

    @Getter @Setter
    public static class ChangePassword {
        @NotBlank(message = "이메일은 필수입니다.")
        @Email
        private String email;

        @NotBlank(message = "임시 비밀번호는 필수입니다.")
        private String tempPassword;

        @NotBlank(message = "새 비밀번호는 필수입니다.")
        private String newPassword;
    }

    /** 계정 탈퇴 요청 (비밀번호 확인용) */
    @Getter @Setter
    public static class DeleteAccount {
        private String password;
    }

    /** 로그인 상태에서 비밀번호 변경 (현재 비밀번호 검증) */
    @Getter @Setter
    public static class ChangeMyPassword {
        @NotBlank(message = "현재 비밀번호는 필수입니다.")
        private String currentPassword;

        @NotBlank(message = "새 비밀번호는 필수입니다.")
        private String newPassword;
    }
}
