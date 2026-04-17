package com.educraftai.domain.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * 챗봇 대화 요청 DTO.
 *
 * <p>{@link #message}는 이번 턴에서 사용자가 보낸 문장,
 * {@link #history}는 이전 대화 이력(선택),
 * {@link #userContext}는 사용자 프로필(선택)이다.
 *
 * <p>이전에는 {@code ChatController} 내부 정적 중첩 클래스로 선언되어
 * {@code infra/ai/AiClient}가 도메인 컨트롤러를 import하는 계층 위반이 발생했다.
 * 독립 DTO로 분리하여 계층 구조를 복원한다.
 */
@Getter
@Setter
public class ChatRequest {

    @NotBlank(message = "메시지는 필수입니다.")
    private String message;

    /** 과거 대화 히스토리 (오래된 → 최신 순). {@code null}이면 단일 턴으로 취급. */
    private List<HistoryMessage> history;

    /** 사용자 프로필 컨텍스트 (이름/역할/학년). {@code null}이면 기본 프롬프트만 사용. */
    private UserContext userContext;
}
