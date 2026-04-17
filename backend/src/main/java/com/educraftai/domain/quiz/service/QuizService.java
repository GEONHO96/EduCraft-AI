package com.educraftai.domain.quiz.service;

import com.educraftai.domain.quiz.dto.QuizRequest;
import com.educraftai.domain.quiz.dto.QuizResponse;
import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /** 퀴즈 단건 조회 */
    public QuizResponse.Info getQuiz(Long quizId) {
        return QuizResponse.Info.from(findQuiz(quizId));
    }

    /** 퀴즈 제출 — 중복 제출 방지, 즉시 채점 */
    @Transactional
    public QuizResponse.SubmissionResult submitQuiz(Long quizId, Long studentId, QuizRequest.Submit request) {
        Quiz quiz = findQuiz(quizId);

        if (submissionRepository.existsByQuizIdAndStudentId(quizId, studentId)) {
            throw new BusinessException(ErrorCode.ALREADY_SUBMITTED);
        }

        User student = findUser(studentId);
        int score = calculateScore(quiz.getQuestionsJson(), request.getAnswersJson());
        int totalQuestions = countQuestions(quiz.getQuestionsJson());

        QuizSubmission submission = submissionRepository.save(QuizSubmission.builder()
                .quiz(quiz)
                .student(student)
                .answersJson(request.getAnswersJson())
                .score(score)
                .totalQuestions(totalQuestions)
                .build());

        return QuizResponse.SubmissionResult.from(submission);
    }

    /**
     * 학생 본인의 제출 결과 조회.
     * <p>제출 기록이 없으면 {@link ErrorCode#QUIZ_SUBMISSION_NOT_FOUND}로 변경
     * (기존엔 {@code QUIZ_NOT_FOUND}였으나 의미가 부정확했음).
     */
    public QuizResponse.SubmissionResult getSubmissionResult(Long quizId, Long studentId) {
        QuizSubmission submission = submissionRepository.findByQuizIdAndStudentId(quizId, studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUIZ_SUBMISSION_NOT_FOUND));
        return QuizResponse.SubmissionResult.from(submission);
    }

    /** 선생님용 — 해당 퀴즈의 전체 학생 제출 결과 */
    public List<QuizResponse.SubmissionResult> getQuizResults(Long quizId) {
        return submissionRepository.findByQuizId(quizId).stream()
                .map(QuizResponse.SubmissionResult::from)
                .toList();
    }

    // ─── 내부 헬퍼 ───

    private Quiz findQuiz(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUIZ_NOT_FOUND));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private int calculateScore(String questionsJson, String answersJson) {
        try {
            List<Map<String, Object>> questionList = parseQuestionList(questionsJson);
            if (questionList == null || questionList.isEmpty()) {
                return 0;
            }

            List<Object> studentAnswers = objectMapper.readValue(answersJson, new TypeReference<>() {});
            if (studentAnswers == null) {
                return 0;
            }

            int correct = 0;
            for (int i = 0; i < questionList.size() && i < studentAnswers.size(); i++) {
                Object correctAnswer = questionList.get(i).get("answer");
                Object studentAnswer = studentAnswers.get(i);

                if (correctAnswer != null && studentAnswer != null
                        && correctAnswer.toString().equals(studentAnswer.toString())) {
                    correct++;
                }
            }
            return correct;
        } catch (Exception e) {
            log.warn("[Quiz] 점수 계산 실패: {}", e.getMessage());
            return 0;
        }
    }

    private int countQuestions(String questionsJson) {
        try {
            List<?> questionList = parseQuestionList(questionsJson);
            return questionList != null ? questionList.size() : 0;
        } catch (Exception e) {
            log.warn("[Quiz] 문제 수 조회 실패: {}", e.getMessage());
            return 0;
        }
    }

    /** questionsJson에서 questions 배열을 안전하게 추출 */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseQuestionList(String questionsJson) throws Exception {
        Map<String, Object> parsed = objectMapper.readValue(questionsJson, new TypeReference<>() {});
        Object questions = parsed.get("questions");
        if (questions instanceof List<?> list) {
            return (List<Map<String, Object>>) list;
        }
        return null;
    }
}
