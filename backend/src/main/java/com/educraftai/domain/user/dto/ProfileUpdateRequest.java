package com.educraftai.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 프로필 수정 요청 DTO
 * 닉네임, 프로필 이미지를 변경할 때 사용
 */
@Getter
@Setter
public class ProfileUpdateRequest {
    /** 사용자 닉네임 (빈 문자열이면 기본 이름으로 복원) */
    private String nickname;

    /** 프로필 이미지 URL (파일 업로드 후 받은 URL) */
    private String profileImage;
}
