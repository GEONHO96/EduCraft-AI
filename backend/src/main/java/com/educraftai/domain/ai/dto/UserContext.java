package com.educraftai.domain.ai.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 챗봇이 맞춤 답변하기 위한 사용자 프로필 컨텍스트.
 *
 * <p>프론트엔드가 localStorage의 사용자 정보를 챗봇 호출에 실어 보낸다.
 * 서버는 이 정보를 시스템 프롬프트에 주입해 AI가 사용자 역할·학년에 맞게 답변하도록 한다.
 */
@Getter
@Setter
public class UserContext {
    /** 이름 또는 닉네임 */
    private String name;
    /** 역할: {@code "TEACHER"} 또는 {@code "STUDENT"} */
    private String role;
    /** 학년 코드 (학생일 때만 의미 있음, 예: {@code "ELEMENTARY_1"}) */
    private String grade;
}
