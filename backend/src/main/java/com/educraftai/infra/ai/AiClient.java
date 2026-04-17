package com.educraftai.infra.ai;

import com.educraftai.domain.ai.dto.HistoryMessage;
import com.educraftai.global.constant.AiConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Spring AI 기반 Anthropic Claude 클라이언트.
 *
 * <p>Spring AI의 {@link ChatModel} 추상화를 사용하므로, 설정만 바꾸면 GPT·Gemini 등
 * 다른 모델로도 교체할 수 있다. API 키가 미설정일 땐 {@link #isConfigured()}가
 * {@code false}를 반환하여 호출자가 오프라인 폴백을 수행하도록 유도한다.
 *
 * <p>계층: {@code infra} → 도메인 DTO({@link HistoryMessage})만 의존. 컨트롤러는 import하지 않는다.
 */
@Slf4j
@Component
public class AiClient {

    private final ChatModel chatModel;
    private final String apiKey;

    public AiClient(@Nullable ChatModel chatModel,
                    @Value("${spring.ai.anthropic.api-key:" + AiConstants.PLACEHOLDER_API_KEY + "}") String apiKey) {
        this.chatModel = chatModel;
        this.apiKey = apiKey;

        if (isConfigured()) {
            log.info("[AI] Anthropic ChatModel 활성화 (온라인 모드)");
        } else {
            log.info("[AI] API 키 미설정 → 오프라인 모드로 동작");
        }
    }

    /** AI API 키가 유효하게 설정되었는지 확인 */
    public boolean isConfigured() {
        return chatModel != null
                && apiKey != null
                && !apiKey.isBlank()
                && !AiConstants.PLACEHOLDER_API_KEY.equals(apiKey);
    }

    /** 단일 턴 AI 응답 생성 (System + User) */
    public String generate(String systemPrompt, String userPrompt) {
        try {
            Prompt prompt = new Prompt(List.of(
                    new SystemMessage(systemPrompt),
                    new UserMessage(userPrompt)
            ));

            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            log.error("[AI] 호출 실패", e);
            throw new RuntimeException("AI 생성에 실패했습니다.", e);
        }
    }

    /**
     * 대화 히스토리를 포함한 AI 응답 생성.
     * <p>과거 N개({@link AiConstants#MAX_HISTORY_MESSAGES})까지만 포함해 토큰 비용 제한.
     */
    public String generateWithHistory(String systemPrompt, List<HistoryMessage> history, String userPrompt) {
        try {
            List<Message> messages = new ArrayList<>();
            messages.add(new SystemMessage(systemPrompt));

            if (history != null && !history.isEmpty()) {
                int start = Math.max(0, history.size() - AiConstants.MAX_HISTORY_MESSAGES);
                for (int i = start; i < history.size(); i++) {
                    HistoryMessage h = history.get(i);
                    if ("user".equals(h.getRole())) {
                        messages.add(new UserMessage(h.getText()));
                    } else {
                        messages.add(new AssistantMessage(h.getText()));
                    }
                }
            }

            messages.add(new UserMessage(userPrompt));

            Prompt prompt = new Prompt(messages);
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            log.error("[AI] 호출 실패 (with history)", e);
            throw new RuntimeException("AI 생성에 실패했습니다.", e);
        }
    }
}
