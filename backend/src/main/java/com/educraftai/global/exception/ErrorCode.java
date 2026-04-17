package com.educraftai.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 애플리케이션 에러 코드 정의.
 * <p>도메인별로 분류된 코드(접두어)와 한국어 메시지를 관리한다.
 * 신규 에러는 해당 도메인 섹션에 추가하되, 기존 코드 값은 변경 금지 (클라이언트가 분기에 사용 중).
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    // ── Auth (AUTH_xxx) ──
    DUPLICATE_EMAIL("AUTH_001", "이미 가입된 이메일입니다."),
    INVALID_CREDENTIALS("AUTH_002", "이메일 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED("AUTH_003", "로그인이 필요합니다."),
    FORBIDDEN("AUTH_004", "접근 권한이 없습니다."),
    SOCIAL_LOGIN_NO_PASSWORD("AUTH_005", "소셜 로그인 계정은 비밀번호가 없습니다. 소셜 로그인을 이용해주세요."),
    SOCIAL_TOKEN_EXCHANGE_FAILED("AUTH_006", "소셜 로그인 토큰 교환에 실패했습니다."),
    SOCIAL_USERINFO_FAILED("AUTH_007", "소셜 사용자 정보 조회에 실패했습니다."),

    // ── User (USER_xxx) ──
    USER_NOT_FOUND("USER_001", "사용자를 찾을 수 없습니다."),

    // ── Course (COURSE_xxx) ──
    COURSE_NOT_FOUND("COURSE_001", "강의를 찾을 수 없습니다."),
    NOT_COURSE_OWNER("COURSE_002", "강의 소유자가 아닙니다."),
    ALREADY_ENROLLED("COURSE_003", "이미 수강 중인 강의입니다."),

    // ── Curriculum (CURRICULUM_xxx) ──
    CURRICULUM_NOT_FOUND("CURRICULUM_001", "커리큘럼을 찾을 수 없습니다."),

    // ── Material (MATERIAL_xxx) ──
    MATERIAL_NOT_FOUND("MATERIAL_001", "수업 자료를 찾을 수 없습니다."),

    // ── Quiz (QUIZ_xxx) ──
    QUIZ_NOT_FOUND("QUIZ_001", "퀴즈를 찾을 수 없습니다."),
    ALREADY_SUBMITTED("QUIZ_002", "이미 제출한 퀴즈입니다."),
    QUIZ_SUBMISSION_NOT_FOUND("QUIZ_003", "퀴즈 제출 기록을 찾을 수 없습니다."),

    // ── AI (AI_xxx) ──
    AI_GENERATION_FAILED("AI_001", "AI 생성에 실패했습니다."),

    // ── SNS (SNS_xxx) ──
    SNS_POST_NOT_FOUND("SNS_001", "게시글을 찾을 수 없습니다."),
    SNS_COMMENT_NOT_FOUND("SNS_002", "댓글을 찾을 수 없습니다."),
    SNS_NOT_AUTHOR("SNS_003", "작성자만 수정/삭제할 수 있습니다."),
    SNS_CANNOT_FOLLOW_SELF("SNS_004", "자기 자신을 팔로우할 수 없습니다."),

    // ── Subscription (SUB_xxx) ──
    SUBSCRIPTION_NOT_FOUND("SUB_001", "구독 정보를 찾을 수 없습니다."),
    INVALID_PLAN("SUB_002", "잘못된 구독 플랜입니다."),
    INVALID_PAYMENT_METHOD("SUB_003", "잘못된 결제 수단입니다."),

    // ── File (FILE_xxx) ──
    FILE_EMPTY("FILE_001", "업로드할 파일이 비어 있습니다."),
    FILE_INVALID_TYPE("FILE_002", "허용되지 않는 파일 형식입니다."),
    FILE_SIZE_EXCEEDED("FILE_003", "파일 크기가 허용 범위를 초과했습니다."),
    FILE_UPLOAD_FAILED("FILE_004", "파일 업로드에 실패했습니다."),

    // ── Batch (BATCH_xxx) ──
    BATCH_JOB_NOT_FOUND("BATCH_001", "요청한 배치 작업을 찾을 수 없습니다."),
    BATCH_JOB_FAILED("BATCH_002", "배치 작업 실행에 실패했습니다."),

    // ── Common (COMMON_xxx) ──
    NOT_FOUND("COMMON_000", "리소스를 찾을 수 없습니다."),
    INVALID_INPUT("COMMON_001", "잘못된 입력값입니다."),
    INTERNAL_ERROR("COMMON_002", "서버 내부 오류가 발생했습니다."),
    INVALID_ENUM_VALUE("COMMON_003", "허용되지 않는 값입니다.");

    private final String code;
    private final String message;
}
