package com.educraftai.global.constant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * {@link AuthConstants} 검증.
 * <p>상수 값은 {@link com.educraftai.global.security.JwtAuthenticationFilter}와
 * Spring Security 내부 규약에 의존하므로, 의도치 않은 변경을 방지하는 회귀 방어선 역할.
 */
@DisplayName("AuthConstants 상수 검증")
class AuthConstantsTest {

    @Test
    @DisplayName("Authorization 헤더 이름은 표준 HTTP 헤더 이름이다")
    void authorizationHeader() {
        assertThat(AuthConstants.AUTHORIZATION_HEADER).isEqualTo("Authorization");
    }

    @Test
    @DisplayName("Bearer 접두어는 공백 포함 7자이며 BEARER_PREFIX_LENGTH와 일치한다")
    void bearerPrefix() {
        assertThat(AuthConstants.BEARER_PREFIX).isEqualTo("Bearer ");
        assertThat(AuthConstants.BEARER_PREFIX_LENGTH).isEqualTo(7);
        assertThat(AuthConstants.BEARER_PREFIX_LENGTH).isEqualTo(AuthConstants.BEARER_PREFIX.length());
    }

    @Test
    @DisplayName("Spring Security 역할 접두어는 ROLE_이다")
    void rolePrefix() {
        assertThat(AuthConstants.ROLE_PREFIX).isEqualTo("ROLE_");
    }
}
