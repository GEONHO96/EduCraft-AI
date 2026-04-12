package com.educraftai.global.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtTokenProvider 단위 테스트")
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private static final String SECRET = "educraftai-test-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256-testing";
    private static final long EXPIRATION = 86400000L;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(SECRET, EXPIRATION);
    }

    @Test
    @DisplayName("토큰 생성 시 유효한 JWT를 반환한다")
    void createToken_returnsValidToken() {
        String token = jwtTokenProvider.createToken(1L, "test@edu.com", "STUDENT");

        assertThat(token).isNotNull();
        assertThat(token.split("\\.")).hasSize(3); // header.payload.signature
    }

    @Test
    @DisplayName("토큰에서 사용자 ID를 정확히 추출한다")
    void getUserId_returnsCorrectId() {
        String token = jwtTokenProvider.createToken(42L, "test@edu.com", "TEACHER");

        Long userId = jwtTokenProvider.getUserId(token);

        assertThat(userId).isEqualTo(42L);
    }

    @Test
    @DisplayName("토큰에서 역할을 정확히 추출한다")
    void getRole_returnsCorrectRole() {
        String token = jwtTokenProvider.createToken(1L, "test@edu.com", "TEACHER");

        String role = jwtTokenProvider.getRole(token);

        assertThat(role).isEqualTo("TEACHER");
    }

    @Test
    @DisplayName("유효한 토큰 검증 시 true를 반환한다")
    void validateToken_validToken_returnsTrue() {
        String token = jwtTokenProvider.createToken(1L, "test@edu.com", "STUDENT");

        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("잘못된 토큰 검증 시 false를 반환한다")
    void validateToken_invalidToken_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken("invalid.token.here")).isFalse();
    }

    @Test
    @DisplayName("만료된 토큰 검증 시 false를 반환한다")
    void validateToken_expiredToken_returnsFalse() throws InterruptedException {
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(SECRET, 1L); // 1ms
        String token = shortLivedProvider.createToken(1L, "test@edu.com", "STUDENT");

        Thread.sleep(50);

        assertThat(shortLivedProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("다른 시크릿으로 서명된 토큰은 검증 실패한다")
    void validateToken_differentSecret_returnsFalse() {
        JwtTokenProvider otherProvider = new JwtTokenProvider(
                "another-secret-key-that-is-at-least-256-bits-long-for-hs256-algorithm-test", EXPIRATION);
        String token = otherProvider.createToken(1L, "test@edu.com", "STUDENT");

        assertThat(jwtTokenProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("STUDENT 역할로 토큰을 생성하고 검증한다")
    void createAndValidate_studentRole() {
        String token = jwtTokenProvider.createToken(10L, "student@edu.com", "STUDENT");

        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        assertThat(jwtTokenProvider.getUserId(token)).isEqualTo(10L);
        assertThat(jwtTokenProvider.getRole(token)).isEqualTo("STUDENT");
    }
}
