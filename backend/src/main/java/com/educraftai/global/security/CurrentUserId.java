package com.educraftai.global.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 현재 로그인한 사용자의 ID를 컨트롤러 파라미터에 주입하는 커스텀 어노테이션.
 *
 * <p>각 엔드포인트에서 {@code AuthUtil.getCurrentUserId()}를 반복 호출하던 관행을 대체한다.
 *
 * <p>사용 예:
 * <pre>{@code
 * @GetMapping("/me")
 * public ApiResponse<UserResponse> getMyInfo(@CurrentUserId Long userId) {
 *     return ApiResponse.ok(userService.getMyInfo(userId));
 * }
 * }</pre>
 *
 * <p>실제 주입은 {@link CurrentUserIdArgumentResolver}에서 수행한다.
 * 인증되지 않은 요청이 들어오면 {@link com.educraftai.global.exception.BusinessException}
 * ({@link com.educraftai.global.exception.ErrorCode#UNAUTHORIZED})을 던진다.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUserId {
}
