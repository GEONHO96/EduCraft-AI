package com.educraftai.infra.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * AiClient - Spring AI 기반 Claude API 클라이언트
 * Spring AI의 ChatModel 추상화를 통해 Anthropic Claude와 통신한다.
 * API 키가 미설정 시 isConfigured()가 false를 반환하여 오프라인 폴백을 유도한다.
 *
 * 기존 RestTemplate 직접 호출 방식에서 Spring AI ChatModel로 마이그레이션하여,
 * 모델 교체(GPT, Gemini 등)가 설정 변경만으로 가능해졌다.
 */
@Slf4j
@Component
public class AiClient {

    private final ChatModel chatModel;
    private final String apiKey;

    public AiClient(
            @Nullable ChatModel chatModel,
            @Value("${spring.ai.anthropic.api-key:your-api-key-here}") String apiKey) {
        this.chatModel = chatModel;
        this.apiKey = apiKey;

        if (isConfigured()) {
            log.info("[Spring AI] Anthropic ChatModel 활성화 (온라인 모드)");
        } else {
            log.info("[Spring AI] API 키 미설정 → 오프라인 모드로 동작합니다");
        }
    }

    /** AI API 키가 유효하게 설정되었는지 확인 */
    public boolean isConfigured() {
        return chatModel != null
                && apiKey != null
                && !apiKey.isBlank()
                && !apiKey.equals("your-api-key-here");
    }

    /**
     * Spring AI ChatModel을 통한 AI 응답 생성
     * SystemMessage + UserMessage로 프롬프트를 구성하여 Claude API를 호출한다.
     */
    public String generate(String systemPrompt, String userPrompt) {
        try {
            Prompt prompt = new Prompt(List.of(
                    new SystemMessage(systemPrompt),
                    new UserMessage(userPrompt)
            ));

            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            log.error("AI API 호출 실패", e);
            throw new RuntimeException("AI 생성에 실패했습니다.", e);
        }
    }
}
