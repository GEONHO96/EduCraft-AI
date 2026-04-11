package com.educraftai.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

/**
 * UTF-8 요청 인코딩 강제 변환 필터
 * Windows 환경에서 시스템 기본 인코딩(EUC-KR/CP949)으로 전달되는
 * 요청 본문을 UTF-8로 변환하여 Jackson 파싱 오류를 방지한다.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class Utf8RequestFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String contentType = request.getContentType();

        // JSON 요청만 처리
        if (contentType != null && contentType.contains("application/json")) {
            byte[] rawBody = request.getInputStream().readAllBytes();

            // UTF-8로 유효한지 검사 → 아니면 시스템 기본 인코딩으로 디코딩 후 UTF-8로 재인코딩
            byte[] utf8Body;
            if (isValidUtf8(rawBody)) {
                utf8Body = rawBody;
            } else {
                String decoded = new String(rawBody, Charset.defaultCharset());
                utf8Body = decoded.getBytes(StandardCharsets.UTF_8);
            }

            HttpServletRequest wrappedRequest = new Utf8RequestWrapper(request, utf8Body);
            filterChain.doFilter(wrappedRequest, response);
        } else {
            filterChain.doFilter(request, response);
        }
    }

    /** UTF-8 바이트 시퀀스 유효성 검사 */
    private boolean isValidUtf8(byte[] bytes) {
        int i = 0;
        while (i < bytes.length) {
            int b = bytes[i] & 0xFF;
            int numBytes;

            if (b <= 0x7F) {
                numBytes = 1;
            } else if (b >= 0xC2 && b <= 0xDF) {
                numBytes = 2;
            } else if (b >= 0xE0 && b <= 0xEF) {
                numBytes = 3;
            } else if (b >= 0xF0 && b <= 0xF4) {
                numBytes = 4;
            } else {
                return false;
            }

            if (i + numBytes > bytes.length) return false;

            for (int j = 1; j < numBytes; j++) {
                if ((bytes[i + j] & 0xC0) != 0x80) return false;
            }
            i += numBytes;
        }
        return true;
    }

    /** 요청 본문을 교체한 HttpServletRequest 래퍼 */
    private static class Utf8RequestWrapper extends HttpServletRequestWrapper {
        private final byte[] body;

        public Utf8RequestWrapper(HttpServletRequest request, byte[] body) {
            super(request);
            this.body = body;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream byteStream = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override public int read() { return byteStream.read(); }
                @Override public boolean isFinished() { return byteStream.available() == 0; }
                @Override public boolean isReady() { return true; }
                @Override public void setReadListener(ReadListener listener) { }
            };
        }

        @Override
        public int getContentLength() {
            return body.length;
        }

        @Override
        public long getContentLengthLong() {
            return body.length;
        }

        @Override
        public String getCharacterEncoding() {
            return StandardCharsets.UTF_8.name();
        }
    }
}
