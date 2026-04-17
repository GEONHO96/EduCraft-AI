package com.educraftai.global.security;

import com.educraftai.global.constant.AuthConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT 인증 필터.
 *
 * <p>매 요청마다 Authorization 헤더에서 Bearer 토큰을 추출·검증하여
 * {@link SecurityContextHolder}에 인증 정보를 설정한다.
 * 상수({@link AuthConstants})를 통해 헤더명·접두어·역할 prefix를 참조하여 하드코딩을 제거.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            Long userId = jwtTokenProvider.getUserId(token);
            String role = jwtTokenProvider.getRole(token);

            var authorities = List.of(new SimpleGrantedAuthority(AuthConstants.ROLE_PREFIX + role));
            var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("[JWT] 인증 성공 userId={} role={} uri={}", userId, role, request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }

    /** Authorization 헤더에서 "Bearer " 접두어를 제거하고 토큰 문자열 반환 */
    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader(AuthConstants.AUTHORIZATION_HEADER);
        if (StringUtils.hasText(header) && header.startsWith(AuthConstants.BEARER_PREFIX)) {
            return header.substring(AuthConstants.BEARER_PREFIX_LENGTH);
        }
        return null;
    }
}
