package com.educraftai.global.config;

import com.educraftai.global.security.CurrentUserIdArgumentResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;
import java.util.List;

/**
 * Web MVC 설정.
 *
 * <p>역할:
 * <ul>
 *   <li>업로드된 파일을 {@code /uploads/**} 경로로 서빙</li>
 *   <li>{@link com.educraftai.global.security.CurrentUserId @CurrentUserId} 파라미터 Resolver 등록</li>
 * </ul>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private final CurrentUserIdArgumentResolver currentUserIdArgumentResolver;

    /** /uploads/** 경로로 업로드된 파일에 접근 가능하도록 설정 */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get(uploadDir).toAbsolutePath().normalize().toString();
        log.info("[WebConfig] 정적 리소스 경로: {}", absolutePath);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath + "/");
    }

    /** 커스텀 인자 Resolver 등록 */
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserIdArgumentResolver);
    }
}
