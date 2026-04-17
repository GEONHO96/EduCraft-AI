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
import com.educraftai.domain.quiz.entity.GradeQuizSubmission;
import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.GradeQuizSubmissionRepository;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.infra.ai.AiClient;
import com.educraftai.infra.ai.OfflineCurriculumData;
import com.educraftai.infra.ai.OfflineCurriculumData.WeekEntry;
import com.educraftai.infra.ai.OfflineQuizData;
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

    // ====== 시간 절약 상수 (초 단위) ======
    /** 커리큘럼 1주차당 절약 시간 (30분) */
    private static final int TIME_SAVED_PER_WEEK = 1800;
    /** 수업 자료 1건당 절약 시간 (1시간) */
    private static final int TIME_SAVED_PER_MATERIAL = 3600;
    /** 퀴즈 문제 1문항당 절약 시간 (10분) */
    private static final int TIME_SAVED_PER_QUESTION = 600;
    /** 보충학습 1건당 절약 시간 (30분) */
    private static final int TIME_SAVED_PER_SUPPLEMENT = 1800;

    private final AiClient aiClient;
    private final ObjectMapper objectMapper;
    private final CourseRepository courseRepository;
    private final CurriculumRepository curriculumRepository;
    private final MaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final GradeQuizSubmissionRepository gradeQuizSubmissionRepository;
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

                weekPlans.add(saveWeekWithMaterials(course, weekNumber, topic, objectives, content));
            }

            int timeSaved = request.getTotalWeeks() * TIME_SAVED_PER_WEEK;
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
                weekPlans.add(saveWeekWithMaterials(course, i + 1, topic, objectives, content));
            } catch (JsonProcessingException e) {
                throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
            }
        }

        int timeSaved = totalWeeks * TIME_SAVED_PER_WEEK;
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

        Material.MaterialType materialType = com.educraftai.global.util.EnumUtil.safeValueOfUpperCase(
                Material.MaterialType.class, request.getType(), ErrorCode.INVALID_ENUM_VALUE);

        Material material = Material.builder()
                .curriculum(curriculum)
                .type(materialType)
                .title(curriculum.getTopic() + " - " + request.getType())
                .contentJson(jsonContent)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : 3)
                .aiGenerated(true)
                .build();
        materialRepository.save(material);

        int timeSaved = TIME_SAVED_PER_MATERIAL;
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

        int timeSaved = request.getQuestionCount() * TIME_SAVED_PER_QUESTION;
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

    /**
     * 학년 코드를 한국어 라벨로 변환한다.
     * <p>AI 프롬프트 문맥에 맞추기 위해 "초등학교 1학년"처럼 긴 형식을 사용한다.
     * 대시보드 UI 등 짧은 라벨이 필요한 곳은 {@link com.educraftai.global.util.GradeLabelMapper}를 쓴다.
     */
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

    /**
     * 학년별 AI 퀴즈 결과 저장.
     * <p>기존에는 {@code AiController}가 {@link UserRepository}·{@link GradeQuizSubmissionRepository}를 직접 주입받아
     * 엔티티를 빌드·저장했으나, 컨트롤러 책임을 벗어나므로 서비스로 이관.
     */
    public AiResponse.GradeQuizSubmissionResult submitGradeQuiz(Long userId, AiRequest.SubmitGradeQuiz request) {
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        GradeQuizSubmission submission = gradeQuizSubmissionRepository.save(GradeQuizSubmission.builder()
                .student(student)
                .grade(request.getGrade())
                .subject(request.getSubject())
                .score(request.getScore())
                .totalQuestions(request.getTotalQuestions())
                .build());

        return AiResponse.GradeQuizSubmissionResult.builder()
                .id(submission.getId())
                .grade(submission.getGrade())
                .subject(submission.getSubject())
                .score(submission.getScore())
                .totalQuestions(submission.getTotalQuestions())
                .submittedAt(submission.getSubmittedAt().toString())
                .build();
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

        int timeSaved = TIME_SAVED_PER_SUPPLEMENT;
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

    /**
     * 주차별 커리큘럼 + 강의자료 + 퀴즈를 한 번에 저장한다.
     * 온라인(AI)/오프라인 커리큘럼 생성에서 공통으로 사용되는 핵심 저장 로직.
     */
    private AiResponse.WeekPlan saveWeekWithMaterials(Course course, int weekNumber, String topic,
                                                       String objectives, String content) throws JsonProcessingException {
        Curriculum curriculum = Curriculum.builder()
                .course(course)
                .weekNumber(weekNumber)
                .topic(topic)
                .objectives(objectives)
                .contentJson(objectMapper.writeValueAsString(Map.of("content", content)))
                .aiGenerated(true)
                .build();
        curriculumRepository.save(curriculum);

        // 강의 자료 생성
        String lectureJson = generateOfflineMaterial(topic, objectives, content, "LECTURE");
        Material lectureMaterial = Material.builder()
                .curriculum(curriculum)
                .type(Material.MaterialType.LECTURE)
                .title(String.format("%d주차 - %s 강의 자료", weekNumber, topic))
                .contentJson(lectureJson)
                .difficulty(3)
                .aiGenerated(true)
                .build();
        materialRepository.save(lectureMaterial);

        // 퀴즈 생성
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

        return AiResponse.WeekPlan.builder()
                .curriculumId(curriculum.getId())
                .weekNumber(weekNumber)
                .topic(topic)
                .objectives(objectives)
                .content(content)
                .materialContentJson(lectureJson)
                .quizQuestionsJson(quizJson)
                .build();
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

    /**
     * 오프라인 수업 자료 생성 — 커리큘럼 content를 파싱하여 실제 교육 내용 구성
     * content 텍스트를 문장 단위로 분리 → 섹션별로 그룹핑 → 핵심 키워드 추출
     */
    private String generateOfflineMaterial(String topic, String objectives, String curriculumContent, String type) {
        String typeLabel = "LECTURE".equalsIgnoreCase(type) ? "강의 자료" : "실습 자료";
        try {
            // 커리큘럼 content를 문장 단위로 분리 (마침표 기준)
            String[] sentences = curriculumContent.split("(?<=다\\.)\\s*|(?<=니다\\.)\\s*");
            List<String> validSentences = new ArrayList<>();
            for (String s : sentences) {
                String trimmed = s.trim();
                if (!trimmed.isEmpty() && trimmed.length() > 5) {
                    validSentences.add(trimmed);
                }
            }

            // 최소 3문장 보장
            while (validSentences.size() < 3) {
                validSentences.add(topic + "의 심화 내용을 추가로 학습합니다.");
            }

            // 문장들을 3개 섹션으로 분배
            int total = validSentences.size();
            int sec1End = Math.max(1, total / 3);
            int sec2End = Math.max(sec1End + 1, total * 2 / 3);

            String section1Content = String.join(" ", validSentences.subList(0, sec1End));
            String section2Content = String.join(" ", validSentences.subList(sec1End, sec2End));
            String section3Content = String.join(" ", validSentences.subList(sec2End, total));

            // 각 섹션에서 핵심 키워드 추출 (괄호 안 용어들)
            List<String> keyPoints1 = extractKeyPoints(section1Content, topic);
            List<String> keyPoints2 = extractKeyPoints(section2Content, topic);
            List<String> keyPoints3 = extractKeyPoints(section3Content, topic);

            Map<String, Object> material = Map.of(
                "title", topic + " " + typeLabel,
                "sections", List.of(
                    Map.of(
                        "heading", "1. 학습 목표 및 개요",
                        "content", objectives + "\n\n" + section1Content,
                        "keyPoints", keyPoints1
                    ),
                    Map.of(
                        "heading", "2. 핵심 개념 상세",
                        "content", section2Content,
                        "keyPoints", keyPoints2
                    ),
                    Map.of(
                        "heading", "3. 실습 및 응용",
                        "content", section3Content,
                        "keyPoints", keyPoints3
                    )
                ),
                "summary", String.format("이번 강의에서는 %s을(를) 학습했습니다. %s 다음 주차에서는 이를 바탕으로 심화 내용을 다룹니다.",
                        topic, objectives)
            );
            return objectMapper.writeValueAsString(material);
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    /** 기존 호환용 — content 없이 호출 시 (단독 자료 생성용) */
    private String generateOfflineMaterial(String topic, String objectives, String type) {
        return generateOfflineMaterial(topic, objectives, objectives, type);
    }

    /** 텍스트에서 핵심 키워드(괄호 안 용어, 키 개념) 추출 */
    private List<String> extractKeyPoints(String text, String topic) {
        List<String> points = new ArrayList<>();

        // 괄호 안의 용어 추출 (한글 괄호 + 영문 괄호)
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("[（(]([^)）]+)[)）]").matcher(text);
        while (matcher.find() && points.size() < 4) {
            String term = matcher.group(1).trim();
            if (term.length() >= 2 && term.length() <= 50) {
                points.add(term);
            }
        }

        // 괄호 추출이 부족하면 문장에서 주요 키워드 추가
        if (points.size() < 3) {
            String[] keywords = text.split("[,，·/]");
            for (String kw : keywords) {
                String trimmed = kw.trim();
                // 짧은 핵심 키워드만 추출
                if (trimmed.length() >= 3 && trimmed.length() <= 30 && points.size() < 4) {
                    // "를 학습합니다" 등 서술어 제거
                    trimmed = trimmed.replaceAll("을\\s*(학습|다룹|실습|소개).*", "").trim();
                    trimmed = trimmed.replaceAll("를\\s*(학습|다룹|실습|소개).*", "").trim();
                    if (trimmed.length() >= 2 && !points.contains(trimmed)) {
                        points.add(trimmed);
                    }
                }
            }
        }

        // 최소 2개 보장
        if (points.isEmpty()) {
            points.add(topic + " 핵심 개념 이해");
            points.add("실전 예제를 통한 응용");
        } else if (points.size() == 1) {
            points.add("실전 예제를 통한 응용");
        }

        return points.subList(0, Math.min(points.size(), 4));
    }

    /** 오프라인 퀴즈 생성 — OfflineQuizData 문제 은행에서 실제 문제 출제 */
    private String generateOfflineQuiz(String topic, int questionCount) {
        List<Map<String, Object>> questions = OfflineQuizData.findQuestions(topic, questionCount);
        try {
            return objectMapper.writeValueAsString(Map.of("questions", questions));
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    /**
     * AI 응답에서 JSON 부분만 추출한다.
     * 마크다운 코드블록이나 부가 텍스트가 섞여 있어도 { } 또는 [ ] 범위만 안전하게 반환한다.
     */
    private String extractJson(String text) {
        if (text == null || text.isBlank()) {
            return "{}";
        }

        text = text.trim();

        // 마크다운 코드블록 제거 (```json ... ```)
        if (text.contains("```")) {
            int codeStart = text.indexOf("```");
            int lineEnd = text.indexOf('\n', codeStart);
            int codeEnd = text.indexOf("```", lineEnd > 0 ? lineEnd : codeStart + 3);
            if (lineEnd > 0 && codeEnd > lineEnd) {
                text = text.substring(lineEnd + 1, codeEnd).trim();
            }
        }

        int startBrace = text.indexOf('{');
        int startBracket = text.indexOf('[');

        // JSON 시작 문자가 없으면 원본 반환
        if (startBrace == -1 && startBracket == -1) {
            return text;
        }

        int start;
        char endChar;
        if (startBrace == -1) {
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

        // end가 start보다 앞이거나 없으면 원본 반환 (StringIndexOutOfBoundsException 방지)
        if (end < 0 || end < start) {
            return text;
        }

        return text.substring(start, end + 1);
    }
}
