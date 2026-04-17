package com.educraftai.global.security;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 인증 컨텍스트 접근 유틸.
 *
 * <p>SecurityContext에서 현재 인증된 사용자의 ID를 안전하게 꺼내는 진입점.
 * 컨트롤러에서는 {@link CurrentUserId @CurrentUserId} 파라미터를 우선 사용하고,
 * 서비스 레이어처럼 HandlerMethodArgumentResolver가 동작하지 않는 위치에서만 이 유틸을 직접 호출한다.
 */
public final class AuthUtil {

    private AuthUtil() {
    }

    /**
     * 현재 로그인한 사용자의 ID를 반환한다.
     *
     * @throws BusinessException {@link ErrorCode#UNAUTHORIZED} — 인증되지 않았거나 principal 타입이 비정상일 때
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Long)) {
            // principal이 "anonymousUser" 문자열 등 비정상 타입인 경우 방어
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return (Long) principal;
    }
}
