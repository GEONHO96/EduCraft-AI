package com.educraftai.domain.ai.controller;

import com.educraftai.domain.ai.dto.AiRequest;
import com.educraftai.domain.ai.dto.AiResponse;
import com.educraftai.domain.ai.service.AiGenerationService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AI 생성 API 컨트롤러.
 * <p>커리큘럼·수업자료·퀴즈·학년별 퀴즈·보충학습 생성과 학년별 퀴즈 결과 제출을 제공한다.
 * <p>선생님 전용 엔드포인트와 학생/로그인 사용자 누구나 호출 가능한 엔드포인트를 구분한다.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiGenerationService aiGenerationService;

    /** 커리큘럼 AI 생성 (선생님 전용) */
    @PostMapping("/curriculum/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<AiResponse.CurriculumResult> generateCurriculum(@CurrentUserId Long userId,
                                                                       @Valid @RequestBody AiRequest.GenerateCurriculum request) {
        return ApiResponse.ok(aiGenerationService.generateCurriculum(userId, request));
    }

    /** 수업 자료 AI 생성 (선생님 전용) */
    @PostMapping("/material/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<AiResponse.MaterialResult> generateMaterial(@CurrentUserId Long userId,
                                                                   @Valid @RequestBody AiRequest.GenerateMaterial request) {
        return ApiResponse.ok(aiGenerationService.generateMaterial(userId, request));
    }

    /** 강의 퀴즈 AI 생성 (선생님 전용) */
    @PostMapping("/quiz/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<AiResponse.QuizResult> generateQuiz(@CurrentUserId Long userId,
                                                           @Valid @RequestBody AiRequest.GenerateQuiz request) {
        return ApiResponse.ok(aiGenerationService.generateQuiz(userId, request));
    }

    /** 학년별 AI 퀴즈 생성 (학생/로그인 사용자 누구나) */
    @PostMapping("/quiz/grade-quiz")
    public ApiResponse<AiResponse.GradeQuizResult> generateGradeQuiz(@CurrentUserId Long userId,
                                                                     @Valid @RequestBody AiRequest.GenerateGradeQuiz request) {
        return ApiResponse.ok(aiGenerationService.generateGradeQuiz(userId, request));
    }

    /** 학년별 AI 퀴즈 결과 제출 (학생/로그인 사용자 누구나) */
    @PostMapping("/quiz/grade-quiz/submit")
    public ApiResponse<AiResponse.GradeQuizSubmissionResult> submitGradeQuiz(@CurrentUserId Long userId,
                                                                             @Valid @RequestBody AiRequest.SubmitGradeQuiz request) {
        return ApiResponse.ok(aiGenerationService.submitGradeQuiz(userId, request));
    }

    /** 보충학습 AI 생성 (모든 로그인 사용자) */
    @PostMapping("/supplement/generate")
    public ApiResponse<AiResponse.SupplementResult> generateSupplement(@CurrentUserId Long userId,
                                                                       @Valid @RequestBody AiRequest.GenerateSupplement request) {
        return ApiResponse.ok(aiGenerationService.generateSupplement(userId, request));
    }
}
