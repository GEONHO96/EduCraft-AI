package com.educraftai.domain.ai.controller;

import com.educraftai.domain.ai.dto.AiRequest;
import com.educraftai.domain.ai.dto.AiResponse;
import com.educraftai.domain.ai.service.AiGenerationService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiGenerationService aiGenerationService;

    @PostMapping("/curriculum/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<AiResponse.CurriculumResult> generateCurriculum(
            @Valid @RequestBody AiRequest.GenerateCurriculum request) {
        return ApiResponse.ok(aiGenerationService.generateCurriculum(AuthUtil.getCurrentUserId(), request));
    }

    @PostMapping("/material/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<AiResponse.MaterialResult> generateMaterial(
            @Valid @RequestBody AiRequest.GenerateMaterial request) {
        return ApiResponse.ok(aiGenerationService.generateMaterial(AuthUtil.getCurrentUserId(), request));
    }

    @PostMapping("/quiz/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<AiResponse.QuizResult> generateQuiz(
            @Valid @RequestBody AiRequest.GenerateQuiz request) {
        return ApiResponse.ok(aiGenerationService.generateQuiz(AuthUtil.getCurrentUserId(), request));
    }

    /** 학년별 AI 퀴즈 생성 (학생용 - 로그인한 사용자 누구나 가능) */
    @PostMapping("/quiz/grade-quiz")
    public ApiResponse<AiResponse.GradeQuizResult> generateGradeQuiz(
            @Valid @RequestBody AiRequest.GenerateGradeQuiz request) {
        return ApiResponse.ok(aiGenerationService.generateGradeQuiz(AuthUtil.getCurrentUserId(), request));
    }

    @PostMapping("/supplement/generate")
    public ApiResponse<AiResponse.SupplementResult> generateSupplement(
            @Valid @RequestBody AiRequest.GenerateSupplement request) {
        return ApiResponse.ok(aiGenerationService.generateSupplement(AuthUtil.getCurrentUserId(), request));
    }
}
