package com.educraftai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication(excludeName = {
        "org.springframework.ai.model.anthropic.autoconfigure.AnthropicChatAutoConfiguration"
})
public class EduCraftAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduCraftAiApplication.class, args);
    }
}
