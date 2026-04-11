package com.educraftai.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 애플리케이션 에러 코드 정의
 * 도메인별로 분류된 에러 코드와 한국어 메시지를 관리한다.
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    // Auth
    DUPLICATE_EMAIL("AUTH_001", "이미 가입된 이메일입니다."),
    INVALID_CREDENTIALS("AUTH_002", "이메일 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED("AUTH_003", "로그인이 필요합니다."),
    FORBIDDEN("AUTH_004", "접근 권한이 없습니다."),

    // User
    USER_NOT_FOUND("USER_001", "사용자를 찾을 수 없습니다."),

    // Course
    COURSE_NOT_FOUND("COURSE_001", "강의를 찾을 수 없습니다."),
    NOT_COURSE_OWNER("COURSE_002", "강의 소유자가 아닙니다."),
    ALREADY_ENROLLED("COURSE_003", "이미 수강 중인 강의입니다."),

    // Curriculum
    CURRICULUM_NOT_FOUND("CURRICULUM_001", "커리큘럼을 찾을 수 없습니다."),

    // Material
    MATERIAL_NOT_FOUND("MATERIAL_001", "수업 자료를 찾을 수 없습니다."),

    // Quiz
    QUIZ_NOT_FOUND("QUIZ_001", "퀴즈를 찾을 수 없습니다."),
    ALREADY_SUBMITTED("QUIZ_002", "이미 제출한 퀴즈입니다."),

    // AI
    AI_GENERATION_FAILED("AI_001", "AI 생성에 실패했습니다."),

    // SNS
    SNS_POST_NOT_FOUND("SNS_001", "게시글을 찾을 수 없습니다."),
    SNS_COMMENT_NOT_FOUND("SNS_002", "댓글을 찾을 수 없습니다."),
    SNS_NOT_AUTHOR("SNS_003", "작성자만 수정/삭제할 수 있습니다."),
    SNS_CANNOT_FOLLOW_SELF("SNS_004", "자기 자신을 팔로우할 수 없습니다."),

    // Common
    INVALID_INPUT("COMMON_001", "잘못된 입력값입니다."),
    INTERNAL_ERROR("COMMON_002", "서버 내부 오류가 발생했습니다.");

    private final String code;
    private final String message;
}
