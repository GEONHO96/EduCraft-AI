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
        private String nickname;
        private User.Role role;
        private String profileImage;
        private User.SocialProvider socialProvider;
        private String grade;

        /** 닉네임이 있으면 닉네임, 없으면 name 반환 */
        public String getDisplayName() {
            return nickname != null && !nickname.isBlank() ? nickname : name;
        }

        public static UserInfo from(User user) {
            return UserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getNickname() != null && !user.getNickname().isBlank()
                            ? user.getNickname() : user.getName())
                    .nickname(user.getNickname())
                    .role(user.getRole())
                    .profileImage(user.getProfileImage())
                    .socialProvider(user.getSocialProvider())
                    .grade(user.getGrade())
                    .build();
        }
    }
}
