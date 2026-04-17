package com.educraftai.domain.ai.controller;

import com.educraftai.domain.ai.dto.ChatRequest;
import com.educraftai.domain.ai.dto.ChatResponse;
import com.educraftai.domain.ai.dto.UserContext;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.infra.ai.AiClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * AI 챗봇 대화 컨트롤러.
 *
 * <p>사용자 메시지·대화 이력·프로필 컨텍스트를 받아 Claude API에 전달하고,
 * 응답이 불가능하면 {@code offline: true} 플래그와 함께 반환하여 프론트엔드의
 * 오프라인 키워드 응답으로 폴백되게 한다.
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AiClient aiClient;

    /** 챗봇 대화 (단일 턴 또는 히스토리 포함 다중 턴) */
    @PostMapping
    public ApiResponse<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        String systemPrompt = buildSystemPrompt(request.getUserContext());

        try {
            String reply;
            if (request.getHistory() != null && !request.getHistory().isEmpty()) {
                reply = aiClient.generateWithHistory(systemPrompt, request.getHistory(), request.getMessage());
            } else {
                reply = aiClient.generate(systemPrompt, request.getMessage());
            }
            return ApiResponse.ok(new ChatResponse(reply, false));
        } catch (Exception e) {
            log.warn("[Chat] AI 응답 실패 → 오프라인 모드로 전환: {}", e.getMessage());
            return ApiResponse.ok(new ChatResponse("offline", true));
        }
    }

    /** 사용자 프로필 컨텍스트를 반영한 시스템 프롬프트 생성 */
    private String buildSystemPrompt(UserContext ctx) {
        StringBuilder sb = new StringBuilder();

        sb.append("""
            너는 'EduCraft AI'라는 교육 플랫폼의 전문 AI 학습 도우미 '에듀봇'이야.

            ═══ 너의 핵심 원칙 ═══
            1. 질문의 의도를 정확히 파악하고 그에 맞는 답변을 해. 동문서답 절대 금지.
            2. 사용자가 구체적인 학습 질문을 하면 정확하고 상세하게 답변해.
            3. 플랫폼 사용법을 물으면 해당 기능을 정확히 안내해.
            4. 모호한 질문이면 되물어서 의도를 명확히 파악한 후 답변해.
            5. 이전 대화 맥락을 반드시 참고해서 이어지는 대화를 해.

            ═══ EduCraft AI 플랫폼 기능 (정확히 안내해야 함) ═══

            📚 강의 시스템:
            - 교강사가 강의를 생성하고 학생이 수강 신청하는 구조
            - 강의 > 커리큘럼(주차별) > 학습자료(각 수업) > 퀴즈 순서로 구성
            - "강의 탐색" 메뉴에서 과목별/키워드로 강의 검색 가능
            - 수강 신청 후 "내 강의" 메뉴에서 수강 중인 강의 확인

            🎯 AI 퀴즈:
            - 교강사가 AI로 퀴즈를 자동 생성 (과목, 난이도, 문항 수 설정)
            - 학생은 강의 내 퀴즈를 풀고 즉시 채점 결과 확인
            - 오답 해설 제공

            🎬 강의 추천:
            - 학년별 맞춤 유튜브 교육 영상 추천
            - 국어, 영어, 수학, 과학, 코딩 과목 지원
            - 초등~고등 수준별 필터링

            💬 커뮤니티 (SNS 피드):
            - 학습 일지, 질문, 정보 공유 게시글 작성
            - 이미지 첨부, 좋아요, 댓글 기능
            - 다른 사용자 팔로우/팔로잉

            📊 대시보드:
            - 교강사: 강의 수, 수강생 수, AI 사용량, 퀴즈 평균 점수 통계
            - 학생: 수강 중인 강의, 퀴즈 점수, 학습 진도 확인

            ⚙️ 설정:
            - 프로필 수정 (닉네임, 프로필 이미지)
            - 비밀번호 변경 (현재 비밀번호 확인 후 변경)
            - 계정 탈퇴

            🔐 계정:
            - 이메일 회원가입 또는 Google/Kakao/Naver 소셜 로그인
            - 비밀번호 분실 시: "계정 찾기" 페이지에서 이메일 입력 → 임시 비밀번호 발급
            - 소셜 로그인 계정은 비밀번호 재설정 불가 (소셜 로그인으로만 접속)

            ═══ 답변 스타일 규칙 ═══
            - 항상 한국어로 답변
            - 학습 관련 질문: 충분히 상세하게 설명 (필요하면 예시, 단계별 설명 포함)
            - 플랫폼 사용법: 정확한 메뉴 경로와 함께 안내
            - 간단한 질문: 간결하게 답변 (불필요하게 길게 X)
            - 친근하고 따뜻한 말투 사용 (이모지 적절히, 과하지 않게)
            - 수학 공식이나 코드는 정확하게 작성
            - 모르는 것은 솔직히 "잘 모르겠어요"라고 하고, 관련 기능을 안내
            - 교육과 무관한 질문은 정중히 거절하고 학습 주제로 유도
            - 위험하거나 부적절한 내용은 절대 답변 금지
            """);

        if (ctx != null) {
            sb.append("\n═══ 현재 대화 중인 사용자 정보 ═══\n");
            if (ctx.getName() != null) {
                sb.append("- 이름/닉네임: ").append(ctx.getName()).append("\n");
            }
            if (ctx.getRole() != null) {
                sb.append("- 역할: ").append("TEACHER".equals(ctx.getRole()) ? "교강사 (강의 생성/관리)" : "학생 (강의 수강/학습)").append("\n");
            }
            if (ctx.getGrade() != null) {
                sb.append("- 학년: ").append(com.educraftai.global.util.GradeLabelMapper.toLabel(ctx.getGrade())).append("\n");
            }
            sb.append("→ 이 정보를 참고해서 사용자에 맞는 수준과 맥락으로 답변해줘.\n");
        }

        return sb.toString();
    }
}
