package com.educraftai.global.exception;

import com.educraftai.global.common.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 처리 핸들러.
 * <p>비즈니스 예외, 유효성 검증 실패, 인증/인가 실패, 역직렬화 실패, 예상치 못한 에러를
 * 모두 통일된 {@link ApiResponse} 포맷으로 변환한다. HTTP 상태코드는 일괄 200.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 비즈니스 로직 예외 (ErrorCode 기반 표준 경로) */
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<?> handleBusinessException(BusinessException e) {
        log.warn("[Business] {} - {}", e.getErrorCode().getCode(), e.getMessage());
        return ApiResponse.error(e.getErrorCode(), e.getMessage());
    }

    /** {@code @Valid} 유효성 검증 실패 — 첫 번째 필드 에러 메시지를 반환한다. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<?> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .orElse("입력 값이 유효하지 않습니다.");
        return ApiResponse.error(ErrorCode.INVALID_INPUT, message);
    }

    /** {@code @RequestParam}/{@code @PathVariable} 제약조건 위반 */
    @ExceptionHandler(ConstraintViolationException.class)
    public ApiResponse<?> handleConstraintViolation(ConstraintViolationException e) {
        return ApiResponse.error(ErrorCode.INVALID_INPUT, e.getMessage());
    }

    /** JSON 역직렬화 실패, 잘못된 enum 값 등 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ApiResponse<?> handleMessageNotReadable(HttpMessageNotReadableException e) {
        log.warn("[Parse] 요청 본문 파싱 실패: {}", e.getMessage());
        return ApiResponse.error(ErrorCode.INVALID_INPUT, "요청 형식이 올바르지 않습니다.");
    }

    /** 인증되지 않은 요청 (Spring Security) */
    @ExceptionHandler(AuthenticationException.class)
    public ApiResponse<?> handleAuthentication(AuthenticationException e) {
        log.warn("[Auth] 인증 실패: {}", e.getMessage());
        return ApiResponse.error(ErrorCode.UNAUTHORIZED);
    }

    /** 권한 부족 (@PreAuthorize 거부 등) */
    @ExceptionHandler(AccessDeniedException.class)
    public ApiResponse<?> handleAccessDenied(AccessDeniedException e) {
        log.warn("[Auth] 권한 거부: {}", e.getMessage());
        return ApiResponse.error(ErrorCode.FORBIDDEN);
    }

    /** 예상치 못한 예외 폴백 */
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleException(Exception e) {
        log.error("[Unhandled] 예상치 못한 예외", e);
        return ApiResponse.error(ErrorCode.INTERNAL_ERROR);
    }
}
