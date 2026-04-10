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

        if (!course.getTeacher().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_COURSE_OWNER);
        }

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

                weekPlans.add(AiResponse.WeekPlan.builder()
                        .weekNumber(weekNumber)
                        .topic(topic)
                        .objectives(objectives)
                        .content(content)
                        .build());
            }

            int timeSaved = request.getTotalWeeks() * 1800;
            saveLog(userId, userPrompt, "CURRICULUM", timeSaved);

            return AiResponse.CurriculumResult.builder()
                    .courseId(course.getId())
                    .weeks(weekPlans)
                    .timeSavedSeconds(timeSaved)
                    .build();

        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.AI_GENERATION_FAILED);
        }
    }

    public AiResponse.MaterialResult generateMaterial(Long userId, AiRequest.GenerateMaterial request) {
        Curriculum curriculum = curriculumRepository.findById(request.getCurriculumId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CURRICULUM_NOT_FOUND));

        if (!curriculum.getCourse().getTeacher().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_COURSE_OWNER);
        }

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
        String jsonContent = extractJson(aiResult);

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
        saveLog(userId, userPrompt, "MATERIAL", timeSaved);

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

        if (!curriculum.getCourse().getTeacher().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_COURSE_OWNER);
        }

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
        String jsonContent = extractJson(aiResult);

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
        saveLog(userId, userPrompt, "QUIZ", timeSaved);

        return AiResponse.QuizResult.builder()
                .quizId(quiz.getId())
                .materialId(material.getId())
                .questionsJson(jsonContent)
                .questionCount(request.getQuestionCount())
                .timeSavedSeconds(timeSaved)
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        AiGenerationLog logEntry = AiGenerationLog.builder()
                .teacher(user)
                .prompt(prompt)
                .resultType(resultType)
                .timeSavedSeconds(timeSaved)
                .build();
        aiGenerationLogRepository.save(logEntry);
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
