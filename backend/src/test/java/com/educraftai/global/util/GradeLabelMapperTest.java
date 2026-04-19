package com.educraftai.global.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * {@link GradeLabelMapper} 단위 테스트.
 * <p>이 매퍼는 Dashboard·AI 서비스 양쪽에서 사용되는 단일 진입점이므로,
 * 모든 유효 코드와 경계 케이스를 검증한다.
 */
@DisplayName("GradeLabelMapper 단위 테스트")
class GradeLabelMapperTest {

    @ParameterizedTest(name = "{0} → {1}")
    @CsvSource({
            "ELEMENTARY_1, 초등 1학년",
            "ELEMENTARY_6, 초등 6학년",
            "MIDDLE_1, 중학 1학년",
            "MIDDLE_3, 중학 3학년",
            "HIGH_1, 고등 1학년",
            "HIGH_3, 고등 3학년"
    })
    @DisplayName("유효한 학년 코드는 한글 라벨로 변환된다")
    void validCodes(String code, String expectedLabel) {
        assertThat(GradeLabelMapper.toLabel(code)).isEqualTo(expectedLabel);
    }

    @Test
    @DisplayName("null 입력은 '기타'로 변환된다")
    void nullReturnsEtc() {
        assertThat(GradeLabelMapper.toLabel(null)).isEqualTo("기타");
    }

    @Test
    @DisplayName("빈 문자열은 '기타'로 변환된다")
    void blankReturnsEtc() {
        assertThat(GradeLabelMapper.toLabel("")).isEqualTo("기타");
        assertThat(GradeLabelMapper.toLabel("   ")).isEqualTo("기타");
    }

    @Test
    @DisplayName("매핑되지 않은 코드는 원본 문자열을 반환한다 (폴백)")
    void unknownCodeReturnsOriginal() {
        assertThat(GradeLabelMapper.toLabel("UNIVERSITY_1")).isEqualTo("UNIVERSITY_1");
    }

    @Test
    @DisplayName("대소문자 다르면 매핑 안 된다 — 원본 반환")
    void caseSensitive() {
        assertThat(GradeLabelMapper.toLabel("elementary_1")).isEqualTo("elementary_1");
    }
}
