package com.educraftai.domain.user.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("AuthController 통합 테스트")
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private String registerAndGetToken(String email, String name, String role, String grade) throws Exception {
        String body = """
                {"email":"%s","password":"password123","name":"%s","role":"%s","grade":"%s"}
                """.formatted(email, name, role, grade);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("data").get("accessToken").asText();
    }

    @Nested
    @DisplayName("회원가입 API")
    class RegisterApi {

        @Test
        @DisplayName("정상 회원가입 시 토큰과 사용자 정보를 반환한다")
        void register_success() throws Exception {
            String body = """
                    {"email":"new@edu.com","password":"password123","name":"김학생","role":"STUDENT","grade":"MIDDLE_1"}
                    """;

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                    .andExpect(jsonPath("$.data.user.email").value("new@edu.com"))
                    .andExpect(jsonPath("$.data.user.name").value("김학생"))
                    .andExpect(jsonPath("$.data.user.role").value("STUDENT"));
        }

        @Test
        @DisplayName("중복 이메일로 가입 시 에러를 반환한다")
        void register_duplicateEmail() throws Exception {
            String body = """
                    {"email":"dup@edu.com","password":"password123","name":"테스트","role":"STUDENT","grade":"MIDDLE_1"}
                    """;

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON).content(body));

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.error.code").value("AUTH_001"));
        }
    }

    @Nested
    @DisplayName("로그인 API")
    class LoginApi {

        @Test
        @DisplayName("올바른 자격 증명으로 로그인 시 토큰을 반환한다")
        void login_success() throws Exception {
            String regBody = """
                    {"email":"login@edu.com","password":"password123","name":"로그인","role":"STUDENT","grade":"MIDDLE_1"}
                    """;
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON).content(regBody));

            String loginBody = """
                    {"email":"login@edu.com","password":"password123"}
                    """;
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON).content(loginBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").isNotEmpty());
        }

        @Test
        @DisplayName("잘못된 비밀번호로 로그인 시 에러를 반환한다")
        void login_invalidCredentials() throws Exception {
            String regBody = """
                    {"email":"login2@edu.com","password":"password123","name":"로그인","role":"STUDENT","grade":"MIDDLE_1"}
                    """;
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON).content(regBody));

            String loginBody = """
                    {"email":"login2@edu.com","password":"wrongpassword"}
                    """;
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON).content(loginBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.error.code").value("AUTH_002"));
        }
    }

    @Nested
    @DisplayName("내 정보 조회 API")
    class GetMeApi {

        @Test
        @DisplayName("인증된 사용자가 내 정보를 조회한다")
        void getMe_authenticated() throws Exception {
            String token = registerAndGetToken("me@edu.com", "나", "STUDENT", "HIGH_1");

            mockMvc.perform(get("/api/auth/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.email").value("me@edu.com"))
                    .andExpect(jsonPath("$.data.name").value("나"));
        }

        @Test
        @DisplayName("인증 없이 내 정보 조회 시 에러를 반환한다")
        void getMe_unauthenticated() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("이메일 찾기 API")
    class FindEmailApi {

        @Test
        @DisplayName("이름으로 마스킹된 이메일을 반환한다")
        void findEmail_success() throws Exception {
            registerAndGetToken("find@edu.com", "찾기테스트", "STUDENT", "MIDDLE_1");

            String body = """
                    {"name":"찾기테스트"}
                    """;
            mockMvc.perform(post("/api/auth/find-email")
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data[0]").isString());
        }
    }

    @Nested
    @DisplayName("비밀번호 재설정 API")
    class ResetPasswordApi {

        @Test
        @DisplayName("임시 비밀번호 발급 요청 시 메시지를 반환한다")
        void resetPassword_success() throws Exception {
            registerAndGetToken("reset@edu.com", "리셋", "STUDENT", "MIDDLE_1");

            String body = """
                    {"email":"reset@edu.com","name":"리셋"}
                    """;
            mockMvc.perform(post("/api/auth/reset-password")
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.message").isNotEmpty());
        }
    }

    @Test
    @DisplayName("이메일 중복 확인 API")
    void checkEmail() throws Exception {
        registerAndGetToken("check@edu.com", "체크", "STUDENT", "MIDDLE_1");

        mockMvc.perform(get("/api/auth/check-email")
                        .param("email", "check@edu.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.exists").value(true));

        mockMvc.perform(get("/api/auth/check-email")
                        .param("email", "notexist@edu.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.exists").value(false));
    }
}
