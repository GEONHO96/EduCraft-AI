package com.educraftai.global.common;

import com.educraftai.global.exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 공통 API 응답 래퍼.
 * <p>모든 API는 {@code {success, data, error}} 형태로 통일된 응답을 반환한다.
 * HTTP 상태코드는 일괄 200으로 두고, 의미는 {@code success} 플래그와 {@link ErrorResponse}로 구분한다.
 */
@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private ErrorResponse error;

    /** 성공 응답 (데이터 포함) */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    /** 성공 응답 (데이터 없음) */
    public static <T> ApiResponse<T> ok() {
        return new ApiResponse<>(true, null, null);
    }

    /** 실패 응답 (에러 코드 + 메시지 직접 지정) */
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorResponse(code, message));
    }

    /**
     * 실패 응답 (ErrorCode 기반 — 권장).
     * <p>호출부에서 code/message 분해를 반복하지 않도록 제공하는 오버로드.
     */
    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(false, null, new ErrorResponse(errorCode.getCode(), errorCode.getMessage()));
    }

    /**
     * 실패 응답 (ErrorCode + 메시지 오버라이드).
     * <p>ErrorCode의 기본 메시지 대신 맥락에 맞는 메시지를 쓰고 싶을 때 사용.
     */
    public static <T> ApiResponse<T> error(ErrorCode errorCode, String overrideMessage) {
        return new ApiResponse<>(false, null, new ErrorResponse(errorCode.getCode(), overrideMessage));
    }

    @Getter
    @AllArgsConstructor
    public static class ErrorResponse {
        private String code;
        private String message;
    }
}
