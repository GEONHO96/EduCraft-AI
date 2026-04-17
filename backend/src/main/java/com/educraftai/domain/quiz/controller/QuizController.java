package com.educraftai.domain.quiz.controller;

import com.educraftai.domain.quiz.dto.QuizRequest;
import com.educraftai.domain.quiz.dto.QuizResponse;
import com.educraftai.domain.quiz.service.QuizService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 퀴즈 API 컨트롤러.
 * <p>강의 내 퀴즈(Quiz 엔티티) 조회·제출·결과 확인을 처리한다.
 */
@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    /** 퀴즈 단건 조회 */
    @GetMapping("/{quizId}")
    public ApiResponse<QuizResponse.Info> getQuiz(@PathVariable Long quizId) {
        return ApiResponse.ok(quizService.getQuiz(quizId));
    }

    /** 퀴즈 제출 (학생 전용) — 즉시 채점 결과 반환 */
    @PostMapping("/{quizId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<QuizResponse.SubmissionResult> submitQuiz(@CurrentUserId Long userId,
                                                                 @PathVariable Long quizId,
                                                                 @Valid @RequestBody QuizRequest.Submit request) {
        return ApiResponse.ok(quizService.submitQuiz(quizId, userId, request));
    }

    /** 퀴즈의 전체 학생 제출 결과 (선생님 전용) */
    @GetMapping("/{quizId}/results")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<List<QuizResponse.SubmissionResult>> getQuizResults(@PathVariable Long quizId) {
        return ApiResponse.ok(quizService.getQuizResults(quizId));
    }

    /** 내 퀴즈 제출 결과 조회 (학생 전용) */
    @GetMapping("/{quizId}/my-result")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<QuizResponse.SubmissionResult> getMyResult(@CurrentUserId Long userId,
                                                                  @PathVariable Long quizId) {
        return ApiResponse.ok(quizService.getSubmissionResult(quizId, userId));
    }
}
