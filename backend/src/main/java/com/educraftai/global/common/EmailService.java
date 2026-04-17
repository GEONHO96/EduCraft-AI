package com.educraftai.global.common;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 이메일 발송 서비스.
 * <p>임시 비밀번호 안내 등 사용자 알림 이메일을 발송한다.
 * SMTP 설정은 {@code application.yml}의 {@code spring.mail.*}에 의존.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /** 비밀번호 변경 유도 링크의 베이스 URL (로컬 기본값: http://localhost:5173) */
    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * 임시 비밀번호 이메일 발송 (비동기).
     *
     * @param to 수신자 이메일
     * @param name 수신자 이름
     * @param tempPassword 발급된 임시 비밀번호
     */
    @Async
    public void sendTempPasswordEmail(String to, String name, String tempPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[EduCraft AI] 임시 비밀번호 안내");
            helper.setText(buildTempPasswordHtml(name, tempPassword), true);

            mailSender.send(message);
            log.info("[Email] 임시 비밀번호 이메일 발송 성공");
        } catch (Exception e) {
            log.warn("[Email] 임시 비밀번호 이메일 발송 실패 (화면에서 직접 확인 가능): {}", e.getMessage());
        }
    }

    /** 임시 비밀번호 이메일 HTML 템플릿 */
    private String buildTempPasswordHtml(String name, String tempPassword) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <!-- 헤더 -->
                    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 24px;text-align:center;">
                        <div style="display:inline-block;width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;line-height:48px;margin-bottom:12px;">
                            <span style="color:#fff;font-size:24px;font-weight:bold;">E</span>
                        </div>
                        <h1 style="color:#ffffff;font-size:20px;margin:0;">EduCraft AI</h1>
                        <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">임시 비밀번호 안내</p>
                    </div>

                    <!-- 본문 -->
                    <div style="padding:32px 24px;">
                        <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
                            안녕하세요, <strong>%s</strong>님!<br/>
                            요청하신 임시 비밀번호를 안내해 드립니다.
                        </p>

                        <!-- 임시 비밀번호 박스 -->
                        <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px;">
                            <p style="color:#166534;font-size:12px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">임시 비밀번호</p>
                            <p style="color:#15803d;font-size:28px;font-weight:bold;font-family:'Courier New',monospace;letter-spacing:4px;margin:0;">%s</p>
                        </div>

                        <div style="background:#fefce8;border-left:4px solid #eab308;border-radius:0 8px 8px 0;padding:12px 16px;margin:0 0 20px;">
                            <p style="color:#854d0e;font-size:13px;margin:0;line-height:1.5;">
                                보안을 위해 로그인 후 <strong>즉시 새 비밀번호로 변경</strong>해 주세요.<br/>
                                본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.
                            </p>
                        </div>

                        <!-- 버튼 -->
                        <div style="text-align:center;">
                            <a href="%s/find-account" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">비밀번호 변경하러 가기</a>
                        </div>
                    </div>

                    <!-- 푸터 -->
                    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                        <p style="color:#9ca3af;font-size:11px;margin:0;">
                            이 메일은 EduCraft AI에서 자동 발송되었습니다.<br/>
                            &copy; 2026 EduCraft AI. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(name, tempPassword, frontendUrl);
    }
}
