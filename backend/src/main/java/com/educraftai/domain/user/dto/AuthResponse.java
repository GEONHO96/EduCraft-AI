package com.educraftai.domain.user.dto;

import com.educraftai.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class AuthResponse {

    @Getter @Builder @AllArgsConstructor
    public static class Token {
        private String accessToken;
        private UserInfo user;
    }

    @Getter @Builder @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private User.Role role;

        public static UserInfo from(User user) {
            return UserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole())
                    .build();
        }
    }
}
