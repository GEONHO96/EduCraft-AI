package com.educraftai.global.constant;

/**
 * 인증 관련 상수.
 *
 * <p>JWT 헤더 이름·접두어·길이 등 컴파일 타임에 고정된 값들을 모아 둔다.
 * 매직 넘버/리터럴 하드코딩을 줄이고 재사용을 강제하기 위한 목적.
 */
public final class AuthConstants {

    private AuthConstants() {
    }

    /** Authorization 헤더 이름 */
    public static final String AUTHORIZATION_HEADER = "Authorization";

    /** Bearer 토큰 접두어 (공백 포함) */
    public static final String BEARER_PREFIX = "Bearer ";

    /** Bearer 접두어 길이 — 토큰 추출 시 substring에 사용 */
    public static final int BEARER_PREFIX_LENGTH = BEARER_PREFIX.length();

    /** Spring Security 역할 접두어 */
    public static final String ROLE_PREFIX = "ROLE_";
}
