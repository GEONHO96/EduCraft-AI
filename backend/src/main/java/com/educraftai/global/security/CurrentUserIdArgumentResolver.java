package com.educraftai.global.security;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * {@link CurrentUserId @CurrentUserId}가 붙은 컨트롤러 파라미터에 현재 사용자 ID를 주입.
 *
 * <p>Spring MVC의 {@link HandlerMethodArgumentResolver}를 구현하여
 * 컨트롤러 메서드 호출 직전에 파라미터 값을 결정한다.
 * 주입 실패(미인증)는 {@link AuthUtil#getCurrentUserId()}가 던지는 예외에 위임한다.
 *
 * <p>등록 위치: {@code global/config/WebConfig.java}의 {@code addArgumentResolvers}.
 */
@Component
public class CurrentUserIdArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUserId.class)
                && Long.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        return AuthUtil.getCurrentUserId();
    }
}
