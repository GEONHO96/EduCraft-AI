package com.educraftai.domain.ai.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 챗봇 대화 이력의 개별 메시지.
 *
 * <p>{@link #role}은 {@code "user"} 또는 {@code "bot"} 문자열.
 * (Spring AI의 Message 타입으로 변환은 {@link com.educraftai.infra.ai.AiClient}에서 수행)
 */
@Getter
@Setter
public class HistoryMessage {
    private String role;
    private String text;
}
