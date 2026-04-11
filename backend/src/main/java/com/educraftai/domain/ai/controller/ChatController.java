package com.educraftai.domain.ai.controller;

import com.educraftai.global.common.ApiResponse;
import com.educraftai.infra.ai.AiClient;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * ChatController - AI 챗봇 대화 엔드포인트
 * Claude API를 활용하여 교육 도우미 챗봇 기능을 제공한다.
 * API 키가 없으면 프론트엔드에서 오프라인 응답으로 대체된다.
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AiClient aiClient;

    @PostMapping
    public ApiResponse<ChatResponse> chat(@RequestBody ChatRequest request) {
        String systemPrompt = """
            너는 'EduCraft AI'라는 교육 플랫폼의 친절한 AI 학습 도우미야.
            이름은 '에듀봇'이고, 학생들의 공부를 도와주는 게 목표야.

            역할:
            - 초등학교~고등학교 수준의 국어, 영어, 수학 질문에 쉽고 친절하게 답변
            - 공부 방법, 학습 계획, 시험 준비 팁 제공
            - EduCraft AI 플랫폼 사용법 안내 (퀴즈, 강의 추천, 커뮤니티 등)
            - 동기부여와 격려의 메시지

            규칙:
            - 항상 한국어로 답변해
            - 답변은 짧고 핵심적으로 (2~4문장)
            - 친근하고 귀여운 말투를 사용해 (이모지 적절히 활용)
            - 교육과 관련 없는 질문에는 정중히 거절하고 학습 관련 주제로 유도해
            - 위험하거나 부적절한 내용은 절대 답변하지 마
            """;

        try {
            String reply = aiClient.generate(systemPrompt, request.getMessage());
            return ApiResponse.ok(new ChatResponse(reply, false));
        } catch (Exception e) {
            log.warn("챗봇 AI 응답 실패 - 오프라인 모드로 전환: {}", e.getMessage());
            return ApiResponse.ok(new ChatResponse("offline", true));
        }
    }

    @Getter @Setter
    public static class ChatRequest {
        private String message;
    }

    @Getter
    public static class ChatResponse {
        private final String reply;
        private final boolean offline;

        public ChatResponse(String reply, boolean offline) {
            this.reply = reply;
            this.offline = offline;
        }
    }
}
