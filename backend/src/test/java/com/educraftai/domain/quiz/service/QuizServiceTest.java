package com.educraftai.domain.quiz.service;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.domain.material.entity.Material;
import com.educraftai.domain.quiz.dto.QuizRequest;
import com.educraftai.domain.quiz.dto.QuizResponse;
import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.entity.QuizSubmission;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.quiz.repository.QuizSubmissionRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuizService 단위 테스트")
class QuizServiceTest {

    @InjectMocks private QuizService quizService;
    @Mock private QuizRepository quizRepository;
    @Mock private QuizSubmissionRepository submissionRepository;
    @Mock private UserRepository userRepository;
    @Spy  private ObjectMapper objectMapper = new ObjectMapper();

    private User teacher;
    private User student;
    private Course course;
    private Curriculum curriculum;
    private Material material;
    private Quiz quiz;
    private QuizSubmission submission;

    private static final String QUESTIONS_JSON =
            "{\"questions\":[{\"question\":\"1+1은?\",\"answer\":\"2\"},{\"question\":\"2*3은?\",\"answer\":\"6\"}]}";
    private static final String CORRECT_ANSWERS = "[\"2\",\"6\"]";
    private static final String PARTIAL_ANSWERS = "[\"2\",\"5\"]";

    @BeforeEach
    void setUp() throws Exception {
        teacher = User.builder().email("teacher@edu.com").name("김교수").role(User.Role.TEACHER).build();
        setId(teacher, 1L);

        student = User.builder().email("student@edu.com").name("홍학생").role(User.Role.STUDENT).build();
        setId(student, 2L);

        course = Course.builder().teacher(teacher).title("수학 기초").subject("수학").description("기초 수학").build();
        setId(course, 1L);

        curriculum = Curriculum.builder().course(course).weekNumber(1).topic("사칙연산").build();
        setId(curriculum, 1L);

        material = Material.builder().curriculum(curriculum).type(Material.MaterialType.QUIZ)
                .title("1주차 퀴즈").difficulty(1).build();
        setId(material, 1L);

        quiz = Quiz.builder().material(material).questionsJson(QUESTIONS_JSON).timeLimit(30).build();
        setId(quiz, 10L);
        setField(quiz, "createdAt", LocalDateTime.now());

        submission = QuizSubmission.builder().quiz(quiz).student(student)
                .answersJson(CORRECT_ANSWERS).score(2).totalQuestions(2).build();
        setId(submission, 100L);
        setField(submission, "submittedAt", LocalDateTime.now());
    }

    private void setId(Object obj, Long id) throws Exception {
        var field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    private void setField(Object obj, String fieldName, Object value) throws Exception {
        // BaseEntity 같은 부모 클래스에 선언된 필드까지 탐색
        Class<?> clazz = obj.getClass();
        NoSuchFieldException last = null;
        while (clazz != null) {
            try {
                var field = clazz.getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(obj, value);
                return;
            } catch (NoSuchFieldException e) {
                last = e;
                clazz = clazz.getSuperclass();
            }
        }
        throw last != null ? last : new NoSuchFieldException(fieldName);
    }

    @Nested
    @DisplayName("퀴즈 조회")
    class GetQuiz {

        @Test
        @DisplayName("퀴즈 단건 조회 - 존재하면 정보를 반환한다")
        void getQuiz_success() {
            given(quizRepository.findById(10L)).willReturn(Optional.of(quiz));

            QuizResponse.Info result = quizService.getQuiz(10L);

            assertThat(result.getId()).isEqualTo(10L);
            assertThat(result.getMaterialId()).isEqualTo(1L);
            assertThat(result.getQuestionsJson()).isEqualTo(QUESTIONS_JSON);
            assertThat(result.getTimeLimit()).isEqualTo(30);
        }

        @Test
        @DisplayName("퀴즈 단건 조회 - 존재하지 않으면 예외를 던진다")
        void getQuiz_notFound() {
            given(quizRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> quizService.getQuiz(999L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.QUIZ_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("퀴즈 제출")
    class SubmitQuiz {

        @Test
        @DisplayName("정답 모두 맞추면 만점을 반환한다")
        void submitQuiz_allCorrect() {
            QuizRequest.Submit request = new QuizRequest.Submit();
            request.setAnswersJson(CORRECT_ANSWERS);

            given(quizRepository.findById(10L)).willReturn(Optional.of(quiz));
            given(submissionRepository.existsByQuizIdAndStudentId(10L, 2L)).willReturn(false);
            given(userRepository.findById(2L)).willReturn(Optional.of(student));
            given(submissionRepository.save(any(QuizSubmission.class))).willAnswer(inv -> {
                QuizSubmission saved = inv.getArgument(0);
                setId(saved, 100L);
                setField(saved, "submittedAt", LocalDateTime.now());
                return saved;
            });

            QuizResponse.SubmissionResult result = quizService.submitQuiz(10L, 2L, request);

            assertThat(result.getScore()).isEqualTo(2);
            assertThat(result.getTotalQuestions()).isEqualTo(2);
            then(submissionRepository).should().save(any(QuizSubmission.class));
        }

        @Test
        @DisplayName("일부만 맞추면 부분 점수를 반환한다")
        void submitQuiz_partialCorrect() {
            QuizRequest.Submit request = new QuizRequest.Submit();
            request.setAnswersJson(PARTIAL_ANSWERS);

            given(quizRepository.findById(10L)).willReturn(Optional.of(quiz));
            given(submissionRepository.existsByQuizIdAndStudentId(10L, 2L)).willReturn(false);
            given(userRepository.findById(2L)).willReturn(Optional.of(student));
            given(submissionRepository.save(any(QuizSubmission.class))).willAnswer(inv -> {
                QuizSubmission saved = inv.getArgument(0);
                setId(saved, 101L);
                setField(saved, "submittedAt", LocalDateTime.now());
                return saved;
            });

            QuizResponse.SubmissionResult result = quizService.submitQuiz(10L, 2L, request);

            assertThat(result.getScore()).isEqualTo(1);
            assertThat(result.getTotalQuestions()).isEqualTo(2);
        }

        @Test
        @DisplayName("이미 제출한 퀴즈에 재제출 시 예외를 던진다")
        void submitQuiz_alreadySubmitted() {
            QuizRequest.Submit request = new QuizRequest.Submit();
            request.setAnswersJson(CORRECT_ANSWERS);

            given(quizRepository.findById(10L)).willReturn(Optional.of(quiz));
            given(submissionRepository.existsByQuizIdAndStudentId(10L, 2L)).willReturn(true);

            assertThatThrownBy(() -> quizService.submitQuiz(10L, 2L, request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.ALREADY_SUBMITTED);
        }

        @Test
        @DisplayName("존재하지 않는 퀴즈에 제출 시 예외를 던진다")
        void submitQuiz_quizNotFound() {
            QuizRequest.Submit request = new QuizRequest.Submit();
            request.setAnswersJson(CORRECT_ANSWERS);

            given(quizRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> quizService.submitQuiz(999L, 2L, request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.QUIZ_NOT_FOUND);
        }

        @Test
        @DisplayName("존재하지 않는 학생으로 제출 시 예외를 던진다")
        void submitQuiz_studentNotFound() {
            QuizRequest.Submit request = new QuizRequest.Submit();
            request.setAnswersJson(CORRECT_ANSWERS);

            given(quizRepository.findById(10L)).willReturn(Optional.of(quiz));
            given(submissionRepository.existsByQuizIdAndStudentId(10L, 999L)).willReturn(false);
            given(userRepository.findById(999L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> quizService.submitQuiz(10L, 999L, request))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Nested
    @DisplayName("제출 결과 조회")
    class GetResults {

        @Test
        @DisplayName("학생의 개별 제출 결과를 반환한다")
        void getSubmissionResult_success() {
            given(submissionRepository.findByQuizIdAndStudentId(10L, 2L))
                    .willReturn(Optional.of(submission));

            QuizResponse.SubmissionResult result = quizService.getSubmissionResult(10L, 2L);

            assertThat(result.getQuizId()).isEqualTo(10L);
            assertThat(result.getScore()).isEqualTo(2);
            assertThat(result.getTotalQuestions()).isEqualTo(2);
            assertThat(result.getAnswersJson()).isEqualTo(CORRECT_ANSWERS);
        }

        @Test
        @DisplayName("제출 결과가 없으면 예외를 던진다")
        void getSubmissionResult_notFound() {
            given(submissionRepository.findByQuizIdAndStudentId(10L, 999L))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() -> quizService.getSubmissionResult(10L, 999L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.QUIZ_NOT_FOUND);
        }

        @Test
        @DisplayName("퀴즈의 전체 제출 결과 목록을 반환한다")
        void getQuizResults_success() throws Exception {
            User student2 = User.builder().email("s2@edu.com").name("이학생").role(User.Role.STUDENT).build();
            setId(student2, 3L);

            QuizSubmission sub2 = QuizSubmission.builder().quiz(quiz).student(student2)
                    .answersJson(PARTIAL_ANSWERS).score(1).totalQuestions(2).build();
            setId(sub2, 101L);
            setField(sub2, "submittedAt", LocalDateTime.now());

            given(submissionRepository.findByQuizId(10L)).willReturn(List.of(submission, sub2));

            List<QuizResponse.SubmissionResult> results = quizService.getQuizResults(10L);

            assertThat(results).hasSize(2);
            assertThat(results.get(0).getScore()).isEqualTo(2);
            assertThat(results.get(1).getScore()).isEqualTo(1);
        }

        @Test
        @DisplayName("제출 결과가 없으면 빈 리스트를 반환한다")
        void getQuizResults_empty() {
            given(submissionRepository.findByQuizId(999L)).willReturn(List.of());

            List<QuizResponse.SubmissionResult> results = quizService.getQuizResults(999L);

            assertThat(results).isEmpty();
        }
    }
}
