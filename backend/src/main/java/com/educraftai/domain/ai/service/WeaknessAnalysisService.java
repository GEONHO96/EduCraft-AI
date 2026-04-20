package com.educraftai.domain.ai.service;

import com.educraftai.domain.ai.dto.WeaknessReportResponse;
import com.educraftai.domain.ai.entity.WeaknessReport;
import com.educraftai.domain.ai.repository.WeaknessReportRepository;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.infra.ai.AiClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * AI 오답노트 & 약점 분석 서비스.
 *
 * <p>퀴즈 제출 이벤트가 발생하면 {@link #createPendingAndAnalyzeAsync}를 호출하여
 * 먼저 PENDING 상태 레코드를 생성한 뒤, 비동기({@code @Async})로 Claude API를 호출한다.
 * 프론트엔드는 폴링으로 상태를 감시한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeaknessAnalysisService {

    private final WeaknessReportRepository weaknessReportRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    private static final int MAX_WEAK_CONCEPTS = 5;

    // ─── 조회 ───

    /** 특정 제출에 대한 약점 리포트 조회. 소유자 검증 포함. */
    public WeaknessReportResponse.Info getByQuizSubmission(Long userId, Long quizSubmissionId) {
        WeaknessReport report = weaknessReportRepository.findByQuizSubmissionId(quizSubmissionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WEAKNESS_REPORT_NOT_FOUND));
        if (!report.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.WEAKNESS_REPORT_NOT_FOUND);
        }
        return WeaknessReportResponse.Info.from(report);
    }

    /** 내 약점 리포트 목록 (전체 코스 통합, 최근순) */
    public List<WeaknessReportResponse.Info> getMyReports(Long userId) {
        return weaknessReportRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(WeaknessReportResponse.Info::from)
                .toList();
    }

    /** 특정 코스의 내 약점 리포트 이력 */
    public List<WeaknessReportResponse.Info> getMyReportsByCourse(Long userId, Long courseId) {
        return weaknessReportRepository.findByUserIdAndCourseIdOrderByCreatedAtDesc(userId, courseId).stream()
                .map(WeaknessReportResponse.Info::from)
                .toList();
    }

    /** 반 공통 약점 TOP N (교사 모니터링용) */
    public List<WeaknessReportResponse.TopConcept> getTopConcepts(Long courseId, int limit) {
        return weaknessReportRepository.findTopConceptsByCourseId(courseId).stream()
                .limit(Math.max(1, limit))
                .map(row -> WeaknessReportResponse.TopConcept.builder()
                        .concept((String) row[0])
                        .count(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    // ─── 생성 (이벤트 리스너가 호출) ───

    /**
     * PENDING 레코드 즉시 저장 후 비동기 분석 시작.
     * <p>이미 동일 submission에 대한 리포트가 있으면 중복 생성하지 않는다 (멱등).
     * 오답이 0개면 분석 생략.
     */
    @Transactional
    public void createPendingAndAnalyzeAsync(
            Long userId, Long courseId, Long quizSubmissionId, int incorrectCount) {

        if (incorrectCount <= 0) {
            log.debug("[Weakness] 오답 없음 — 분석 생략 submissionId={}", quizSubmissionId);
            return;
        }
        if (weaknessReportRepository.findByQuizSubmissionId(quizSubmissionId).isPresent()) {
            return; // 이미 처리됨
        }

        WeaknessReport pending = WeaknessReport.builder()
                .userId(userId)
                .courseId(courseId)
                .quizSubmissionId(quizSubmissionId)
                .incorrectQuestionCount(incorrectCount)
                .build();
        WeaknessReport saved = weaknessReportRepository.save(pending);
        log.info("[Weakness] PENDING 레코드 생성 reportId={} submissionId={}",
                saved.getId(), quizSubmissionId);

        // 비동기 분석 호출 — 현재 트랜잭션이 끝난 뒤 실행되도록 self-invocation 대신 별도 메서드로
        analyzeAsync(saved.getId());
    }

    /**
     * 실제 AI 호출 단계. {@code @Async}이므로 별도 스레드에서 실행.
     * 실패해도 전체 트랜잭션에 영향 없음 (status=FAILED로 전이).
     */
    @Async
    @Transactional
    public void analyzeAsync(Long reportId) {
        WeaknessReport report = weaknessReportRepository.findById(reportId).orElse(null);
        if (report == null) return;

        try {
            QuizSubmission submission = quizSubmissionRepository.findById(report.getQuizSubmissionId())
                    .orElseThrow(() -> new IllegalStateException("submission not found"));

            if (!aiClient.isConfigured()) {
                log.warn("[Weakness] AI 키 미설정 — FAILED 처리 reportId={}", reportId);
                report.markFailed();
                weaknessReportRepository.save(report);
                return;
            }

            AnalysisResult result = runClaudeAnalysis(submission);
            report.markCompleted(result.weakConcepts, result.recommendations);
            weaknessReportRepository.save(report);
            log.info("[Weakness] 분석 완료 reportId={} concepts={}", reportId, result.weakConcepts.size());
        } catch (Exception e) {
            log.error("[Weakness] 분석 실패 reportId={}", reportId, e);
            report.markFailed();
            weaknessReportRepository.save(report);
        }
    }

    // ─── AI 호출 및 파싱 ───

    private AnalysisResult runClaudeAnalysis(QuizSubmission submission) throws Exception {
        String courseTitle = Optional.ofNullable(submission.getQuiz())
                .map(q -> q.getMaterial().getCurriculum().getCourse().getTitle())
                .orElse("(알 수 없는 강의)");
        String topic = Optional.ofNullable(submission.getQuiz())
                .map(q -> q.getMaterial().getCurriculum().getTopic())
                .orElse("");

        String systemPrompt = """
                당신은 한국어 교육 학습 코치입니다. 학생의 오답을 분석해 취약 개념을 식별하고
                구체적인 학습 권장사항을 제시합니다.

                응답은 반드시 아래 JSON 형식으로만 작성하세요. 다른 설명이나 전후 텍스트를 절대 포함하지 마세요.
                {
                  "weakConcepts": ["개념1", "개념2", "..."],
                  "recommendations": "마크다운 형식의 학습 권장사항 3~5문장"
                }

                weakConcepts는 최대 5개이며, 각 항목은 15자 이내의 간결한 개념명으로 작성하세요.
                recommendations는 학생이 바로 실천할 수 있는 구체적 행동 지침 위주로 작성하세요.
                """;

        String userPrompt = buildUserPrompt(courseTitle, topic, submission);
        String aiResponse = aiClient.generate(systemPrompt, userPrompt);
        return parseResponse(aiResponse);
    }

    /** 사용자 프롬프트 구성 — 문제/정답/학생답/해설 */
    private String buildUserPrompt(String courseTitle, String topic, QuizSubmission submission) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("강의: ").append(courseTitle).append("\n");
        if (!topic.isBlank()) sb.append("주제: ").append(topic).append("\n");
        sb.append("\n아래는 학생이 오답을 낸 문항들입니다. 분석해주세요.\n\n");

        String questionsJson = submission.getQuiz().getQuestionsJson();
        String answersJson = submission.getAnswersJson();

        Map<String, Object> parsed = objectMapper.readValue(questionsJson, new TypeReference<>() {});
        List<Map<String, Object>> questions = castToList(parsed.get("questions"));
        List<Object> studentAnswers = objectMapper.readValue(answersJson, new TypeReference<>() {});

        int incorrectIndex = 1;
        for (int i = 0; i < questions.size() && i < studentAnswers.size(); i++) {
            Object correctAnswer = questions.get(i).get("answer");
            Object studentAnswer = studentAnswers.get(i);
            boolean isWrong = correctAnswer != null && studentAnswer != null
                    && !correctAnswer.toString().equals(studentAnswer.toString());
            if (!isWrong) continue;

            sb.append(incorrectIndex++).append(". 문항: ").append(questions.get(i).get("question")).append("\n");
            sb.append("   학생 답: ").append(studentAnswer).append("\n");
            sb.append("   정답: ").append(correctAnswer).append("\n");
            Object explanation = questions.get(i).get("explanation");
            if (explanation != null) sb.append("   해설: ").append(explanation).append("\n");
            sb.append("\n");
        }
        return sb.toString();
    }

    private AnalysisResult parseResponse(String aiResponse) throws Exception {
        String json = extractJson(aiResponse);
        JsonNode node = objectMapper.readTree(json);

        List<String> concepts = new ArrayList<>();
        JsonNode conceptsNode = node.get("weakConcepts");
        if (conceptsNode != null && conceptsNode.isArray()) {
            int count = 0;
            for (JsonNode c : conceptsNode) {
                if (count >= MAX_WEAK_CONCEPTS) break;
                String text = c.asText("").trim();
                if (!text.isBlank()) {
                    concepts.add(text);
                    count++;
                }
            }
        }

        String recommendations = Optional.ofNullable(node.get("recommendations"))
                .map(JsonNode::asText)
                .orElse("");

        if (concepts.isEmpty()) {
            throw new IllegalStateException("AI 응답에 weakConcepts가 비어있음");
        }
        return new AnalysisResult(concepts, recommendations);
    }

    /** AI 응답에서 순수 JSON만 추출 (마크다운 코드 블록 래퍼 제거) */
    private String extractJson(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        // ```json ... ``` 블록 제거
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline > 0) {
                trimmed = trimmed.substring(firstNewline + 1);
            }
            int lastTripleBacktick = trimmed.lastIndexOf("```");
            if (lastTripleBacktick >= 0) {
                trimmed = trimmed.substring(0, lastTripleBacktick);
            }
        }
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return trimmed.substring(start, end + 1);
        }
        return trimmed;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> castToList(Object obj) {
        if (obj instanceof List<?> list) return (List<Map<String, Object>>) list;
        return List.of();
    }

    /** 내부 분석 결과 레코드 */
    private record AnalysisResult(List<String> weakConcepts, String recommendations) {}
}
