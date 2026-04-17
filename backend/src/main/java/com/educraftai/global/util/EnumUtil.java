package com.educraftai.global.util;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;

/**
 * enum 관련 공통 유틸.
 *
 * <p>{@code Enum.valueOf(...)}는 일치하는 상수가 없으면 {@link IllegalArgumentException}을 던져
 * {@link com.educraftai.global.exception.GlobalExceptionHandler}의 폴백 경로로 빠지면서
 * 클라이언트에 투박한 500 메시지를 보내게 된다. 이 유틸은 그런 상황에서 의미 있는
 * {@link ErrorCode}를 담은 {@link BusinessException}으로 변환해 준다.
 *
 * <p>사용 예:
 * <pre>{@code
 * Plan plan = EnumUtil.safeValueOf(Plan.class, request.getPlan(), ErrorCode.INVALID_PLAN);
 * }</pre>
 */
public final class EnumUtil {

    private EnumUtil() {
    }

    /**
     * {@code value}를 enum 상수로 변환한다. 대소문자 일치 필요.
     * {@code null}/빈 문자열/일치하는 상수 없음 → {@link BusinessException}({@code errorCode}).
     */
    public static <E extends Enum<E>> E safeValueOf(Class<E> enumClass, String value, ErrorCode errorCode) {
        if (value == null || value.isBlank()) {
            throw new BusinessException(errorCode);
        }
        try {
            return Enum.valueOf(enumClass, value);
        } catch (IllegalArgumentException e) {
            throw new BusinessException(errorCode);
        }
    }

    /**
     * {@code value}를 대문자로 정규화한 뒤 enum 상수로 변환한다.
     * 클라이언트가 소문자를 보내도 수용하고 싶을 때 사용.
     */
    public static <E extends Enum<E>> E safeValueOfUpperCase(Class<E> enumClass, String value, ErrorCode errorCode) {
        if (value == null || value.isBlank()) {
            throw new BusinessException(errorCode);
        }
        try {
            return Enum.valueOf(enumClass, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(errorCode);
        }
    }
}
