package com.educraftai.infra.ai;

import com.educraftai.global.constant.AiConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.anthropic.api.AnthropicApi;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring AI ChatModel 수동 설정.
 *
 * <p>Spring AI의 자동 설정({@code AnthropicChatAutoConfiguration})은 API 키가 비어 있으면
 * 빈 생성 시점에 예외를 던져 애플리케이션이 부팅되지 않는다. 본 클래스는 수동으로 빈을 만들어,
 * API 키가 유효할 때만 {@link ChatModel}을 반환하고 아니면 {@code null}을 돌려준다.
 * AiClient는 빈이 null임을 확인해 오프라인 모드로 폴백한다.
 */
@Slf4j
@Configuration
public class SpringAiConfig {

    @Value("${spring.ai.anthropic.api-key:" + AiConstants.PLACEHOLDER_API_KEY + "}")
    private String apiKey;

    @Value("${spring.ai.anthropic.chat.options.model:claude-sonnet-4-20250514}")
    private String model;

    @Value("${spring.ai.anthropic.chat.options.max-tokens:4096}")
    private Integer maxTokens;

    @Bean
    public ChatModel anthropicChatModel() {
        if (!isValidApiKey()) {
            log.info("[AI Config] API 키 미설정 → ChatModel 빈 미생성 (오프라인 모드)");
            return null;
        }

        log.info("[AI Config] Anthropic ChatModel 빈 생성 (model={})", model);
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
                && !AiConstants.PLACEHOLDER_API_KEY.equals(apiKey);
    }
}
