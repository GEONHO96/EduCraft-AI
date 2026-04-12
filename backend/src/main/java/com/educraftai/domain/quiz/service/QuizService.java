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

    public QuizResponse.Info getQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUIZ_NOT_FOUND));
        return QuizResponse.Info.from(quiz);
    }

    @Transactional
    public QuizResponse.SubmissionResult submitQuiz(Long quizId, Long studentId, QuizRequest.Submit request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUIZ_NOT_FOUND));

        if (submissionRepository.existsByQuizIdAndStudentId(quizId, studentId)) {
            throw new BusinessException(ErrorCode.ALREADY_SUBMITTED);
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        int score = calculateScore(quiz.getQuestionsJson(), request.getAnswersJson());
        int totalQuestions = countQuestions(quiz.getQuestionsJson());

        QuizSubmission submission = QuizSubmission.builder()
                .quiz(quiz)
                .student(student)
                .answersJson(request.getAnswersJson())
                .score(score)
                .totalQuestions(totalQuestions)
                .build();

        submissionRepository.save(submission);
        return QuizResponse.SubmissionResult.from(submission);
    }

    public QuizResponse.SubmissionResult getSubmissionResult(Long quizId, Long studentId) {
        QuizSubmission submission = submissionRepository.findByQuizIdAndStudentId(quizId, studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUIZ_NOT_FOUND));
        return QuizResponse.SubmissionResult.from(submission);
    }

    public List<QuizResponse.SubmissionResult> getQuizResults(Long quizId) {
        return submissionRepository.findByQuizId(quizId).stream()
                .map(QuizResponse.SubmissionResult::from)
                .toList();
    }

    private int calculateScore(String questionsJson, String answersJson) {
        try {
            Map<String, Object> questions = objectMapper.readValue(questionsJson, new TypeReference<>() {});
            List<Map<String, Object>> questionList = (List<Map<String, Object>>) questions.get("questions");
            List<Object> studentAnswers = objectMapper.readValue(answersJson, new TypeReference<>() {});

            int correct = 0;
            for (int i = 0; i < questionList.size() && i < studentAnswers.size(); i++) {
                Object correctAnswer = questionList.get(i).get("answer");
                Object studentAnswer = studentAnswers.get(i);

                if (correctAnswer != null && correctAnswer.toString().equals(studentAnswer.toString())) {
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
            Map<String, Object> questions = objectMapper.readValue(questionsJson, new TypeReference<>() {});
            List<?> questionList = (List<?>) questions.get("questions");
            return questionList.size();
        } catch (Exception e) {
            log.warn("[Quiz] 점수 계산 실패: {}", e.getMessage());
            return 0;
        }
    }
}
