package com.educraftai.infra.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.anthropic.api.AnthropicApi;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringAiConfig - Spring AI ChatModel 수동 설정
 *
 * Spring AI 자동 설정(AnthropicChatAutoConfiguration)은 API 키가 없으면
 * 빈 생성 시 예외를 발생시킨다. 이를 방지하기 위해 자동 설정을 비활성화하고,
 * API 키가 유효한 경우에만 ChatModel 빈을 생성한다.
 *
 * API 키 미설정 시 ChatModel 빈이 등록되지 않아, AiClient가 오프라인 모드로 동작한다.
 */
@Slf4j
@Configuration
public class SpringAiConfig {

    @Value("${spring.ai.anthropic.api-key:your-api-key-here}")
    private String apiKey;

    @Value("${spring.ai.anthropic.chat.options.model:claude-sonnet-4-20250514}")
    private String model;

    @Value("${spring.ai.anthropic.chat.options.max-tokens:4096}")
    private Integer maxTokens;

    @Bean
    public ChatModel anthropicChatModel() {
        if (!isValidApiKey()) {
            log.info("[Spring AI Config] API 키 미설정 → ChatModel 빈 미생성 (오프라인 모드)");
            return null;
        }

        log.info("[Spring AI Config] Anthropic ChatModel 빈 생성 (model={})", model);
        AnthropicApi anthropicApi = AnthropicApi.builder()
                .apiKey(apiKey)
                .build();

        return AnthropicChatModel.builder()
                .anthropicApi(anthropicApi)
                .defaultOptions(AnthropicChatOptions.builder()
                        .model(model)
                        .maxTokens(maxTokens)
                        .build())
                .build();
    }

    private boolean isValidApiKey() {
        return apiKey != null
                && !apiKey.isBlank()
                && !"your-api-key-here".equals(apiKey);
    }
}
