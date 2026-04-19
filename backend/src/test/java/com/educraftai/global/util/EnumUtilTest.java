package com.educraftai.global.util;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

/**
 * {@link EnumUtil} 단위 테스트.
 * <p>핵심 관심사: 잘못된 입력에 대해 {@link IllegalArgumentException} 누수 없이
 * 의미 있는 {@link BusinessException}으로 변환되는지 검증.
 */
@DisplayName("EnumUtil 단위 테스트")
class EnumUtilTest {

    enum Color { RED, GREEN, BLUE }

    @Nested
    @DisplayName("safeValueOf")
    class SafeValueOf {

        @Test
        @DisplayName("유효한 문자열은 enum 상수로 변환된다")
        void valid() {
            Color result = EnumUtil.safeValueOf(Color.class, "RED", ErrorCode.INVALID_ENUM_VALUE);
            assertThat(result).isEqualTo(Color.RED);
        }

        @Test
        @DisplayName("존재하지 않는 값은 지정한 ErrorCode 예외를 던진다")
        void invalidValue() {
            assertThatThrownBy(() ->
                    EnumUtil.safeValueOf(Color.class, "PURPLE", ErrorCode.INVALID_ENUM_VALUE))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.INVALID_ENUM_VALUE);
        }

        @Test
        @DisplayName("null 입력은 예외를 던진다")
        void nullValue() {
            assertThatThrownBy(() ->
                    EnumUtil.safeValueOf(Color.class, null, ErrorCode.INVALID_PLAN))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.INVALID_PLAN);
        }

        @Test
        @DisplayName("빈 문자열은 예외를 던진다")
        void blankValue() {
            assertThatThrownBy(() ->
                    EnumUtil.safeValueOf(Color.class, "   ", ErrorCode.INVALID_PLAN))
                    .isInstanceOf(BusinessException.class);
        }

        @Test
        @DisplayName("대소문자가 다르면 매칭 실패 (케이스 민감)")
        void caseSensitive() {
            assertThatThrownBy(() ->
                    EnumUtil.safeValueOf(Color.class, "red", ErrorCode.INVALID_ENUM_VALUE))
                    .isInstanceOf(BusinessException.class);
        }
    }

    @Nested
    @DisplayName("safeValueOfUpperCase")
    class SafeValueOfUpperCase {

        @Test
        @DisplayName("소문자 입력도 대문자로 정규화되어 매칭된다")
        void lowerCaseAccepted() {
            Color result = EnumUtil.safeValueOfUpperCase(Color.class, "green", ErrorCode.INVALID_ENUM_VALUE);
            assertThat(result).isEqualTo(Color.GREEN);
        }

        @Test
        @DisplayName("대소문자 혼합도 대문자로 정규화된다")
        void mixedCaseAccepted() {
            Color result = EnumUtil.safeValueOfUpperCase(Color.class, "BlUe", ErrorCode.INVALID_ENUM_VALUE);
            assertThat(result).isEqualTo(Color.BLUE);
        }

        @Test
        @DisplayName("null은 여전히 예외를 던진다")
        void nullStillThrows() {
            assertThatThrownBy(() ->
                    EnumUtil.safeValueOfUpperCase(Color.class, null, ErrorCode.INVALID_ENUM_VALUE))
                    .isInstanceOf(BusinessException.class);
        }
    }
}
