package com.educraftai.global.constant;

/**
 * AI 관련 공통 상수.
 *
 * <p>API 키 플레이스홀더, 대화 히스토리 윈도우 크기 등 여러 곳에서 참조되는
 * 값들을 모아 일관성을 강제한다.
 */
public final class AiConstants {

    private AiConstants() {
    }

    /**
     * AI API 키가 설정되지 않았을 때 사용되는 플레이스홀더 문자열.
     * application.yml의 기본값과 일치해야 한다.
     */
    public static final String PLACEHOLDER_API_KEY = "your-api-key-here";

    /**
     * 챗봇 대화 히스토리 윈도우(최대 메시지 수).
     * 과거 N개까지만 시스템 프롬프트에 포함해 토큰 비용을 제한한다.
     */
    public static final int MAX_HISTORY_MESSAGES = 20;
}
