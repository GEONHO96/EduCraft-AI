package com.educraftai.domain.quiz.controller;

import com.educraftai.domain.quiz.dto.QuizRequest;
import com.educraftai.domain.quiz.dto.QuizResponse;
import com.educraftai.domain.quiz.service.QuizService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/{quizId}")
    public ApiResponse<QuizResponse.Info> getQuiz(@PathVariable Long quizId) {
        return ApiResponse.ok(quizService.getQuiz(quizId));
    }

    @PostMapping("/{quizId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<QuizResponse.SubmissionResult> submitQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizRequest.Submit request) {
        return ApiResponse.ok(quizService.submitQuiz(quizId, AuthUtil.getCurrentUserId(), request));
    }

    @GetMapping("/{quizId}/results")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<List<QuizResponse.SubmissionResult>> getQuizResults(@PathVariable Long quizId) {
        return ApiResponse.ok(quizService.getQuizResults(quizId));
    }

    @GetMapping("/{quizId}/my-result")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<QuizResponse.SubmissionResult> getMyResult(@PathVariable Long quizId) {
        return ApiResponse.ok(quizService.getSubmissionResult(quizId, AuthUtil.getCurrentUserId()));
    }
}
