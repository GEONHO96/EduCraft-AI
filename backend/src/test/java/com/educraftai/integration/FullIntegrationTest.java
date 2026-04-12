package com.educraftai.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
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
@DisplayName("인수 테스트 (Full Integration)")
class FullIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private String register(String email, String name, String role, String grade) throws Exception {
        String body = """
                {"email":"%s","password":"password123","name":"%s","role":"%s","grade":"%s"}
                """.formatted(email, name, role, grade != null ? grade : "");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("학생 회원가입 → 로그인 → 대시보드 조회 전체 플로우")
    void fullUserJourney_registerLoginAndAccessDashboard() throws Exception {
        // 1. 회원가입
        String token = register("journey@edu.com", "여행자", "STUDENT", "MIDDLE_1");

        // 2. 로그인
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"journey@edu.com","password":"password123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty());

        // 3. 학생 대시보드 조회
        mockMvc.perform(get("/api/dashboard/student")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.enrolledCourses").value(0))
                .andExpect(jsonPath("$.data.completedQuizzes").value(0));
    }

    @Test
    @DisplayName("교강사 강의 생성 → 목록 확인 전체 플로우")
    void teacherCreatesAndManagesCourse() throws Exception {
        // 1. 교강사 가입
        String token = register("teacher-int@edu.com", "김교수", "TEACHER", null);

        // 2. 강의 생성
        mockMvc.perform(post("/api/courses")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"통합 테스트 강의","subject":"테스트","description":"통합 테스트용 강의"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("통합 테스트 강의"));

        // 3. 내 강의 목록 확인
        mockMvc.perform(get("/api/courses")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    @DisplayName("교강사 강의 생성 → 학생 수강 신청 전체 플로우")
    void studentEnrollsInCourse() throws Exception {
        // 1. 교강사 가입 + 강의 생성
        String teacherToken = register("teacher-enroll@edu.com", "이교수", "TEACHER", null);

        MvcResult courseResult = mockMvc.perform(post("/api/courses")
                        .header("Authorization", "Bearer " + teacherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"수강신청 테스트","subject":"수학","description":"수강신청 테스트용"}
                                """))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode courseJson = objectMapper.readTree(courseResult.getResponse().getContentAsString());
        long courseId = courseJson.get("data").get("id").asLong();

        // 2. 학생 가입
        String studentToken = register("student-enroll@edu.com", "박학생", "STUDENT", "HIGH_1");

        // 3. 수강 신청
        mockMvc.perform(post("/api/courses/" + courseId + "/enroll")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 4. 내 수강 목록 확인
        mockMvc.perform(get("/api/courses")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].title").value("수강신청 테스트"));
    }

    @Test
    @DisplayName("구독 플로우: 가입 → PRO 구독 → 조회 → 취소")
    void subscriptionFlow() throws Exception {
        // 1. 가입
        String token = register("sub@edu.com", "구독자", "STUDENT", "MIDDLE_2");

        // 2. 구독 전 상태 확인 (COMMUNITY)
        mockMvc.perform(get("/api/subscription/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.plan").value("COMMUNITY"));

        // 3. PRO 구독
        mockMvc.perform(post("/api/subscription/subscribe")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"plan":"PRO","paymentMethod":"CREDIT_CARD"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.plan").value("PRO"))
                .andExpect(jsonPath("$.data.amount").value(9900));

        // 4. 구독 상태 확인
        mockMvc.perform(get("/api/subscription/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.plan").value("PRO"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        // 5. 구독 취소
        mockMvc.perform(post("/api/subscription/cancel")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));

        // 6. 결제 내역 확인
        mockMvc.perform(get("/api/subscription/payments")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    @DisplayName("SNS 플로우: 게시글 작성 → 좋아요 → 댓글 → 팔로우 → 프로필")
    void snsFlow() throws Exception {
        // 1. 유저 2명 가입
        String token1 = register("sns1@edu.com", "유저1", "STUDENT", "MIDDLE_1");
        String token2 = register("sns2@edu.com", "유저2", "STUDENT", "HIGH_1");

        // 2. 유저1이 게시글 작성
        MvcResult postResult = mockMvc.perform(post("/api/sns/posts")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"통합 테스트 게시글입니다!","category":"FREE"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode postJson = objectMapper.readTree(postResult.getResponse().getContentAsString());
        long postId = postJson.get("data").get("id").asLong();

        // 3. 유저2가 좋아요
        mockMvc.perform(post("/api/sns/posts/" + postId + "/like")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.liked").value(true))
                .andExpect(jsonPath("$.data.likeCount").value(1));

        // 4. 유저2가 댓글 작성
        mockMvc.perform(post("/api/sns/posts/" + postId + "/comments")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"좋은 글이네요!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 5. 유저1의 ID를 가져오기
        MvcResult meResult = mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token1))
                .andReturn();
        long user1Id = objectMapper.readTree(meResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // 6. 유저2가 유저1을 팔로우
        mockMvc.perform(post("/api/sns/users/" + user1Id + "/follow")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.following").value(true));

        // 7. 유저1 프로필 확인
        mockMvc.perform(get("/api/sns/users/" + user1Id + "/profile")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("유저1"))
                .andExpect(jsonPath("$.data.postCount").value(1))
                .andExpect(jsonPath("$.data.followerCount").value(1))
                .andExpect(jsonPath("$.data.following").value(true));
    }

    @Test
    @DisplayName("전체 강의 탐색 및 검색 테스트")
    void browseCourses() throws Exception {
        String teacherToken = register("browse-t@edu.com", "탐색교수", "TEACHER", null);
        String studentToken = register("browse-s@edu.com", "탐색학생", "STUDENT", "MIDDLE_1");

        // 강의 2개 생성
        mockMvc.perform(post("/api/courses")
                .header("Authorization", "Bearer " + teacherToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"title":"자바 프로그래밍","subject":"컴퓨터","description":"자바 기초"}
                        """));

        mockMvc.perform(post("/api/courses")
                .header("Authorization", "Bearer " + teacherToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"title":"파이썬 기초","subject":"컴퓨터","description":"파이썬 입문"}
                        """));

        // 전체 탐색
        mockMvc.perform(get("/api/courses/browse")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));

        // 검색
        mockMvc.perform(get("/api/courses/browse")
                        .header("Authorization", "Bearer " + studentToken)
                        .param("keyword", "자바"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1));
    }
}
