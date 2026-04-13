package com.educraftai.domain.ai.service;

import com.educraftai.domain.ai.dto.AiRequest;
import com.educraftai.domain.ai.dto.AiResponse;
import com.educraftai.domain.ai.entity.AiGenerationLog;
import com.educraftai.domain.ai.repository.AiGenerationLogRepository;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.domain.curriculum.repository.CurriculumRepository;
import com.educraftai.domain.material.entity.Material;
import com.educraftai.domain.material.repository.MaterialRepository;
import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.infra.ai.AiClient;
import com.educraftai.infra.ai.OfflineCurriculumData;
import com.educraftai.infra.ai.OfflineCurriculumData.WeekEntry;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AiGenerationService {

    private final AiClient aiClient;
    private final ObjectMapper objectMapper;
    private final CourseRepository courseRepository;
    private final CurriculumRepository curriculumRepository;
    private final MaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final UserRepository userRepository;
    private final AiGenerationLogRepository aiGenerationLogRepository;

    public AiResponse.CurriculumResult generateCurriculum(Long userId, AiRequest.GenerateCurriculum request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));

        // AI API가 설정된 경우 Claude API 호출, 아니면 오프라인 템플릿 사용
        if (aiClient.isConfigured()) {
            return generateCurriculumWithAi(userId, request, course);
        } else {
            log.info("[오프라인 커리큘럼 생성] AI API 키 미설정 → 내장 템플릿 사용 (subject={}, topic={})",
                    request.getSubject(), request.getTopic());
            return generateCurriculumOffline(userId, request, course);
        }
    }

    /** Claude AI를 사용한 커리큘럼 생성 */
    private AiResponse.CurriculumResult generateCurriculumWithAi(Long userId, AiRequest.GenerateCurriculum request, Course course) {
        String systemPrompt = """
                당신은 교육 커리큘럼 설계 전문가입니다.
                주어진 과목과 주제에 대해 주차별 커리큘럼을 설계해주세요.
                반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
                [
                  {
                    "weekNumber": 1,
                    "topic": "주제",
                    "objectives": "학습 목표",
                    "content": "주요 학습 내용 상세 설명"
                  }
                ]
                """;

        String userPrompt = String.format("""
                과목: %s
                주제: %s
                총 주차: %d주
                대상 수준: %s
                추가 요구사항: %s
                """,
                request.getSubject(),
                request.getTopic(),
                request.getTotalWeeks(),
                request.getTargetLevel() != null ? request.getTargetLevel() : "중급",
                request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "없음"
        );

        String aiResult = aiClient.generate(systemPrompt, userPrompt);
        String jsonContent = extractJson(aiResult);

        try {
            List<Map<String, Object>> weeks = objectMapper.readValue(jsonContent, new TypeReference<>() {});
            List<AiResponse.WeekPlan> weekPlans = new ArrayList<>();

            for (Map<String, Object> week : weeks) {
                int weekNumber = ((Number) week.get("weekNumber")).intValue();
                String topic = (String) week.get("topic");
                String objectives = (String) week.get("objectives");
                String content = (String) week.get("content");

                Curriculum curriculum = Curriculum.builder()
                        .course(course)
                        .weekNumber(weekNumber)
                        .topic(topic)
                        .objectives(objectives)
                        .contentJson(objectMapper.writeValueAsString(Map.of("content", content)))
                        .aiGenerated(true)
                        .build();
                curriculumRepository.save(curriculum);

                // 각 주차별 강의 자료 자동 생성
                String lectureJson = generateOfflineMaterial(topic, objectives, "LECTURE");
                Material lectureMaterial = Material.builder()
                        .curriculum(curriculum)
                        .type(Material.MaterialType.LECTURE)
                        .title(String.format("%d주차 - %s 강의 자료", weekNumber, topic))
                        .contentJson(lectureJson)
                        .difficulty(3)
                        .aiGenerated(true)
                        .build();
                materialRepository.save(lectureMaterial);

                // 각 주차별 퀴즈 자동 생성
                String quizJson = generateOfflineQuiz(topic, 5);
                Material quizMaterial = Material.builder()
                        .curriculum(curriculum)
                        .type(Material.MaterialType.QUIZ)
                        .title(String.format("%d주차 - %s 확인 퀴즈", weekNumber, topic))
                        .contentJson("{}")
                        .difficulty(3)
                        .aiGenerated(true)
                        .build();
                materialRepository.save(quizMaterial);

                Quiz quiz = Quiz.builder()
                        .material(quizMaterial)
                        .questionsJson(quizJson)
                        .timeLimit(15)
                        .build();
                quizRepository.save(quiz);

                weekPlans.add(AiResponse.WeekPlan.builder()
                        .weekNumber(weekNumber)
                        .topic(topic)
                        .objectives(objectives)
                        .content(content)
                        .build());
            }

            int timeSaved = request.getTotalWeeks() * 1800;
            saveLog(userId, userPrompt, "CURRICULUM", timeSaved);
            log.info("[AI 커리큘럼 생성 완료] courseId={}, 총 {}주차 (커리큘럼 + 강의자료 + 퀴즈 자동 생성)", course.getId(), weeks.size());

            return AiResponse.CurriculumResult.builder()
                    .courseId(course.getId())
                    .weeks(weekPlans)
                    .timeSavedSeconds(timeSaved)
                    .build();

        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    /**
     * 오프라인 내장 템플릿 기반 커리큘럼 생성
     * AI API 키 없이도 14개 주요 과목(Java/Python/Web/React/Spring/DB/자료구조/알고리즘/
     * C언어/모바일/네트워크/운영체제/머신러닝/수학)에 대한 고품질 커리큘럼을 제공한다.
     */
    private AiResponse.CurriculumResult generateCurriculumOffline(Long userId, AiRequest.GenerateCurriculum request, Course course) {
        List<WeekEntry> template = OfflineCurriculumData.findTemplate(request.getSubject(), request.getTopic());

        int totalWeeks = request.getTotalWeeks();
        List<AiResponse.WeekPlan> weekPlans = new ArrayList<>();

        for (int i = 0; i < totalWeeks; i++) {
            // 템플릿 길이에 맞게 순환하며 주차 배분
            WeekEntry entry = template.get(i % template.size());

            // 요청 주차가 템플릿보다 많으면 심화/프로젝트 주차로 확장
            String topic = entry.topic();
            String objectives = entry.objectives();
            String content = entry.content();

            if (i >= template.size()) {
                topic = String.format("[심화] %s 응용 (%d주차)", request.getTopic(), i + 1);
                objectives = String.format("%s의 심화 내용을 학습하고 실전에 적용한다", request.getTopic());
                content = String.format("앞서 학습한 %s 내용을 바탕으로 심화 주제를 다룹니다. "
                        + "실전 프로젝트 적용, 코드 리뷰, 최신 동향 분석, 종합 문제 풀이를 진행합니다. "
                        + "%s 분야의 고급 기법과 최적화 방법론을 학습합니다.",
                        entry.topic(), request.getSubject());
            }

            try {
                Curriculum curriculum = Curriculum.builder()
                        .course(course)
                        .weekNumber(i + 1)
                        .topic(topic)
                        .objectives(objectives)
                        .contentJson(objectMapper.writeValueAsString(Map.of("content", content)))
                        .aiGenerated(true)
                        .build();
                curriculumRepository.save(curriculum);

                // 각 주차별 강의 자료 자동 생성
                String lectureJson = generateOfflineMaterial(topic, objectives, "LECTURE");
                Material lectureMaterial = Material.builder()
                        .curriculum(curriculum)
                        .type(Material.MaterialType.LECTURE)
                        .title(String.format("%d주차 - %s 강의 자료", i + 1, topic))
                        .contentJson(lectureJson)
                        .difficulty(3)
                        .aiGenerated(true)
                        .build();
                materialRepository.save(lectureMaterial);

                // 각 주차별 퀴즈 자동 생성
                String quizJson = generateOfflineQuiz(topic, 5);
                Material quizMaterial = Material.builder()
                        .curriculum(curriculum)
                        .type(Material.MaterialType.QUIZ)
                        .title(String.format("%d주차 - %s 확인 퀴즈", i + 1, topic))
                        .contentJson("{}")
                        .difficulty(3)
                        .aiGenerated(true)
                        .build();
                materialRepository.save(quizMaterial);

                Quiz quiz = Quiz.builder()
                        .material(quizMaterial)
                        .questionsJson(quizJson)
                        .timeLimit(15)
                        .build();
                quizRepository.save(quiz);

            } catch (JsonProcessingException e) {
                throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
            }

            weekPlans.add(AiResponse.WeekPlan.builder()
                    .weekNumber(i + 1)
                    .topic(topic)
                    .objectives(objectives)
                    .content(content)
                    .build());
        }

        int timeSaved = totalWeeks * 1800;
        String logPrompt = String.format("[오프라인] 과목: %s, 주제: %s, %d주차", request.getSubject(), request.getTopic(), totalWeeks);
        saveLog(userId, logPrompt, "CURRICULUM", timeSaved);

        log.info("[커리큘럼 생성 완료] courseId={}, 총 {}주차 (커리큘럼 + 강의자료 + 퀴즈 자동 생성)", course.getId(), totalWeeks);

        return AiResponse.CurriculumResult.builder()
                .courseId(course.getId())
                .weeks(weekPlans)
                .timeSavedSeconds(timeSaved)
                .build();
    }

    public AiResponse.MaterialResult generateMaterial(Long userId, AiRequest.GenerateMaterial request) {
        Curriculum curriculum = curriculumRepository.findById(request.getCurriculumId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CURRICULUM_NOT_FOUND));

        String jsonContent;

        if (aiClient.isConfigured()) {
            String systemPrompt = """
                    당신은 교육 자료 제작 전문가입니다.
                    주어진 커리큘럼 정보를 바탕으로 수업 자료를 생성해주세요.
                    반드시 아래 JSON 형식으로만 응답하세요.
                    {
                      "title": "자료 제목",
                      "sections": [
                        {
                          "heading": "섹션 제목",
                          "content": "섹션 내용 (마크다운 지원)",
                          "keyPoints": ["핵심 포인트1", "핵심 포인트2"]
                        }
                      ],
                      "summary": "전체 요약"
                    }
                    """;

            String userPrompt = String.format("""
                    주제: %s
                    학습 목표: %s
                    자료 유형: %s
                    난이도: %d/5
                    추가 요구사항: %s
                    """,
                    curriculum.getTopic(),
                    curriculum.getObjectives(),
                    request.getType(),
                    request.getDifficulty() != null ? request.getDifficulty() : 3,
                    request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "없음"
            );

            String aiResult = aiClient.generate(systemPrompt, userPrompt);
            jsonContent = extractJson(aiResult);
        } else {
            log.info("[오프라인 자료 생성] topic={}", curriculum.getTopic());
            jsonContent = generateOfflineMaterial(curriculum.getTopic(), curriculum.getObjectives(), request.getType());
        }

        Material.MaterialType materialType = Material.MaterialType.valueOf(request.getType().toUpperCase());

        Material material = Material.builder()
                .curriculum(curriculum)
                .type(materialType)
                .title(curriculum.getTopic() + " - " + request.getType())
                .contentJson(jsonContent)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : 3)
                .aiGenerated(true)
                .build();
        materialRepository.save(material);

        int timeSaved = 3600;
        saveLog(userId, String.format("[%s] 주제: %s", aiClient.isConfigured() ? "AI" : "오프라인", curriculum.getTopic()), "MATERIAL", timeSaved);

        return AiResponse.MaterialResult.builder()
                .materialId(material.getId())
                .title(material.getTitle())
                .contentJson(jsonContent)
                .timeSavedSeconds(timeSaved)
                .build();
    }

    public AiResponse.QuizResult generateQuiz(Long userId, AiRequest.GenerateQuiz request) {
        Curriculum curriculum = curriculumRepository.findById(request.getCurriculumId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CURRICULUM_NOT_FOUND));

        String jsonContent;

        if (aiClient.isConfigured()) {
            String systemPrompt = """
                    당신은 교육 평가 문제 출제 전문가입니다.
                    주어진 커리큘럼 정보를 바탕으로 퀴즈 문제를 생성해주세요.
                    반드시 아래 JSON 형식으로만 응답하세요.
                    {
                      "questions": [
                        {
                          "number": 1,
                          "type": "MULTIPLE_CHOICE",
                          "question": "문제 내용",
                          "options": ["보기1", "보기2", "보기3", "보기4"],
                          "answer": 0,
                          "explanation": "해설"
                        }
                      ]
                    }
                    type은 MULTIPLE_CHOICE(객관식) 또는 SHORT_ANSWER(주관식)입니다.
                    객관식의 answer는 정답 보기의 인덱스(0부터), 주관식의 answer는 정답 문자열입니다.
                    """;

            String userPrompt = String.format("""
                    주제: %s
                    학습 목표: %s
                    문제 수: %d개
                    난이도: %d/5
                    문제 유형: %s
                    추가 요구사항: %s
                    """,
                    curriculum.getTopic(),
                    curriculum.getObjectives(),
                    request.getQuestionCount(),
                    request.getDifficulty() != null ? request.getDifficulty() : 3,
                    request.getQuestionTypes() != null ? request.getQuestionTypes() : "객관식 위주",
                    request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "없음"
            );

            String aiResult = aiClient.generate(systemPrompt, userPrompt);
            jsonContent = extractJson(aiResult);
        } else {
            log.info("[오프라인 퀴즈 생성] topic={}, count={}", curriculum.getTopic(), request.getQuestionCount());
            jsonContent = generateOfflineQuiz(curriculum.getTopic(), request.getQuestionCount());
        }

        Material material = Material.builder()
                .curriculum(curriculum)
                .type(Material.MaterialType.QUIZ)
                .title(curriculum.getTopic() + " - 퀴즈")
                .contentJson(jsonContent)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : 3)
                .aiGenerated(true)
                .build();
        materialRepository.save(material);

        Quiz quiz = Quiz.builder()
                .material(material)
                .questionsJson(jsonContent)
                .timeLimit(request.getQuestionCount() * 2)
                .build();
        quizRepository.save(quiz);

        int timeSaved = request.getQuestionCount() * 600;
        saveLog(userId, String.format("[%s] 주제: %s, %d문제", aiClient.isConfigured() ? "AI" : "오프라인", curriculum.getTopic(), request.getQuestionCount()), "QUIZ", timeSaved);

        return AiResponse.QuizResult.builder()
                .quizId(quiz.getId())
                .materialId(material.getId())
                .questionsJson(jsonContent)
                .questionCount(request.getQuestionCount())
                .timeSavedSeconds(timeSaved)
                .build();
    }

    /** 학년별 AI 퀴즈 생성 (학생용, DB 저장 없이 바로 반환) */
    public AiResponse.GradeQuizResult generateGradeQuiz(Long userId, AiRequest.GenerateGradeQuiz request) {
        int questionCount = request.getQuestionCount() != null ? request.getQuestionCount() : 5;
        int difficulty = request.getDifficulty() != null ? request.getDifficulty() : 3;

        // 학년 코드를 한국어 텍스트로 변환
        String gradeLabel = convertGradeLabel(request.getGrade());

        String systemPrompt = """
                당신은 한국 교육과정에 맞는 문제 출제 전문가입니다.
                학생의 학년과 과목에 맞는 수준의 퀴즈 문제를 생성해주세요.
                한국 교육과정 기준으로 해당 학년에서 실제로 배우는 내용으로 출제하세요.
                반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
                {
                  "questions": [
                    {
                      "number": 1,
                      "type": "MULTIPLE_CHOICE",
                      "question": "문제 내용",
                      "options": ["보기1", "보기2", "보기3", "보기4"],
                      "answer": 0,
                      "explanation": "해설"
                    }
                  ]
                }
                type은 MULTIPLE_CHOICE(객관식) 또는 SHORT_ANSWER(주관식)입니다.
                객관식의 answer는 정답 보기의 인덱스(0부터), 주관식의 answer는 정답 문자열입니다.
                객관식과 주관식을 적절히 섞어서 출제하세요.
                """;

        String userPrompt = String.format("""
                학년: %s
                과목: %s
                문제 수: %d개
                난이도: %d/5 (1=매우 쉬움, 3=보통, 5=매우 어려움)

                위 학년의 한국 교육과정에 맞는 %s 문제를 출제해주세요.
                학생이 실제 학교 시험에서 만날 수 있는 수준의 문제로 만들어주세요.
                """,
                gradeLabel, request.getSubject(), questionCount, difficulty, request.getSubject()
        );

        log.info("[AI 학년별 퀴즈 생성] userId={}, grade={}, subject={}, count={}", userId, request.getGrade(), request.getSubject(), questionCount);

        String aiResult = aiClient.generate(systemPrompt, userPrompt);
        String jsonContent = extractJson(aiResult);

        return AiResponse.GradeQuizResult.builder()
                .questionsJson(jsonContent)
                .questionCount(questionCount)
                .grade(request.getGrade())
                .subject(request.getSubject())
                .build();
    }

    /** 학년 코드를 한국어 라벨로 변환 */
    private String convertGradeLabel(String grade) {
        return switch (grade) {
            case "ELEMENTARY_1" -> "초등학교 1학년";
            case "ELEMENTARY_2" -> "초등학교 2학년";
            case "ELEMENTARY_3" -> "초등학교 3학년";
            case "ELEMENTARY_4" -> "초등학교 4학년";
            case "ELEMENTARY_5" -> "초등학교 5학년";
            case "ELEMENTARY_6" -> "초등학교 6학년";
            case "MIDDLE_1" -> "중학교 1학년";
            case "MIDDLE_2" -> "중학교 2학년";
            case "MIDDLE_3" -> "중학교 3학년";
            case "HIGH_1" -> "고등학교 1학년";
            case "HIGH_2" -> "고등학교 2학년";
            case "HIGH_3" -> "고등학교 3학년";
            default -> grade;
        };
    }

    public AiResponse.SupplementResult generateSupplement(Long userId, AiRequest.GenerateSupplement request) {
        QuizSubmission submission = quizSubmissionRepository.findById(request.getQuizSubmissionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.QUIZ_NOT_FOUND));

        String systemPrompt = """
                당신은 교육 보충학습 전문가입니다.
                학생의 퀴즈 결과를 분석하여 틀린 문제에 대한 보충 설명과 추가 연습 문제를 생성해주세요.
                반드시 아래 JSON 형식으로만 응답하세요.
                {
                  "explanations": [
                    {
                      "questionNumber": 1,
                      "concept": "관련 개념",
                      "explanation": "상세 설명",
                      "tips": "학습 팁"
                    }
                  ],
                  "additionalQuestions": [
                    {
                      "question": "추가 연습 문제",
                      "answer": "정답",
                      "hint": "힌트"
                    }
                  ]
                }
                """;

        String userPrompt = String.format("""
                퀴즈 문제: %s
                학생 답안: %s
                점수: %d/%d
                추가 요구사항: %s
                """,
                submission.getQuiz().getQuestionsJson(),
                submission.getAnswersJson(),
                submission.getScore(),
                submission.getTotalQuestions(),
                request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "없음"
        );

        String aiResult = aiClient.generate(systemPrompt, userPrompt);
        String jsonContent = extractJson(aiResult);

        int timeSaved = 1800;
        saveLog(userId, userPrompt, "SUPPLEMENT", timeSaved);

        try {
            Map<String, Object> parsed = objectMapper.readValue(jsonContent, new TypeReference<>() {});
            return AiResponse.SupplementResult.builder()
                    .explanationJson(objectMapper.writeValueAsString(parsed.get("explanations")))
                    .additionalQuestionsJson(objectMapper.writeValueAsString(parsed.get("additionalQuestions")))
                    .timeSavedSeconds(timeSaved)
                    .build();
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    private void saveLog(Long userId, String prompt, String resultType, int timeSaved) {
        userRepository.findById(userId).ifPresentOrElse(
            user -> {
                AiGenerationLog logEntry = AiGenerationLog.builder()
                        .teacher(user)
                        .prompt(prompt)
                        .resultType(resultType)
                        .timeSavedSeconds(timeSaved)
                        .build();
                aiGenerationLogRepository.save(logEntry);
            },
            () -> log.warn("[AI 로그] 사용자를 찾을 수 없어 로그 저장 생략 (userId={})", userId)
        );
    }

    /** 오프라인 수업 자료 생성 (내장 템플릿) */
    private String generateOfflineMaterial(String topic, String objectives, String type) {
        String typeLabel = "LECTURE".equalsIgnoreCase(type) ? "강의 자료" : "실습 자료";
        try {
            Map<String, Object> material = Map.of(
                "title", topic + " " + typeLabel,
                "sections", List.of(
                    Map.of(
                        "heading", "1. " + topic + " 개요",
                        "content", objectives + "\n\n이번 " + typeLabel + "에서는 " + topic + "의 핵심 개념을 체계적으로 학습합니다. 기본 원리부터 실전 활용까지 단계적으로 다루며, 각 섹션별 핵심 포인트를 정리합니다.",
                        "keyPoints", List.of(topic + "의 정의와 필요성", "기본 구조와 동작 원리", "실제 활용 사례")
                    ),
                    Map.of(
                        "heading", "2. 핵심 개념 정리",
                        "content", topic + "을(를) 구성하는 핵심 요소들을 하나씩 살펴봅니다. 각 개념의 정의, 특징, 장단점을 비교 분석하고, 실제 코드나 예제를 통해 이해를 확인합니다.",
                        "keyPoints", List.of("주요 용어 정리", "개념 간 관계 파악", "예제를 통한 이해 확인")
                    ),
                    Map.of(
                        "heading", "3. 실전 예제와 연습",
                        "content", "앞서 배운 개념을 바탕으로 실전 예제를 풀어봅니다. 단계별로 난이도를 높여가며 문제를 해결하고, 최종적으로 종합 과제를 수행합니다.",
                        "keyPoints", List.of("기초 예제 풀이", "응용 문제 도전", "종합 과제 수행")
                    )
                ),
                "summary", topic + "의 핵심 개념을 학습하고, 실전 예제를 통해 이해를 심화했습니다. 다음 주차에서는 이를 바탕으로 더 심화된 내용을 다룹니다."
            );
            return objectMapper.writeValueAsString(material);
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    /** 오프라인 퀴즈 생성 (범용 문제 템플릿) */
    private String generateOfflineQuiz(String topic, int questionCount) {
        List<Map<String, Object>> questions = new ArrayList<>();
        String[][] templates = {
            {"다음 중 %s에 대한 설명으로 올바른 것은?", "%s의 기본 개념에 해당한다", "%s와 관련이 없다", "%s에서 사용되지 않는다", "%s의 반대 개념이다"},
            {"다음 중 %s의 주요 특징이 아닌 것은?", "효율적인 처리가 가능하다", "재사용성이 높다", "모든 경우에 항상 최적이다", "유지보수가 용이하다"},
            {"다음 중 %s을(를) 활용하는 가장 적절한 상황은?", "해당 개념이 필요한 문제를 해결할 때", "관련 없는 작업을 수행할 때", "단순 반복 작업만 할 때", "어떤 상황에서도 사용하지 않을 때"},
            {"%s에서 가장 중요한 원칙은?", "정확성과 효율성의 균형", "속도만 추구하는 것", "복잡성을 최대화하는 것", "가독성을 무시하는 것"},
            {"%s의 장점으로 올바른 것은?", "코드의 재사용성과 유지보수성 향상", "항상 실행 속도가 빨라진다", "메모리를 무제한으로 사용할 수 있다", "디버깅이 불필요해진다"},
        };

        for (int i = 0; i < questionCount; i++) {
            String[] tmpl = templates[i % templates.length];
            if (i % 3 == 2) {
                // 주관식
                questions.add(Map.of(
                    "number", i + 1,
                    "type", "SHORT_ANSWER",
                    "question", String.format("%s의 핵심 개념을 한 문장으로 설명하세요.", topic),
                    "options", List.of(),
                    "answer", topic + "의 기본 원리를 이해하고 적용하는 것",
                    "explanation", topic + "은(는) 해당 분야의 핵심 개념으로, 기본 원리를 이해하는 것이 가장 중요합니다."
                ));
            } else {
                // 객관식
                questions.add(Map.of(
                    "number", i + 1,
                    "type", "MULTIPLE_CHOICE",
                    "question", String.format(tmpl[0], topic),
                    "options", List.of(
                        String.format(tmpl[1], topic),
                        String.format(tmpl[2], topic),
                        String.format(tmpl[3], topic),
                        String.format(tmpl[4], topic)
                    ),
                    "answer", 0,
                    "explanation", topic + "에 대한 기본 개념을 정확히 이해하고 있어야 합니다. 정답은 첫 번째 보기입니다."
                ));
            }
        }

        try {
            return objectMapper.writeValueAsString(Map.of("questions", questions));
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    private String extractJson(String text) {
        text = text.trim();
        int startBrace = text.indexOf('{');
        int startBracket = text.indexOf('[');

        int start;
        char endChar;
        if (startBrace == -1 && startBracket == -1) {
            return text;
        } else if (startBrace == -1) {
            start = startBracket;
            endChar = ']';
        } else if (startBracket == -1) {
            start = startBrace;
            endChar = '}';
        } else {
            start = Math.min(startBrace, startBracket);
            endChar = start == startBrace ? '}' : ']';
        }

        int end = text.lastIndexOf(endChar);
        if (end == -1) return text;

        return text.substring(start, end + 1);
    }
}
