package com.educraftai.domain.ai.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 챗봇 응답 DTO.
 *
 * <p>{@link #offline}이 {@code true}이면 프론트엔드가 키워드 기반 오프라인 응답을 표시한다.
 * AI API가 실패하거나 키가 설정되지 않았을 때 서버가 offline 플래그를 세워 반환한다.
 */
@Getter
@RequiredArgsConstructor
public class ChatResponse {
    private final String reply;
    private final boolean offline;
}
