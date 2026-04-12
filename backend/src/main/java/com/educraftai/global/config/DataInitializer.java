package com.educraftai.global.config;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.curriculum.entity.Curriculum;
import com.educraftai.domain.curriculum.repository.CurriculumRepository;
import com.educraftai.domain.material.entity.Material;
import com.educraftai.domain.material.repository.MaterialRepository;
import com.educraftai.domain.quiz.entity.Quiz;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * 로컬 개발 환경 초기 데이터 생성기
 * 서버 시작 시 샘플 교강사/학생 계정, 강의, 커리큘럼, 학습자료, 퀴즈를 자동 생성한다.
 * local 프로필에서만 동작한다.
 */
@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final CurriculumRepository curriculumRepository;
    private final MaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("[DataInitializer] 이미 데이터가 존재합니다. 초기화 건너뜀.");
            return;
        }

        log.info("[DataInitializer] 샘플 데이터 생성 시작...");

        // ====== 교강사 계정 생성 ======
        User teacher1 = userRepository.save(User.builder()
                .email("kim@edu.com").name("김수학").password(passwordEncoder.encode("1234"))
                .role(User.Role.TEACHER).socialProvider(User.SocialProvider.LOCAL).build());

        User teacher2 = userRepository.save(User.builder()
                .email("lee@edu.com").name("이영어").password(passwordEncoder.encode("1234"))
                .role(User.Role.TEACHER).socialProvider(User.SocialProvider.LOCAL).build());

        User teacher3 = userRepository.save(User.builder()
                .email("park@edu.com").name("박과학").password(passwordEncoder.encode("1234"))
                .role(User.Role.TEACHER).socialProvider(User.SocialProvider.LOCAL).build());

        User teacher4 = userRepository.save(User.builder()
                .email("choi@edu.com").name("최국어").password(passwordEncoder.encode("1234"))
                .role(User.Role.TEACHER).socialProvider(User.SocialProvider.LOCAL).build());

        User teacher5 = userRepository.save(User.builder()
                .email("jung@edu.com").name("정코딩").password(passwordEncoder.encode("1234"))
                .role(User.Role.TEACHER).socialProvider(User.SocialProvider.LOCAL).build());

        // ====== 강의 데이터 생성 ======

        // 수학 강의
        Course mathBasic = courseRepository.save(Course.builder().teacher(teacher1).title("기초 수학 완성반").subject("수학")
                .description("수학의 기본 개념부터 차근차근! 수와 연산, 방정식, 함수의 기초를 탄탄히 다지는 과정입니다.").build());
        Course mathAdv = courseRepository.save(Course.builder().teacher(teacher1).title("중등 수학 심화").subject("수학")
                .description("중학교 수학 심화 과정입니다. 도형, 확률과 통계, 함수 심화 문제를 다룹니다.").build());
        Course calculus = courseRepository.save(Course.builder().teacher(teacher1).title("고등 미적분 입문").subject("수학")
                .description("미분과 적분의 기본 개념을 이해하고 실생활 문제에 적용하는 방법을 배웁니다.").build());

        // 영어 강의
        Course engConv = courseRepository.save(Course.builder().teacher(teacher2).title("왕초보 영어 회화").subject("영어")
                .description("알파벳부터 시작! 일상생활에서 바로 쓸 수 있는 기초 영어 회화를 배워봅시다.").build());
        Course engGram = courseRepository.save(Course.builder().teacher(teacher2).title("영어 문법 마스터").subject("영어")
                .description("헷갈리는 영문법을 체계적으로 정리! 시제, 조동사, 관계대명사 등 핵심 문법을 완벽 정복합니다.").build());
        Course toeic = courseRepository.save(Course.builder().teacher(teacher2).title("토익 800+ 달성 전략").subject("영어")
                .description("토익 고득점을 위한 파트별 전략과 실전 문제풀이를 제공합니다.").build());

        // 과학 강의
        Course physics = courseRepository.save(Course.builder().teacher(teacher3).title("재미있는 물리학").subject("과학")
                .description("일상 속 물리 현상을 이해하는 재미있는 물리학 강의! 역학, 열, 파동을 쉽게 설명합니다.").build());
        Course chemistry = courseRepository.save(Course.builder().teacher(teacher3).title("화학 기초 다지기").subject("과학")
                .description("원소, 화합물, 화학반응의 기본을 배우고 실험으로 확인하는 화학 입문 과정입니다.").build());
        Course biology = courseRepository.save(Course.builder().teacher(teacher3).title("생명과학 탐구").subject("과학")
                .description("세포, 유전, 생태계까지! 생명의 신비를 탐구하는 생명과학 강의입니다.").build());

        // 국어 강의
        Course korRead = courseRepository.save(Course.builder().teacher(teacher4).title("국어 독해력 향상").subject("국어")
                .description("비문학, 문학 지문을 정확하게 읽고 이해하는 독해 전략을 훈련합니다.").build());
        Course korWrite = courseRepository.save(Course.builder().teacher(teacher4).title("논술 글쓰기 특강").subject("국어")
                .description("논리적 글쓰기의 기본부터 실전까지! 대입 논술과 자소서 작성에 필요한 글쓰기 능력을 키웁니다.").build());
        Course korLit = courseRepository.save(Course.builder().teacher(teacher4).title("한국 문학사 이해").subject("국어")
                .description("고전문학부터 현대문학까지 한국 문학의 흐름을 시대별로 정리합니다.").build());

        // 프로그래밍 강의
        Course python = courseRepository.save(Course.builder().teacher(teacher5).title("Python 프로그래밍 입문").subject("프로그래밍")
                .description("프로그래밍을 처음 접하는 분을 위한 Python 기초! 변수, 조건문, 반복문, 함수를 배웁니다.").build());
        Course webDev = courseRepository.save(Course.builder().teacher(teacher5).title("웹 개발 부트캠프").subject("프로그래밍")
                .description("HTML, CSS, JavaScript부터 React까지! 나만의 웹사이트를 만드는 풀스택 과정입니다.").build());
        Course aiMl = courseRepository.save(Course.builder().teacher(teacher5).title("AI/머신러닝 기초").subject("프로그래밍")
                .description("인공지능의 원리를 이해하고, scikit-learn과 TensorFlow로 간단한 모델을 만들어 봅니다.").build());
        Course javaOop = courseRepository.save(Course.builder().teacher(teacher5).title("Java 객체지향 프로그래밍").subject("프로그래밍")
                .description("Java 언어로 OOP 개념을 배우고, Spring Boot 입문까지 이어지는 체계적 과정입니다.").build());
        Course algo = courseRepository.save(Course.builder().teacher(teacher5).title("알고리즘과 자료구조").subject("프로그래밍")
                .description("코딩테스트 대비! 배열, 스택, 큐, 트리, 그래프와 정렬·탐색 알고리즘을 마스터합니다.").build());

        // ====== 학생 계정 생성 ======
        User student1 = userRepository.save(User.builder()
                .email("student1@edu.com").name("홍길동").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL).grade("MIDDLE_1").build());

        User student2 = userRepository.save(User.builder()
                .email("student2@edu.com").name("김영희").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL).grade("HIGH_2").build());

        User student3 = userRepository.save(User.builder()
                .email("student3@edu.com").name("이철수").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL).grade("ELEMENTARY_5").build());

        User student4 = userRepository.save(User.builder()
                .email("student4@edu.com").name("박민준").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL).grade("HIGH_1").build());

        User student5 = userRepository.save(User.builder()
                .email("student5@edu.com").name("정서연").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL).grade("MIDDLE_2").build());

        // ====== 수강 신청 ======
        var allCourses = courseRepository.findAll();
        // student1 (중1): 수학, 영어
        allCourses.stream().filter(c -> c.getSubject().equals("수학") || c.getSubject().equals("영어"))
                .forEach(c -> courseEnrollmentRepository.save(CourseEnrollment.builder().course(c).student(student1).build()));
        // student2 (고2): 프로그래밍, 수학
        allCourses.stream().filter(c -> c.getSubject().equals("프로그래밍") || c.getSubject().equals("수학"))
                .forEach(c -> courseEnrollmentRepository.save(CourseEnrollment.builder().course(c).student(student2).build()));
        // student3 (초5): 국어, 과학
        allCourses.stream().filter(c -> c.getSubject().equals("국어") || c.getSubject().equals("과학"))
                .forEach(c -> courseEnrollmentRepository.save(CourseEnrollment.builder().course(c).student(student3).build()));
        // student4 (고1): 수학, 프로그래밍, 과학
        allCourses.stream().filter(c -> c.getSubject().equals("수학") || c.getSubject().equals("프로그래밍") || c.getSubject().equals("과학"))
                .forEach(c -> courseEnrollmentRepository.save(CourseEnrollment.builder().course(c).student(student4).build()));
        // student5 (중2): 영어, 국어, 프로그래밍
        allCourses.stream().filter(c -> c.getSubject().equals("영어") || c.getSubject().equals("국어") || c.getSubject().equals("프로그래밍"))
                .forEach(c -> courseEnrollmentRepository.save(CourseEnrollment.builder().course(c).student(student5).build()));

        // ====== 커리큘럼 · 학습자료 · 퀴즈 생성 ======
        initMathContent(mathBasic, mathAdv, calculus);
        initEnglishContent(engConv, engGram, toeic);
        initScienceContent(physics, chemistry, biology);
        initKoreanContent(korRead, korWrite, korLit);
        initProgrammingContent(python, webDev, aiMl, javaOop, algo);

        log.info("[DataInitializer] 완료! 교강사 {}명, 학생 {}명, 강의 {}건, 커리큘럼 {}건, 학습자료 {}건, 퀴즈 {}건, 수강신청 {}건",
                5, 5, courseRepository.count(), curriculumRepository.count(),
                materialRepository.count(), quizRepository.count(), courseEnrollmentRepository.count());
    }

    // ==================== 수학 콘텐츠 ====================

    private void initMathContent(Course basic, Course adv, Course calc) {
        // 기초 수학 완성반
        var b1 = addCurriculum(basic, 1, "자연수와 정수", "자연수, 정수, 유리수의 개념을 이해하고 수직선 위에 표현한다",
                "수의 체계를 이해하는 것은 수학의 첫걸음입니다. 자연수에서 정수, 유리수로 수의 범위가 확장되는 과정을 학습합니다.");
        addLecture(b1, "자연수와 정수의 세계", 1, List.of(
                sec("1. 수의 분류", "자연수는 1, 2, 3처럼 물건을 셀 때 사용하는 수입니다. 여기에 0과 음수를 포함하면 정수가 됩니다. 수직선 위에서 양의 정수는 오른쪽, 음의 정수는 왼쪽에 위치합니다.", "자연수: 1, 2, 3, ...", "정수: ..., -2, -1, 0, 1, 2, ...", "유리수: 분수로 표현 가능한 수"),
                sec("2. 정수의 연산", "정수의 덧셈은 수직선 위에서의 이동으로 이해할 수 있습니다. 양수를 더하면 오른쪽으로, 음수를 더하면 왼쪽으로 이동합니다. 뺄셈은 부호를 바꿔서 더하는 것과 같습니다.", "같은 부호끼리 더하면 절댓값을 더하고 공통 부호 유지", "다른 부호끼리 더하면 절댓값의 차에 큰 쪽 부호", "뺄셈은 부호를 바꿔 덧셈으로 변환")
        ), "자연수와 정수의 개념을 이해하고 기본 연산을 수행할 수 있습니다.");

        var b2 = addCurriculum(basic, 2, "분수와 소수", "분수와 소수의 관계를 이해하고 사칙연산을 수행한다",
                "분수와 소수는 같은 수를 다르게 표현한 것입니다. 두 표현 사이의 변환과 연산 방법을 학습합니다.");
        addLecture(b2, "분수와 소수 완전 정복", 1, List.of(
                sec("1. 분수의 종류와 변환", "진분수는 분자가 분모보다 작고, 가분수는 분자가 분모 이상인 분수입니다. 대분수는 정수 부분과 진분수 부분으로 이루어져 있습니다. 분수를 소수로 바꾸려면 분자를 분모로 나누면 됩니다.", "진분수: 1/2, 3/4 등", "가분수: 5/3, 7/4 등", "대분수: 1과 2/3 등"),
                sec("2. 분수의 사칙연산", "분수의 덧셈과 뺄셈은 통분 후 분자끼리 계산합니다. 곱셈은 분자끼리, 분모끼리 곱하고, 나눗셈은 나누는 분수를 뒤집어서 곱합니다.", "덧셈/뺄셈: 통분 후 분자 계산", "곱셈: 분자×분자, 분모×분모", "나눗셈: 역수를 곱함")
        ), "분수와 소수의 변환 및 사칙연산을 자유롭게 수행할 수 있습니다.");

        var b3 = addCurriculum(basic, 3, "일차방정식", "등식의 성질을 이용하여 일차방정식을 풀 수 있다",
                "방정식은 미지수가 포함된 등식입니다. 등식의 성질을 이용해 미지수의 값을 구하는 방법을 배웁니다.");
        addLecture(b3, "일차방정식의 풀이", 2, List.of(
                sec("1. 등식과 방정식", "등식은 등호(=)로 연결된 식이고, 그 중 미지수를 포함한 것이 방정식입니다. 방정식을 참으로 만드는 미지수의 값을 해(근)라고 합니다.", "등식의 성질: 양변에 같은 수를 더하거나 빼도 등식 성립", "이항: 한쪽 항을 부호를 바꿔 반대편으로 옮기기", "일차방정식: 미지수의 최고차수가 1인 방정식"),
                sec("2. 일차방정식의 활용", "실생활 문제를 방정식으로 세워 해결할 수 있습니다. 문제에서 구하려는 것을 x로 놓고, 조건을 등식으로 표현한 뒤 풀면 됩니다.", "구하려는 것을 미지수로 설정", "문제의 조건을 방정식으로 표현", "풀이 후 답이 문제 조건에 맞는지 검증")
        ), "등식의 성질을 활용해 일차방정식을 풀고 실생활 문제에 적용할 수 있습니다.");

        var b4 = addCurriculum(basic, 4, "좌표와 그래프", "좌표평면에서 순서쌍을 나타내고 정비례·반비례 그래프를 그린다",
                "좌표평면은 두 수직선이 만나 이루어진 평면입니다. 순서쌍으로 점의 위치를 나타내고, 정비례·반비례 관계를 그래프로 표현합니다.");
        addLecture(b4, "좌표평면과 그래프", 2, List.of(
                sec("1. 좌표평면", "가로축(x축)과 세로축(y축)이 원점 O에서 수직으로 만나 좌표평면을 이룹니다. 점의 위치는 순서쌍 (x, y)로 나타냅니다. 좌표평면은 4개의 사분면으로 나뉩니다.", "제1사분면: x>0, y>0", "제2사분면: x<0, y>0", "원점: (0, 0)"),
                sec("2. 정비례와 반비례", "y=ax 형태를 정비례 관계라 하고, 그래프는 원점을 지나는 직선입니다. y=a/x 형태를 반비례 관계라 하고, 그래프는 쌍곡선입니다.", "정비례: x가 2배→y도 2배", "반비례: x가 2배→y는 1/2배", "비례상수 a의 부호에 따라 그래프 방향 결정")
        ), "좌표평면에 점을 나타내고 정비례·반비례 그래프를 그릴 수 있습니다.");
        var bq = addQuizMaterial(b4, "기초 수학 종합 퀴즈", 1);
        addQuiz(bq, 600, List.of(
                mc(1, "-3 + 5의 값은?", 2, "음수와 양수를 더할 때는 절댓값의 차에 절댓값이 큰 쪽의 부호를 붙입니다. |5|-|3|=2, 양수이므로 답은 2입니다.", "8", "-2", "2", "-8"),
                mc(2, "2/3 + 1/4를 계산하면?", 1, "통분하면 8/12 + 3/12 = 11/12입니다.", "7/12", "11/12", "3/7", "1/2"),
                mc(3, "2x + 6 = 14의 해는?", 0, "2x = 14-6 = 8, x = 4입니다.", "4", "5", "3", "8"),
                sa(4, "점 (3, -2)는 제 몇 사분면에 위치하나요? (숫자만)", "4", "x>0, y<0인 점은 제4사분면에 위치합니다.")
        ));

        // 중등 수학 심화
        var a1 = addCurriculum(adv, 1, "도형의 성질", "삼각형과 사각형의 성질을 증명하고 활용한다",
                "평면도형의 기본 성질을 이해하고, 삼각형의 합동 조건과 사각형의 분류를 학습합니다.");
        addLecture(a1, "삼각형과 사각형의 성질", 2, List.of(
                sec("1. 삼각형의 합동", "두 삼각형이 합동이 되는 조건은 SSS, SAS, ASA 세 가지입니다. 합동인 두 삼각형은 대응하는 변의 길이와 각의 크기가 각각 같습니다.", "SSS 합동: 세 변의 길이가 같음", "SAS 합동: 두 변과 끼인각이 같음", "ASA 합동: 한 변과 양 끝 각이 같음"),
                sec("2. 사각형의 분류", "사각형은 변과 각의 성질에 따라 평행사변형, 직사각형, 마름모, 정사각형 등으로 분류됩니다. 각 사각형은 포함 관계를 가집니다.", "평행사변형: 두 쌍의 대변이 평행", "직사각형: 네 각이 모두 직각인 평행사변형", "정사각형: 네 변과 네 각이 모두 같음")
        ), "삼각형의 합동 조건을 활용하고 사각형의 성질을 구별할 수 있습니다.");

        var a2 = addCurriculum(adv, 2, "확률의 기초", "경우의 수를 구하고 확률을 계산한다",
                "사건이 일어날 수 있는 모든 경우를 체계적으로 세고, 확률의 기본 성질을 학습합니다.");
        addLecture(a2, "경우의 수와 확률", 2, List.of(
                sec("1. 경우의 수", "합의 법칙은 동시에 일어나지 않는 두 사건의 경우의 수를 더하는 것이고, 곱의 법칙은 연이어 일어나는 두 사건의 경우의 수를 곱하는 것입니다.", "합의 법칙: A 또는 B → n(A)+n(B)", "곱의 법칙: A 그리고 B → n(A)×n(B)", "수형도를 그려 체계적으로 세기"),
                sec("2. 확률의 계산", "확률은 (해당 사건의 경우의 수)/(전체 경우의 수)로 구합니다. 확률의 값은 0 이상 1 이하이며, 모든 사건의 확률의 합은 1입니다.", "확률 P = 해당 경우의 수 / 전체 경우의 수", "0 ≤ P ≤ 1", "여사건의 확률: P(A') = 1 - P(A)")
        ), "경우의 수를 체계적으로 세고 확률을 계산할 수 있습니다.");

        var a3 = addCurriculum(adv, 3, "통계와 대푯값", "자료를 정리하고 대푯값과 산포도를 구한다",
                "수집한 자료를 표와 그래프로 정리하고, 평균·중앙값·최빈값 등 대푯값의 의미를 이해합니다.");
        addLecture(a3, "통계의 기본", 2, List.of(
                sec("1. 대푯값", "대푯값은 자료 전체를 대표하는 하나의 값입니다. 평균은 모든 값의 합을 개수로 나눈 것, 중앙값은 크기순 정렬 시 가운데 값, 최빈값은 가장 많이 나타나는 값입니다.", "평균: 모든 값의 합 ÷ 개수", "중앙값: 정렬 시 중앙에 위치한 값", "최빈값: 빈도가 가장 높은 값"),
                sec("2. 산포도", "산포도는 자료가 대푯값 주위에 얼마나 퍼져 있는지를 나타냅니다. 분산은 편차 제곱의 평균이고, 표준편차는 분산의 양의 제곱근입니다.", "편차 = 변량 - 평균", "분산 = 편차²의 평균", "표준편차 = √분산")
        ), "자료의 대푯값과 산포도를 구하고 해석할 수 있습니다.");

        var a4 = addCurriculum(adv, 4, "이차함수", "이차함수의 그래프를 그리고 성질을 분석한다",
                "y=ax²+bx+c 형태의 이차함수 그래프 특성을 파악하고, 꼭짓점과 축의 방정식을 구합니다.");
        addLecture(a4, "이차함수의 그래프", 3, List.of(
                sec("1. 이차함수 y=ax²", "이차함수 y=ax²의 그래프는 원점을 꼭짓점으로 하는 포물선입니다. a>0이면 아래로 볼록, a<0이면 위로 볼록합니다. |a|가 클수록 폭이 좁아집니다.", "꼭짓점: 포물선의 최저점 또는 최고점", "대칭축: y축 (x=0)", "a의 부호가 개형 결정"),
                sec("2. 이차함수 y=a(x-p)²+q", "평행이동을 통해 꼭짓점이 (p, q)인 포물선을 그릴 수 있습니다. 표준형에서 꼭짓점 좌표와 축의 방정식을 바로 읽을 수 있습니다.", "꼭짓점: (p, q)", "대칭축: x=p", "일반형 → 표준형 변환: 완전제곱식 이용")
        ), "이차함수의 그래프를 그리고 꼭짓점, 축, 개형을 분석할 수 있습니다.");
        var aq = addQuizMaterial(a4, "중등 수학 심화 종합 퀴즈", 2);
        addQuiz(aq, 600, List.of(
                mc(1, "삼각형의 합동 조건이 아닌 것은?", 3, "SSS, SAS, ASA는 합동 조건이지만 AAA(세 각이 같음)는 합동이 아닌 닮음 조건입니다.", "SSS", "SAS", "ASA", "AAA"),
                mc(2, "주사위를 한 번 던질 때 짝수가 나올 확률은?", 1, "짝수는 2, 4, 6으로 3가지, 전체 경우의 수는 6가지이므로 3/6 = 1/2입니다.", "1/3", "1/2", "2/3", "1/6"),
                mc(3, "자료 3, 5, 7, 7, 8의 최빈값은?", 2, "가장 많이 나타나는 값은 7(2회)입니다.", "5", "6", "7", "8"),
                sa(4, "이차함수 y=2(x-3)²+1의 꼭짓점 좌표를 (a, b) 형태로 쓰시오.", "(3, 1)", "y=a(x-p)²+q에서 꼭짓점은 (p, q)이므로 (3, 1)입니다.")
        ));

        // 고등 미적분 입문
        var c1 = addCurriculum(calc, 1, "수열과 극한", "수열의 극한 개념을 이해하고 극한값을 구한다",
                "수열의 수렴과 발산 개념을 학습하고, 극한의 성질을 이용해 극한값을 계산합니다.");
        addLecture(c1, "수열의 극한", 3, List.of(
                sec("1. 수열의 수렴과 발산", "수열 {aₙ}에서 n이 한없이 커질 때 aₙ이 일정한 값 L에 가까워지면 '수열이 L에 수렴한다'고 합니다. 수렴하지 않는 수열은 발산한다고 합니다.", "수렴: lim(n→∞) aₙ = L", "양의 무한대로 발산: aₙ → +∞", "진동: 수렴하지도, 발산하지도 않는 경우"),
                sec("2. 극한의 성질", "극한의 사칙연산 성질을 이용하면 복잡한 수열의 극한도 구할 수 있습니다. 최고차항으로 나누기, 유리화 등의 기법을 활용합니다.", "lim(aₙ+bₙ) = lim aₙ + lim bₙ", "lim(aₙ·bₙ) = lim aₙ · lim bₙ", "∞/∞ 꼴: 최고차항으로 분자분모 나누기")
        ), "수열의 극한 개념을 이해하고 다양한 기법으로 극한값을 계산할 수 있습니다.");

        var c2 = addCurriculum(calc, 2, "미분의 기초", "미분계수와 도함수의 개념을 이해한다",
                "순간변화율로서의 미분계수 개념을 학습하고, 다항함수의 도함수를 구하는 방법을 배웁니다.");
        addLecture(c2, "미분계수와 도함수", 3, List.of(
                sec("1. 미분계수", "함수 y=f(x)에서 x=a에서의 미분계수 f'(a)는 x=a에서의 순간변화율을 의미합니다. 기하학적으로는 곡선 위의 점에서의 접선의 기울기입니다.", "f'(a) = lim(h→0) [f(a+h)-f(a)]/h", "평균변화율의 극한이 미분계수", "접선의 기울기 = 미분계수"),
                sec("2. 도함수와 미분법", "함수 f(x)의 각 점에서의 미분계수를 대응시킨 함수를 도함수 f'(x)라 합니다. 다항함수의 미분은 거듭제곱 공식을 이용합니다.", "xⁿ의 도함수: nxⁿ⁻¹", "상수함수의 도함수: 0", "합/차의 미분: (f±g)' = f'±g'")
        ), "미분계수의 의미를 이해하고 다항함수의 도함수를 구할 수 있습니다.");

        var c3 = addCurriculum(calc, 3, "적분의 기초", "부정적분과 정적분의 개념을 이해한다",
                "미분의 역연산으로서의 부정적분과 넓이 계산의 도구인 정적분을 학습합니다.");
        addLecture(c3, "부정적분과 정적분", 3, List.of(
                sec("1. 부정적분", "미분해서 f(x)가 되는 함수 F(x)를 f(x)의 부정적분이라 합니다. 적분상수 C를 반드시 포함해야 합니다.", "∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n≠-1)", "∫[f(x)+g(x)]dx = ∫f(x)dx + ∫g(x)dx", "적분상수 C는 반드시 표기"),
                sec("2. 정적분", "정적분 ∫ₐᵇ f(x)dx는 구간 [a,b]에서 함수 f(x)와 x축 사이의 넓이와 관련됩니다. 미적분학의 기본정리에 의해 ∫ₐᵇ f(x)dx = F(b)-F(a)입니다.", "정적분 = F(b) - F(a)", "∫ₐᵇ f(x)dx = -∫ᵇₐ f(x)dx", "넓이 계산 시 부호 주의")
        ), "부정적분과 정적분의 계산법을 익히고 넓이 구하기에 활용할 수 있습니다.");

        var c4 = addCurriculum(calc, 4, "미적분의 활용", "미분과 적분을 실생활 문제에 적용한다",
                "미분으로 함수의 증감과 극값을 분석하고, 적분으로 넓이와 부피를 구하는 방법을 배웁니다.");
        addLecture(c4, "미적분의 실전 활용", 3, List.of(
                sec("1. 미분의 활용", "도함수의 부호를 분석하면 함수의 증가/감소 구간과 극댓값·극솟값을 알 수 있습니다. 이를 이용해 최댓값·최솟값 문제를 해결합니다.", "f'(x)>0: 함수 증가 구간", "f'(x)<0: 함수 감소 구간", "f'(x)=0이고 부호 변화: 극값"),
                sec("2. 적분의 활용", "두 곡선 사이의 넓이는 위쪽 함수에서 아래쪽 함수를 뺀 것을 적분하여 구합니다. 속도를 적분하면 이동 거리를 구할 수 있습니다.", "두 곡선 사이 넓이: ∫|f(x)-g(x)|dx", "속도→거리: ∫v(t)dt", "가속도→속도: ∫a(t)dt")
        ), "미적분을 활용해 함수 분석과 넓이·거리 계산 문제를 해결할 수 있습니다.");
        var cq = addQuizMaterial(c4, "미적분 입문 종합 퀴즈", 3);
        addQuiz(cq, 600, List.of(
                mc(1, "lim(n→∞) (3n²+1)/(n²+2)의 값은?", 2, "분자분모를 n²으로 나누면 (3+1/n²)/(1+2/n²)→3/1=3입니다.", "1", "2", "3", "∞"),
                mc(2, "f(x)=x³-3x의 도함수 f'(x)는?", 1, "xⁿ의 도함수는 nxⁿ⁻¹이므로 f'(x)=3x²-3입니다.", "3x²+3", "3x²-3", "x²-3", "3x-3"),
                mc(3, "∫(2x+1)dx의 결과는?", 0, "∫2x dx = x², ∫1 dx = x이므로 x²+x+C입니다.", "x²+x+C", "x²+1+C", "2x²+x+C", "x+C"),
                sa(4, "f(x)=x²-4x+3의 극솟값을 구하시오. (숫자만)", "-1", "f'(x)=2x-4=0에서 x=2, f(2)=4-8+3=-1이므로 극솟값은 -1입니다.")
        ));
    }

    // ==================== 영어 콘텐츠 ====================

    private void initEnglishContent(Course conv, Course gram, Course toei) {
        // 왕초보 영어 회화
        var e1 = addCurriculum(conv, 1, "인사와 자기소개", "기본적인 인사와 자기소개 표현을 익힌다",
                "영어 회화의 첫걸음은 인사입니다. 상황에 맞는 인사말과 자기소개 표현을 연습합니다.");
        addLecture(e1, "Hello! 인사와 자기소개", 1, List.of(
                sec("1. 기본 인사 표현", "영어 인사는 시간대와 상황에 따라 다릅니다. 친한 사이에는 Hi/Hey, 격식 있는 자리에서는 Good morning/afternoon/evening을 사용합니다.", "Hello / Hi / Hey - 일반 인사", "Good morning/afternoon/evening - 시간대별 인사", "How are you? / How's it going? - 안부 인사"),
                sec("2. 자기소개하기", "자기소개는 이름, 직업, 취미 순서로 말하면 자연스럽습니다. I'm... / My name is... 으로 시작해 I work as a... / I like to... 로 이어갑니다.", "My name is / I'm + 이름", "I'm from + 출신지", "I like + 동명사 (취미)")
        ), "기본 인사와 자기소개를 영어로 자연스럽게 할 수 있습니다.");

        var e2 = addCurriculum(conv, 2, "일상 표현", "날씨, 시간, 감정에 관한 일상 표현을 익힌다",
                "매일 사용하는 일상 표현을 통해 자연스러운 영어 대화 능력을 키웁니다.");
        addLecture(e2, "매일 쓰는 일상 영어", 1, List.of(
                sec("1. 날씨와 시간 표현", "날씨는 It's + 형용사(sunny, cloudy, rainy)로, 시간은 It's + 시각으로 표현합니다. What time is it? / What's the weather like? 같은 질문도 익혀봅시다.", "It's sunny/cloudy/rainy today", "It's + 숫자 o'clock / half past + 숫자", "What's the weather like?"),
                sec("2. 감정 표현하기", "기분을 표현할 때는 I'm + 감정 형용사를 사용합니다. I feel + 형용사로도 표현할 수 있습니다.", "I'm happy / sad / tired / excited", "I feel great / terrible / nervous", "That's amazing / terrible / interesting")
        ), "날씨, 시간, 감정에 관한 일상 영어를 자유롭게 표현할 수 있습니다.");

        var e3 = addCurriculum(conv, 3, "쇼핑과 식당", "쇼핑과 식당에서 필요한 핵심 표현을 익힌다",
                "가격 묻기, 주문하기, 계산하기 등 실전에서 바로 쓸 수 있는 표현을 배웁니다.");
        addLecture(e3, "쇼핑 & 식당 영어", 1, List.of(
                sec("1. 쇼핑 표현", "쇼핑할 때는 가격 묻기, 사이즈 확인, 결제 표현이 중요합니다. How much is this? / Do you have this in...? 같은 패턴을 익혀두세요.", "How much is this? - 가격 묻기", "Can I try this on? - 입어봐도 되나요?", "I'll take this. - 이것으로 할게요."),
                sec("2. 식당 표현", "식당에서는 예약, 주문, 계산의 3단계 표현을 알면 됩니다. I'd like to... / Can I have...? 패턴이 가장 자주 쓰입니다.", "I'd like to make a reservation. - 예약", "Can I have the menu? - 메뉴판 요청", "Check, please. - 계산서 요청")
        ), "쇼핑과 식당 상황에서 필요한 영어 표현을 구사할 수 있습니다.");

        var e4 = addCurriculum(conv, 4, "여행 영어", "공항, 호텔, 길 찾기에 필요한 표현을 익힌다",
                "해외여행 시 필수적인 공항, 호텔 체크인, 길 묻기 표현을 실전 대화로 연습합니다.");
        addLecture(e4, "여행에서 살아남기", 2, List.of(
                sec("1. 공항과 호텔", "공항에서는 탑승권 확인, 입국 심사 대응이 중요합니다. 호텔에서는 체크인/체크아웃 표현을 알아두면 편리합니다.", "I'd like to check in. - 체크인", "Where is the boarding gate? - 탑승구 위치", "Can I get a wake-up call? - 모닝콜 요청"),
                sec("2. 길 찾기", "길을 물을 때는 Excuse me, how do I get to...? 패턴을 사용합니다. 방향 지시를 듣고 이해하는 것도 중요합니다.", "How do I get to...? - ~에 어떻게 가나요?", "Turn left/right at the corner", "Go straight for two blocks")
        ), "여행 상황에서 자신감 있게 영어로 의사소통할 수 있습니다.");
        var eq = addQuizMaterial(e4, "왕초보 영어 회화 퀴즈", 1);
        addQuiz(eq, 600, List.of(
                mc(1, "'이것은 얼마인가요?'를 영어로 올바르게 표현한 것은?", 0, "가격을 물을 때는 How much is this?를 사용합니다.", "How much is this?", "How many is this?", "What price is this?", "How cost is this?"),
                mc(2, "식당에서 계산서를 요청할 때 알맞은 표현은?", 2, "Check, please.는 식당에서 계산서를 요청하는 가장 일반적인 표현입니다.", "Money, please.", "Pay, please.", "Check, please.", "Cost, please."),
                mc(3, "'오른쪽으로 도세요'를 영어로 하면?", 1, "Turn right는 오른쪽으로 돌라는 뜻입니다.", "Go right side", "Turn right", "Right turn go", "Move to right"),
                sa(4, "'My name is'와 같은 의미의 두 단어 표현을 쓰시오.", "I'm", "I'm은 My name is와 같이 자기소개에 사용되는 축약 표현입니다.")
        ));

        // 영어 문법 마스터
        var g1 = addCurriculum(gram, 1, "시제 총정리", "영어의 12시제를 체계적으로 정리한다",
                "현재, 과거, 미래 기본 시제와 진행형, 완료형을 포함한 12시제의 형태와 용법을 학습합니다.");
        addLecture(g1, "12시제 완벽 정리", 2, List.of(
                sec("1. 기본 시제", "현재 시제는 반복적 사실이나 습관을, 과거 시제는 이미 끝난 일을, 미래 시제는 앞으로 일어날 일을 나타냅니다.", "현재: I study English every day.", "과거: I studied English yesterday.", "미래: I will study English tomorrow."),
                sec("2. 완료 시제", "현재완료(have+p.p.)는 과거의 동작이 현재와 연결될 때, 과거완료(had+p.p.)는 과거 특정 시점 이전의 동작을 나타낼 때 사용합니다.", "현재완료: I have lived here for 5 years.", "과거완료: I had finished before he came.", "미래완료: I will have finished by tomorrow.")
        ), "영어의 12시제를 구분하고 올바르게 사용할 수 있습니다.");

        var g2 = addCurriculum(gram, 2, "조동사와 수동태", "조동사의 용법과 수동태 전환을 익힌다",
                "can, will, must, should 등 조동사의 의미 차이와 능동태↔수동태 전환 방법을 배웁니다.");
        addLecture(g2, "조동사와 수동태", 2, List.of(
                sec("1. 주요 조동사", "조동사는 동사 앞에 놓여 능력, 의무, 가능성 등을 표현합니다. 조동사 뒤에는 반드시 동사원형이 옵니다.", "can: 능력/허가 (I can swim)", "must: 의무/강한 추측 (You must study)", "should: 조언/의무 (You should rest)"),
                sec("2. 수동태", "수동태는 '주어가 ~되다/~당하다' 의미로 be동사+과거분사(p.p.) 형태입니다. 능동태의 목적어가 수동태의 주어가 됩니다.", "능동: Tom broke the window.", "수동: The window was broken by Tom.", "by + 행위자는 생략 가능")
        ), "조동사의 의미를 구분하고 능동태와 수동태를 자유롭게 전환할 수 있습니다.");

        var g3 = addCurriculum(gram, 3, "관계대명사", "관계대명사를 사용해 두 문장을 하나로 결합한다",
                "who, which, that 등 관계대명사의 용법과 관계부사의 사용법을 학습합니다.");
        addLecture(g3, "관계대명사 완전 정복", 2, List.of(
                sec("1. 관계대명사의 종류", "선행사가 사람이면 who/whom, 사물이면 which, 사람·사물 모두 that을 씁니다. 관계대명사는 접속사+대명사 역할을 동시에 합니다.", "who: 사람 (주격)", "which: 사물 (주격/목적격)", "that: 사람+사물 모두 가능"),
                sec("2. 관계부사", "관계부사는 전치사+관계대명사를 대신합니다. when(시간), where(장소), why(이유), how(방법)가 있습니다.", "where = in/at which (장소)", "when = at/in which (시간)", "why = for which (이유)")
        ), "관계대명사와 관계부사를 사용해 복잡한 문장을 만들 수 있습니다.");

        var g4 = addCurriculum(gram, 4, "가정법과 화법", "가정법과 직접·간접 화법을 이해한다",
                "현재 사실의 반대를 가정하는 가정법과 다른 사람의 말을 전달하는 화법 전환을 배웁니다.");
        addLecture(g4, "가정법과 화법 전환", 3, List.of(
                sec("1. 가정법", "가정법 과거는 현재 사실의 반대를 가정할 때 If+주어+과거형, 주어+would+동사원형 구조를 사용합니다.", "가정법 과거: If I were rich, I would travel.", "가정법 과거완료: If I had known, I would have helped.", "I wish + 가정법: I wish I were taller."),
                sec("2. 화법 전환", "직접 화법은 말한 그대로 따옴표로 전달하고, 간접 화법은 전달자의 관점에서 시제와 인칭을 바꿔 전달합니다.", "직접: He said, 'I am happy.'", "간접: He said that he was happy.", "시제 일치: 현재→과거, will→would")
        ), "가정법의 의미를 이해하고 화법 전환을 정확히 수행할 수 있습니다.");
        var gq = addQuizMaterial(g4, "영어 문법 종합 퀴즈", 2);
        addQuiz(gq, 600, List.of(
                mc(1, "'I _____ English for 3 years.'에 알맞은 것은?", 1, "3년간 계속해 온 행위이므로 현재완료 have studied가 적절합니다.", "study", "have studied", "studied", "am studying"),
                mc(2, "'The book was written _____ Mark Twain.'의 빈칸에 알맞은 전치사는?", 0, "수동태에서 행위자는 by로 표시합니다.", "by", "with", "from", "of"),
                mc(3, "'The man _____ lives next door is a doctor.'의 빈칸에 알맞은 것은?", 2, "선행사 The man은 사람이고 주격이므로 who가 적절합니다.", "which", "whom", "who", "whose"),
                sa(4, "'If I were you'로 시작하는 문장은 가정법 (과거/과거완료) 중 어느 것인가요?", "과거", "현재 사실의 반대를 가정하므로 가정법 과거입니다.")
        ));

        // 토익 800+
        var t1 = addCurriculum(toei, 1, "LC Part 1-2 전략", "사진 묘사와 질문-응답 문제의 풀이 전략을 익힌다",
                "Part 1 사진 묘사와 Part 2 질문-응답의 출제 패턴을 분석하고 오답을 빠르게 소거하는 전략을 배웁니다.");
        addLecture(t1, "LC Part 1-2 공략", 2, List.of(
                sec("1. Part 1: 사진 묘사", "사진을 보고 가장 잘 묘사한 보기를 고르는 문제입니다. 사진 속 주체의 동작과 상태, 배경에 집중하세요. 현재진행형과 수동태 표현이 자주 출제됩니다.", "인물 사진: 동작(~ing) 주목", "사물/풍경 사진: 위치 관계 표현 주목", "소거법 활용: 사진에 없는 요소 제거"),
                sec("2. Part 2: 질문-응답", "질문의 첫 단어(Who, What, When, Where, Why, How)를 반드시 들으세요. 의문사별 예상 답변 패턴을 알면 빠르게 정답을 고를 수 있습니다.", "Who → 사람/직책 관련 답변", "When → 시간/날짜 관련 답변", "Why → Because~/To~ 답변 패턴")
        ), "LC Part 1-2의 출제 패턴을 파악하고 효율적으로 풀 수 있습니다.");

        var t2 = addCurriculum(toei, 2, "LC Part 3-4 전략", "대화/담화 유형을 분석하고 핵심 정보를 포착한다",
                "Part 3 대화와 Part 4 담화의 유형별 접근법과 선택지 미리 읽기 전략을 학습합니다.");
        addLecture(t2, "LC Part 3-4 공략", 3, List.of(
                sec("1. Part 3: 대화 문제", "두 사람 이상의 대화를 듣고 문제를 푸는 형식입니다. 대화 전에 문제와 보기를 미리 읽어 핵심 키워드를 파악하세요.", "음성 재생 전 문제 미리 읽기 필수", "대화 장소/목적/다음 행동 질문 빈출", "숫자/시간/장소 관련 세부정보 주의"),
                sec("2. Part 4: 담화 문제", "한 사람의 독백(안내 방송, 회의 등)을 듣는 형식입니다. 담화의 목적과 세부 정보를 빠르게 파악해야 합니다.", "담화 유형 파악: 광고, 안내, 뉴스 등", "목적/대상/요청사항 관련 질문 빈출", "도표 연계 문제 대비")
        ), "LC Part 3-4를 효율적으로 풀기 위한 선행 읽기 전략과 키워드 포착 능력을 갖출 수 있습니다.");

        var t3 = addCurriculum(toei, 3, "RC Part 5-6 전략", "문법/어휘 문제를 빠르게 풀고 빈칸 채우기에 대비한다",
                "Part 5 단문 빈칸 채우기와 Part 6 장문 빈칸 채우기의 빈출 유형과 시간 관리 전략을 배웁니다.");
        addLecture(t3, "RC Part 5-6 공략", 3, List.of(
                sec("1. Part 5: 단문 빈칸", "빈칸의 위치와 선택지를 보고 문법 문제인지 어휘 문제인지 먼저 판단합니다. 문법 문제는 품사/시제/태를, 어휘 문제는 문맥을 기준으로 풀이합니다.", "품사 문제: 빈칸 앞뒤 품사 관계 확인", "시제 문제: 시간 부사 단서 찾기", "어휘 문제: 문맥 파악 후 의미 적합성 판단"),
                sec("2. Part 6: 장문 빈칸", "이메일, 공지 등 짧은 글의 빈칸을 채우는 문제입니다. 문장 삽입 문제는 앞뒤 문맥의 흐름을 잘 파악해야 합니다.", "전후 문맥 연결 관계 파악", "접속부사/대명사 지시 대상 확인", "문장 삽입: 논리적 흐름 기준으로 판단")
        ), "RC Part 5-6를 빠르고 정확하게 풀 수 있는 전략을 갖출 수 있습니다.");

        var t4 = addCurriculum(toei, 4, "RC Part 7 전략", "독해 지문 유형별 풀이 전략을 익힌다",
                "Part 7 단일/이중/삼중 지문의 유형별 접근법과 시간 배분 전략을 학습합니다.");
        addLecture(t4, "RC Part 7 공략", 3, List.of(
                sec("1. 단일 지문 전략", "이메일, 기사, 광고 등 하나의 지문을 읽고 문제를 푸는 유형입니다. 지문의 목적과 핵심 내용을 빠르게 스캔하는 능력이 필요합니다.", "지문 유형 파악 → 예상 질문 준비", "키워드 매칭: 문제의 키워드를 지문에서 찾기", "NOT 문제: 소거법으로 접근"),
                sec("2. 다중 지문 전략", "2~3개의 관련 지문을 비교·대조하며 읽어야 합니다. 지문 간 공통 정보와 차이점을 빠르게 파악하는 것이 핵심입니다.", "지문 간 교차 참조 문제 주의", "시간 배분: 마지막 세트에 충분한 시간 확보", "추론 문제: 직접적 단서가 아닌 간접 정보로 판단")
        ), "Part 7 지문을 효율적으로 읽고 정확하게 문제를 풀 수 있습니다.");
        var tq = addQuizMaterial(t4, "토익 전략 종합 퀴즈", 3);
        addQuiz(tq, 600, List.of(
                mc(1, "LC Part 2에서 가장 먼저 집중해야 하는 것은?", 0, "Part 2에서는 질문의 첫 단어(의문사)가 답변 유형을 결정하므로 가장 중요합니다.", "질문의 첫 단어(의문사)", "보기의 길이", "화자의 억양", "배경 소음"),
                mc(2, "RC Part 5에서 빈칸 앞에 관사 'the'가 있고 뒤에 동사가 오면, 빈칸에 들어갈 품사는?", 1, "관사와 동사 사이에는 주어 역할의 명사가 와야 합니다.", "형용사", "명사", "부사", "동사"),
                mc(3, "Part 7 다중 지문 문제에서 가장 중요한 전략은?", 2, "다중 지문 문제는 지문 간 정보를 비교·대조해야 하므로 교차 참조가 핵심입니다.", "속독으로 빨리 읽기", "첫 문장만 읽기", "지문 간 교차 참조", "모르면 건너뛰기"),
                sa(4, "토익 LC Part 3-4에서 음성 재생 전에 반드시 해야 하는 것은? (두 글자)", "미리 읽기", "문제와 보기를 미리 읽어야 핵심 키워드를 파악하고 정답을 빠르게 고를 수 있습니다.")
        ));
    }

    // ==================== 과학 콘텐츠 ====================

    private void initScienceContent(Course phys, Course chem, Course bio) {
        // 재미있는 물리학
        var p1 = addCurriculum(phys, 1, "힘과 운동", "뉴턴의 운동 법칙을 이해하고 힘과 운동의 관계를 설명한다",
                "일상에서 경험하는 힘과 운동 현상을 뉴턴의 세 가지 운동 법칙으로 설명합니다.");
        addLecture(p1, "뉴턴의 운동 법칙", 2, List.of(
                sec("1. 뉴턴의 제1·2법칙", "제1법칙(관성의 법칙): 외부 힘이 없으면 물체는 현재 운동 상태를 유지합니다. 제2법칙(가속도의 법칙): F=ma로, 힘은 질량×가속도입니다.", "관성: 정지한 물체는 계속 정지, 운동하는 물체는 계속 운동", "F=ma: 힘이 클수록, 질량이 작을수록 가속도 큼", "힘의 단위: N (뉴턴) = kg·m/s²"),
                sec("2. 뉴턴의 제3법칙", "작용-반작용의 법칙입니다. 한 물체가 다른 물체에 힘을 가하면, 동시에 같은 크기의 반대 방향 힘을 받습니다. 로켓 추진, 수영 등이 예시입니다.", "작용과 반작용은 크기가 같고 방향이 반대", "두 힘은 서로 다른 물체에 작용", "로켓: 가스를 뒤로 분출 → 앞으로 전진")
        ), "뉴턴의 세 가지 운동 법칙을 이해하고 일상 현상에 적용할 수 있습니다.");

        var p2 = addCurriculum(phys, 2, "에너지와 일", "에너지의 종류와 에너지 보존 법칙을 이해한다",
                "운동에너지, 위치에너지의 개념과 에너지가 전환되면서도 총량이 보존되는 원리를 배웁니다.");
        addLecture(p2, "에너지의 세계", 2, List.of(
                sec("1. 에너지의 종류", "운동에너지는 움직이는 물체가 가진 에너지(½mv²), 위치에너지는 높은 곳에 있는 물체가 가진 에너지(mgh)입니다. 역학적 에너지는 이 둘의 합입니다.", "운동에너지: Ek = ½mv²", "위치에너지: Ep = mgh", "역학적 에너지 = 운동에너지 + 위치에너지"),
                sec("2. 에너지 보존 법칙", "고립된 계에서 에너지의 총량은 변하지 않습니다. 롤러코스터가 높은 곳에서 내려올 때 위치에너지가 운동에너지로 전환되지만 총합은 일정합니다.", "에너지는 생성되거나 소멸되지 않음", "한 형태에서 다른 형태로 전환만 됨", "마찰이 있으면 역학적 에너지 → 열에너지 전환")
        ), "에너지의 종류를 구분하고 에너지 보존 법칙을 설명할 수 있습니다.");

        var p3 = addCurriculum(phys, 3, "열과 온도", "열의 이동 방식과 열역학 기본 개념을 이해한다",
                "전도, 대류, 복사 세 가지 열 전달 방식과 비열의 개념을 학습합니다.");
        addLecture(p3, "열의 전달", 2, List.of(
                sec("1. 열 전달의 세 가지 방식", "전도는 물질 내에서 입자 충돌로, 대류는 유체의 순환으로, 복사는 전자기파로 열이 전달되는 것입니다.", "전도: 금속 막대의 한쪽을 가열하면 반대쪽도 뜨거워짐", "대류: 냄비의 물이 순환하며 데워짐", "복사: 태양열이 진공을 통해 전달됨"),
                sec("2. 비열과 열량", "비열은 물질 1kg의 온도를 1°C 올리는 데 필요한 열량입니다. 비열이 큰 물질은 온도 변화가 느립니다. Q=mcΔT로 열량을 계산합니다.", "Q = mcΔT (열량 = 질량 × 비열 × 온도변화)", "물의 비열이 크므로 해안 지역 기후 온화", "열평형: 온도가 다른 두 물체가 접촉하면 같은 온도가 됨")
        ), "열의 이동 방식을 설명하고 열량을 계산할 수 있습니다.");

        var p4 = addCurriculum(phys, 4, "파동과 소리", "파동의 성질과 소리의 전달 원리를 이해한다",
                "횡파와 종파의 차이, 파동의 반사·굴절·회절 현상, 그리고 소리의 전달 원리를 배웁니다.");
        addLecture(p4, "파동의 세계", 2, List.of(
                sec("1. 파동의 종류와 성질", "매질의 진동 방향에 따라 횡파(수직)와 종파(평행)로 나뉩니다. 파동은 에너지를 전달하지만 매질 자체는 이동하지 않습니다.", "횡파: 빛, 지진의 S파 등", "종파: 소리, 지진의 P파 등", "v = fλ (속도 = 진동수 × 파장)"),
                sec("2. 소리의 전달", "소리는 매질(공기, 물 등)의 진동으로 전달되는 종파입니다. 진공에서는 전달되지 않습니다. 진폭이 클수록 큰 소리, 진동수가 높을수록 높은 소리입니다.", "소리의 3요소: 크기(진폭), 높이(진동수), 음색(파형)", "공기 중 속도: 약 340m/s", "공명: 고유진동수와 같은 진동이 가해지면 진폭 증가")
        ), "파동의 기본 성질을 이해하고 소리의 전달 원리를 설명할 수 있습니다.");
        var pq = addQuizMaterial(p4, "물리학 종합 퀴즈", 2);
        addQuiz(pq, 600, List.of(
                mc(1, "뉴턴의 제2법칙 F=ma에서 질량이 2배가 되면 같은 힘으로 생기는 가속도는?", 1, "F=ma에서 F가 일정하고 m이 2배면 a=F/2m이므로 가속도는 1/2배가 됩니다.", "2배", "1/2배", "변화 없음", "4배"),
                mc(2, "높이 10m에서 자유 낙하하는 물체의 역학적 에너지는 바닥에서 어떻게 되는가?", 2, "에너지 보존 법칙에 의해 위치에너지가 모두 운동에너지로 전환되므로 총 역학적 에너지는 보존됩니다.", "0이 됨", "2배가 됨", "보존됨", "절반이 됨"),
                mc(3, "소리가 전달되지 못하는 곳은?", 3, "소리는 매질의 진동으로 전달되므로 매질이 없는 진공에서는 전달되지 않습니다.", "물속", "철 속", "공기 중", "진공"),
                sa(4, "열의 전달 방식 3가지를 쉼표로 구분하여 쓰시오.", "전도, 대류, 복사", "열은 전도(접촉), 대류(유체 순환), 복사(전자기파) 세 가지 방식으로 전달됩니다.")
        ));

        // 화학 기초 다지기
        var ch1 = addCurriculum(chem, 1, "원소와 주기율표", "원자의 구조를 이해하고 주기율표를 해석한다",
                "원자를 구성하는 양성자, 중성자, 전자의 역할과 주기율표의 구성 원리를 학습합니다.");
        addLecture(ch1, "원자와 주기율표", 2, List.of(
                sec("1. 원자의 구조", "원자는 양성자와 중성자로 이루어진 원자핵과 그 주위를 도는 전자로 구성됩니다. 양성자 수가 원소의 종류를 결정하며 이를 원자번호라 합니다.", "양성자: (+) 전하, 원자번호 결정", "중성자: 전하 없음, 질량 기여", "전자: (-) 전하, 화학 반응에 참여"),
                sec("2. 주기율표 읽기", "주기율표는 원소를 원자번호 순서로 배열한 표입니다. 같은 족(세로줄)의 원소는 비슷한 화학적 성질을 가집니다.", "주기(가로): 전자 껍질 수", "족(세로): 최외각 전자 수 → 비슷한 성질", "금속/비금속/준금속 구분")
        ), "원자의 구조를 설명하고 주기율표에서 원소의 정보를 읽을 수 있습니다.");

        var ch2 = addCurriculum(chem, 2, "화학 결합", "이온결합과 공유결합의 원리를 이해한다",
                "원자들이 결합하는 두 가지 주요 방식인 이온결합과 공유결합의 차이를 학습합니다.");
        addLecture(ch2, "화학 결합의 이해", 2, List.of(
                sec("1. 이온결합", "금속 원자가 전자를 잃어 양이온이 되고, 비금속 원자가 전자를 얻어 음이온이 됩니다. 이 양이온과 음이온 사이의 정전기적 인력이 이온결합입니다.", "금속 → 양이온 (전자 잃음)", "비금속 → 음이온 (전자 얻음)", "예: NaCl (소금), MgO"),
                sec("2. 공유결합", "비금속 원자들이 전자쌍을 공유하여 결합합니다. 각 원자가 안정한 전자 배치를 갖기 위해 전자를 나눕니다.", "전자쌍을 공유하여 결합", "단일결합, 이중결합, 삼중결합", "예: H₂O, CO₂, O₂")
        ), "이온결합과 공유결합의 원리를 이해하고 구분할 수 있습니다.");

        var ch3 = addCurriculum(chem, 3, "화학 반응식", "화학 반응식을 작성하고 화학량론 계산을 수행한다",
                "반응물과 생성물을 화학식으로 나타내고, 계수를 맞추는 방법과 몰 개념을 배웁니다.");
        addLecture(ch3, "화학 반응식과 화학량론", 2, List.of(
                sec("1. 화학 반응식", "화학 반응식은 반응물 → 생성물 형태로 작성합니다. 양변의 원자 수가 같도록 계수를 맞춰야 합니다(질량 보존 법칙).", "반응물 → 생성물", "계수 맞추기: 양변의 원자 수 동일하게", "상태 기호: (s)고체, (l)액체, (g)기체, (aq)수용액"),
                sec("2. 몰과 화학량론", "몰(mol)은 6.02×10²³개의 입자 수를 나타내는 단위입니다. 화학 반응식의 계수비는 몰 비와 같습니다.", "1mol = 6.02×10²³개 (아보가드로 수)", "계수비 = 몰 비", "몰 질량: 원자량에 g/mol 단위 붙임")
        ), "화학 반응식을 올바르게 작성하고 몰 개념을 활용한 계산을 수행할 수 있습니다.");

        var ch4 = addCurriculum(chem, 4, "산과 염기", "산·염기의 성질과 중화 반응을 이해한다",
                "산과 염기의 정의, pH 스케일, 중화 반응의 원리를 학습합니다.");
        addLecture(ch4, "산과 염기의 화학", 2, List.of(
                sec("1. 산과 염기의 정의", "아레니우스 정의에서 산은 H⁺를, 염기는 OH⁻를 내놓는 물질입니다. pH는 수소이온 농도의 지표로 7 미만이면 산성, 7 초과면 염기성입니다.", "산: H⁺ 제공 (HCl, H₂SO₄ 등)", "염기: OH⁻ 제공 (NaOH, KOH 등)", "pH < 7: 산성, pH = 7: 중성, pH > 7: 염기성"),
                sec("2. 중화 반응", "산의 H⁺와 염기의 OH⁻가 만나 물(H₂O)을 생성하는 반응입니다. 중화점에서는 pH가 7에 가까워지고 열이 발생합니다.", "H⁺ + OH⁻ → H₂O", "중화열: 중화 반응 시 발생하는 열", "중화 적정: 농도를 모르는 산/염기의 농도 결정")
        ), "산과 염기의 성질을 이해하고 중화 반응을 설명할 수 있습니다.");
        var chq = addQuizMaterial(ch4, "화학 기초 종합 퀴즈", 2);
        addQuiz(chq, 600, List.of(
                mc(1, "원자번호를 결정하는 입자는?", 0, "원자번호는 원자핵 속 양성자의 수와 같습니다.", "양성자", "중성자", "전자", "원자핵"),
                mc(2, "NaCl(소금)의 결합 종류는?", 1, "Na는 금속(양이온), Cl은 비금속(음이온)이므로 이온결합입니다.", "공유결합", "이온결합", "금속결합", "수소결합"),
                mc(3, "pH 3인 용액은?", 0, "pH 7 미만은 산성이므로 pH 3은 강한 산성입니다.", "산성", "중성", "염기성", "알 수 없음"),
                sa(4, "1몰의 입자 수(아보가드로 수)를 쓰시오. (지수 표기)", "6.02×10²³", "아보가드로 수는 6.02×10²³으로, 1몰에 포함된 입자의 개수입니다.")
        ));

        // 생명과학 탐구
        var bi1 = addCurriculum(bio, 1, "세포의 구조", "세포의 구조와 각 소기관의 기능을 설명한다",
                "생명의 기본 단위인 세포의 구조를 학습하고, 동물세포와 식물세포의 차이를 이해합니다.");
        addLecture(bi1, "세포의 세계", 2, List.of(
                sec("1. 세포 소기관", "세포는 핵, 미토콘드리아, 리보솜 등 다양한 소기관으로 이루어져 있습니다. 각 소기관은 고유한 기능을 수행합니다.", "핵: DNA 보관, 유전 정보 조절", "미토콘드리아: 세포 호흡으로 ATP(에너지) 생성", "리보솜: 단백질 합성"),
                sec("2. 동물세포 vs 식물세포", "식물세포는 동물세포에 없는 세포벽, 엽록체, 큰 액포를 가지고 있습니다. 엽록체는 광합성으로 포도당을 합성합니다.", "세포벽: 식물세포에만 있음 (형태 유지)", "엽록체: 광합성 담당 (식물세포만)", "액포: 식물세포는 크고, 동물세포는 작거나 없음")
        ), "세포의 구조를 설명하고 동물세포와 식물세포를 비교할 수 있습니다.");

        var bi2 = addCurriculum(bio, 2, "유전의 원리", "멘델 법칙과 DNA의 구조를 이해한다",
                "유전의 기본 법칙인 멘델 법칙과 유전 물질인 DNA의 구조를 학습합니다.");
        addLecture(bi2, "유전의 비밀", 2, List.of(
                sec("1. 멘델의 유전 법칙", "멘델은 완두콩 교배 실험으로 우열의 법칙, 분리의 법칙, 독립의 법칙을 발견했습니다. 유전자는 쌍으로 존재하며 생식세포 형성 시 분리됩니다.", "우열의 법칙: 우성 형질만 나타남", "분리의 법칙: 생식세포 형성 시 대립유전자 분리", "독립의 법칙: 서로 다른 형질은 독립적으로 유전"),
                sec("2. DNA의 구조", "DNA는 이중나선 구조로, 네 종류의 염기(A, T, G, C)가 상보적으로 결합합니다. A-T, G-C 쌍이 수소결합으로 연결됩니다.", "이중나선 구조 (Watson & Crick)", "상보적 염기 쌍: A-T, G-C", "유전 정보는 염기 서열에 담겨 있음")
        ), "멘델의 유전 법칙을 설명하고 DNA의 구조를 이해할 수 있습니다.");

        var bi3 = addCurriculum(bio, 3, "진화와 다양성", "자연선택에 의한 진화 과정을 이해한다",
                "다윈의 자연선택설을 중심으로 생물 진화의 원리와 종 다양성의 기원을 배웁니다.");
        addLecture(bi3, "진화의 원리", 2, List.of(
                sec("1. 자연선택", "환경에 적합한 형질을 가진 개체가 생존과 번식에 유리하여 그 형질이 다음 세대에 더 많이 전달됩니다. 이것이 다윈의 자연선택설입니다.", "변이: 개체 간 형질 차이 존재", "적자생존: 환경에 유리한 형질 보유 개체가 생존", "세대를 거치며 유리한 형질 빈도 증가"),
                sec("2. 종분화", "지리적 격리, 생식적 격리 등에 의해 하나의 종에서 새로운 종이 생겨납니다. 갈라파고스 핀치새가 대표적인 예입니다.", "지리적 격리: 물리적 장벽에 의한 분리", "환경 적응에 따른 형질 분화", "충분한 시간 경과 → 새로운 종 형성")
        ), "자연선택에 의한 진화 과정과 종분화 메커니즘을 설명할 수 있습니다.");

        var bi4 = addCurriculum(bio, 4, "생태계", "생태계의 구성과 에너지 흐름을 이해한다",
                "생태계의 구성 요소, 먹이사슬과 먹이그물, 에너지 흐름과 물질 순환을 학습합니다.");
        addLecture(bi4, "생태계의 이해", 2, List.of(
                sec("1. 생태계의 구성", "생태계는 생물 요소(생산자, 소비자, 분해자)와 비생물 요소(빛, 물, 온도 등)로 구성됩니다. 먹이사슬은 먹고 먹히는 관계를 나타냅니다.", "생산자: 광합성으로 유기물 합성 (식물)", "소비자: 다른 생물을 먹어 에너지 획득", "분해자: 죽은 생물을 분해 (세균, 곰팡이)"),
                sec("2. 에너지 흐름과 물질 순환", "에너지는 먹이사슬을 따라 한 방향으로 흐르며 각 단계에서 일부가 열로 방출됩니다. 영양 단계가 올라갈수록 에너지양은 약 10%로 감소합니다.", "에너지: 한 방향 흐름 (비순환)", "물질: 생태계 내에서 순환 (탄소, 질소 등)", "생태 피라미드: 상위 영양 단계일수록 감소")
        ), "생태계의 구성을 이해하고 에너지 흐름을 설명할 수 있습니다.");
        var biq = addQuizMaterial(bi4, "생명과학 종합 퀴즈", 2);
        addQuiz(biq, 600, List.of(
                mc(1, "식물세포에만 있는 소기관은?", 2, "엽록체는 광합성을 담당하며 식물세포에만 존재합니다.", "미토콘드리아", "리보솜", "엽록체", "소포체"),
                mc(2, "DNA에서 A(아데닌)와 상보적으로 결합하는 염기는?", 1, "DNA에서 A는 T와, G는 C와 상보적 결합을 합니다.", "G(구아닌)", "T(티민)", "C(시토신)", "U(유라실)"),
                mc(3, "생태계에서 에너지가 흐르는 방식은?", 0, "에너지는 먹이사슬을 따라 한 방향으로만 흐르며 순환하지 않습니다.", "한 방향 흐름", "순환", "양방향 흐름", "무작위"),
                sa(4, "다윈의 진화론에서 핵심 개념을 두 글자로 쓰시오.", "자연선택", "다윈은 환경에 적합한 개체가 생존하는 자연선택에 의해 진화가 일어난다고 설명했습니다.")
        ));
    }

    // ==================== 국어 콘텐츠 ====================

    private void initKoreanContent(Course read, Course write, Course lit) {
        // 국어 독해력 향상
        var r1 = addCurriculum(read, 1, "비문학 독해 전략", "비문학 지문의 중심 내용을 파악하고 글의 구조를 분석한다",
                "설명문, 논설문 등 비문학 지문의 핵심 내용을 빠르고 정확하게 파악하는 전략을 배웁니다.");
        addLecture(r1, "비문학 독해의 기술", 2, List.of(
                sec("1. 중심 내용 파악", "각 문단의 중심 문장(주제문)을 찾는 것이 핵심입니다. 보통 문단의 첫 문장이나 마지막 문장에 중심 내용이 있습니다. 접속어를 단서로 활용하세요.", "주제문: 문단의 핵심 주장을 담은 문장", "접속어 단서: '따라서', '그러나', '즉' 등", "글 전체 주제 = 각 문단 주제의 종합"),
                sec("2. 글의 구조 파악", "글은 서론-본론-결론, 원인-결과, 비교-대조, 문제-해결 등의 구조로 이루어집니다. 구조를 파악하면 내용 이해가 훨씬 쉬워집니다.", "서론-본론-결론: 가장 기본적 구조", "원인-결과: '때문에', '그 결과' 등의 단서", "비교-대조: 공통점과 차이점 정리")
        ), "비문학 지문의 중심 내용과 글의 구조를 빠르게 파악할 수 있습니다.");

        var r2 = addCurriculum(read, 2, "문학 감상법", "시, 소설, 수필의 감상 방법을 익힌다",
                "각 문학 장르별 특성을 이해하고, 작품의 주제와 표현 기법을 분석하는 방법을 배웁니다.");
        addLecture(r2, "문학 작품 읽기", 2, List.of(
                sec("1. 시의 감상", "시를 감상할 때는 화자(말하는 이), 시적 대상, 정서와 태도, 표현 기법을 파악해야 합니다. 비유와 상징 등의 표현 기법이 시의 의미를 풍부하게 합니다.", "화자: 시에서 말하고 있는 사람(작가와 다를 수 있음)", "정서: 화자의 감정과 태도", "표현 기법: 비유(직유, 은유), 상징, 역설 등"),
                sec("2. 소설의 감상", "소설은 인물, 사건, 배경의 3요소로 구성됩니다. 서술자의 시점에 따라 같은 이야기도 다르게 전달될 수 있습니다.", "인물: 성격, 갈등 관계 파악", "사건: 발단-전개-위기-절정-결말", "시점: 1인칭/3인칭, 관찰자/전지적")
        ), "시와 소설의 핵심 요소를 분석하고 작품의 주제를 파악할 수 있습니다.");

        var r3 = addCurriculum(read, 3, "추론과 비판적 읽기", "숨은 전제를 찾고 논리적 오류를 판별한다",
                "글에 명시되지 않은 전제를 추론하고, 논증의 타당성을 비판적으로 평가하는 능력을 키웁니다.");
        addLecture(r3, "비판적 사고력 키우기", 3, List.of(
                sec("1. 추론하기", "글에 직접 쓰여 있지 않지만 문맥에서 유추할 수 있는 내용을 파악하는 것이 추론입니다. 필자의 의도, 생략된 전제, 이어질 내용 등을 추론합니다.", "전제 추론: 주장이 성립하기 위해 필요한 숨은 가정", "의도 추론: 글을 쓴 목적이나 의도 파악", "맥락 추론: 앞뒤 문맥에서 의미 유추"),
                sec("2. 논리적 오류 판별", "주장의 논리적 타당성을 평가할 때 흔히 나타나는 오류를 알아야 합니다. 성급한 일반화, 인신공격, 순환논증 등이 대표적입니다.", "성급한 일반화: 소수 사례로 전체를 단정", "인신공격: 주장이 아닌 사람을 공격", "순환논증: 결론을 전제로 사용")
        ), "글의 숨은 전제를 추론하고 논리적 오류를 판별할 수 있습니다.");

        var r4 = addCurriculum(read, 4, "실전 독해 연습", "수능형 독해 문제를 풀고 전략을 적용한다",
                "비문학·문학 지문의 실전 문제풀이를 통해 독해 전략을 종합적으로 적용합니다.");
        addLecture(r4, "실전 문제 풀이 전략", 3, List.of(
                sec("1. 시간 관리 전략", "수능 국어 독해 영역은 시간과의 싸움입니다. 지문을 읽기 전에 문제를 먼저 스캔하여 무엇을 찾아야 하는지 파악하면 효율적입니다.", "문제 먼저 스캔 → 찾을 정보 파악", "지문 읽기: 핵심어 표시하며 읽기", "어려운 문제는 표시 후 나중에"),
                sec("2. 오답 소거법", "정답을 바로 찾기 어려울 때는 오답을 소거하는 전략이 효과적입니다. 지문에 근거가 없는 선택지, 과장된 표현, 절대적 표현이 있는 선택지를 먼저 소거합니다.", "지문에 근거 없는 내용 → 소거", "'반드시', '절대로' 등 절대적 표현 주의", "일부만 맞고 일부가 틀린 선택지 주의")
        ), "실전 독해 문제를 효율적으로 풀 수 있는 전략을 갖추었습니다.");
        var rq = addQuizMaterial(r4, "독해력 종합 퀴즈", 2);
        addQuiz(rq, 600, List.of(
                mc(1, "비문학 지문에서 중심 문장을 가장 자주 찾을 수 있는 위치는?", 0, "문단의 주제문은 보통 첫 문장 또는 마지막 문장에 위치합니다.", "문단의 첫 문장 또는 마지막 문장", "문단의 가운데", "글의 제목", "각주"),
                mc(2, "소설의 3요소가 아닌 것은?", 3, "소설의 3요소는 인물, 사건, 배경이며, 운율은 시의 요소입니다.", "인물", "사건", "배경", "운율"),
                mc(3, "'소수의 사례만으로 전체를 단정 짓는' 논리적 오류는?", 1, "소수의 사례로 전체를 일반화하는 것은 성급한 일반화의 오류입니다.", "순환논증", "성급한 일반화", "인신공격", "허수아비 공격"),
                sa(4, "시에서 말하는 이를 무엇이라 하나요? (두 글자)", "화자", "시에서 말하는 이를 화자라 하며, 시인과 반드시 동일하지는 않습니다.")
        ));

        // 논술 글쓰기 특강
        var w1 = addCurriculum(write, 1, "논증의 구조", "주장, 근거, 반론의 관계를 이해한다",
                "논증은 주장과 근거로 이루어집니다. 강력한 논증을 구성하는 방법과 반론에 대비하는 전략을 배웁니다.");
        addLecture(w1, "논증 구조 이해하기", 2, List.of(
                sec("1. 주장과 근거", "주장은 글쓴이가 주장하는 바이고, 근거는 주장을 뒷받침하는 이유와 증거입니다. 강력한 근거에는 통계, 전문가 의견, 구체적 사례가 포함됩니다.", "주장: 글의 핵심 의견", "근거: 사실, 통계, 전문가 의견, 사례", "근거의 신뢰성과 관련성이 중요"),
                sec("2. 반론과 재반론", "좋은 논술은 예상되는 반론을 미리 다루고 이에 대한 재반론을 제시합니다. 이를 통해 주장의 설득력이 강화됩니다.", "반론 예상: 상대방의 가능한 반박 미리 파악", "반론 수용: 일부 타당한 반론은 인정", "재반론: 반론의 한계를 지적하여 주장 보강")
        ), "논증의 구조를 이해하고 효과적인 근거를 제시할 수 있습니다.");

        var w2 = addCurriculum(write, 2, "개요 작성법", "서론-본론-결론 구조로 글의 개요를 작성한다",
                "논술의 뼈대인 개요를 체계적으로 작성하는 방법을 배우고, 논리적 흐름을 설계합니다.");
        addLecture(w2, "체계적 개요 작성", 2, List.of(
                sec("1. 서론 작성 전략", "서론은 독자의 관심을 끌고 글의 방향을 제시하는 역할입니다. 문제 제기, 질문 던지기, 인용 등으로 시작할 수 있습니다.", "논제 배경 설명으로 맥락 제공", "문제 제기 또는 질문으로 독자 관심 유도", "글의 방향(주장)을 명확히 제시"),
                sec("2. 본론과 결론 설계", "본론은 2~3개의 핵심 논거를 중심으로 구성합니다. 각 논거는 독립적이면서도 유기적으로 연결되어야 합니다. 결론은 주장을 요약하고 전망을 제시합니다.", "본론: 핵심 논거 2~3개 + 각각의 근거", "논거 간 연결: 접속어로 자연스럽게", "결론: 요약 + 전망 또는 제안")
        ), "서론-본론-결론의 체계적인 개요를 작성할 수 있습니다.");

        var w3 = addCurriculum(write, 3, "본론 전개", "논거를 효과적으로 전개하고 예시를 활용한다",
                "본론의 각 문단을 논리적으로 전개하는 방법과 적절한 예시 활용법을 연습합니다.");
        addLecture(w3, "설득력 있는 본론 쓰기", 2, List.of(
                sec("1. 문단 전개 방법", "하나의 문단은 하나의 소주제를 다룹니다. 두괄식(주제문→부연), 미괄식(부연→주제문), 양괄식(주제문→부연→정리) 구조 중 선택합니다.", "두괄식: 핵심 먼저 → 부연 설명", "미괄식: 설명 후 → 핵심 제시", "한 문단 = 한 소주제 원칙"),
                sec("2. 예시와 인용 활용", "추상적 주장은 구체적 예시로 뒷받침해야 설득력이 있습니다. 권위 있는 인용도 효과적이지만 남용하면 안 됩니다.", "구체적 사례: 주장의 근거를 생생하게", "통계 인용: 객관적 신뢰성 확보", "인용은 꼭 필요할 때만 간결하게")
        ), "본론을 논리적으로 전개하고 예시를 효과적으로 활용할 수 있습니다.");

        var w4 = addCurriculum(write, 4, "실전 논술", "시사 주제로 완성된 논술문을 작성한다",
                "배운 기법을 종합하여 실제 논술 주제에 대한 완성된 글을 작성하고 첨삭합니다.");
        addLecture(w4, "논술 실전 연습", 3, List.of(
                sec("1. 논제 분석", "논술 시험에서 가장 먼저 해야 할 일은 논제를 정확히 분석하는 것입니다. 논제의 핵심어, 요구 조건, 범위를 파악합니다.", "핵심어 밑줄: 주제 파악의 첫 단계", "조건 확인: '찬반', '원인 분석', '대안 제시' 등", "범위 설정: 너무 넓거나 좁지 않게"),
                sec("2. 퇴고와 다듬기", "초고를 쓴 후 반드시 퇴고 과정을 거칩니다. 논리적 비약, 문맥 오류, 맞춤법을 점검합니다.", "논리적 흐름: 앞뒤 연결이 자연스러운가", "근거 검증: 주장과 근거가 일치하는가", "문장 다듬기: 간결하고 명확하게")
        ), "실전 논술 주제를 분석하고 체계적인 논술문을 작성할 수 있습니다.");
        var wq = addQuizMaterial(w4, "논술 글쓰기 종합 퀴즈", 2);
        addQuiz(wq, 600, List.of(
                mc(1, "논증에서 주장을 뒷받침하는 것을 무엇이라 하나요?", 1, "근거는 주장을 뒷받침하는 사실, 통계, 사례, 전문가 의견 등입니다.", "반론", "근거", "결론", "서론"),
                mc(2, "논술의 서론에서 가장 중요한 역할은?", 0, "서론은 독자의 관심을 끌고 글의 방향(주장)을 제시하는 역할입니다.", "문제 제기와 주장 제시", "구체적 사례 나열", "통계 데이터 제시", "결론 요약"),
                mc(3, "한 문단에서 다루어야 할 소주제의 수는?", 0, "한 문단 = 한 소주제 원칙을 지켜야 글이 논리적으로 구성됩니다.", "1개", "2개", "3개", "제한 없음"),
                sa(4, "초고를 쓴 후 논리, 맞춤법 등을 점검하며 다듬는 과정을 무엇이라 하나요?", "퇴고", "퇴고(推敲)는 글을 다시 읽으며 고치는 과정으로, 좋은 글의 필수 과정입니다.")
        ));

        // 한국 문학사 이해
        var l1 = addCurriculum(lit, 1, "고전 시가", "향가, 고려가요, 시조의 특징을 이해한다",
                "한국 문학의 뿌리인 고전 시가의 흐름을 향가부터 시조까지 시대별로 정리합니다.");
        addLecture(l1, "고전 시가의 세계", 2, List.of(
                sec("1. 향가와 고려가요", "향가는 신라시대 향찰로 표기된 노래이며, 4구체·8구체·10구체 형식이 있습니다. 고려가요는 고려시대 민중의 정서를 담은 시가입니다.", "향가: 신라시대, 향찰 표기, 대표작 '제망매가'", "고려가요: 3음보, 후렴구 특징, 대표작 '청산별곡'", "시대 배경과 작품의 관련성 이해"),
                sec("2. 시조", "시조는 고려 말에 발생하여 조선시대에 크게 발전한 정형시입니다. 초장·중장·종장의 3장 6구 형식으로, 종장 첫 음보는 3음절입니다.", "형식: 3장 6구 45자 내외", "평시조, 사설시조 구분", "대표 작가: 이황, 정철, 윤선도")
        ), "향가, 고려가요, 시조의 형식과 특징을 비교·설명할 수 있습니다.");

        var l2 = addCurriculum(lit, 2, "고전 산문", "설화, 가전, 판소리의 특징을 이해한다",
                "한국 고전 산문의 주요 장르인 설화, 가전체 문학, 판소리 사설의 특징을 학습합니다.");
        addLecture(l2, "고전 산문의 세계", 2, List.of(
                sec("1. 설화와 가전", "설화는 구전되어 전해진 이야기로 신화, 전설, 민담으로 나뉩니다. 가전체는 사물을 의인화하여 전기 형식으로 쓴 문학입니다.", "신화: 신성함, 집단적 믿음 (단군신화)", "전설: 특정 장소와 증거물 연결 (아기장수)", "가전: 사물 의인화 (국순전, 공방전)"),
                sec("2. 판소리와 한글 소설", "판소리는 한 명의 소리꾼이 이야기를 노래로 엮어 나가는 공연 예술입니다. 한글 소설은 조선 후기 서민 문학의 꽃입니다.", "판소리: 소리꾼 + 고수, 5마당 현존", "한글 소설: 홍길동전(최초), 춘향전, 심청전", "서민 의식의 성장과 문학의 대중화")
        ), "고전 산문 장르의 특징을 이해하고 대표 작품을 설명할 수 있습니다.");

        var l3 = addCurriculum(lit, 3, "현대 시", "한국 현대 시의 흐름과 주요 시인을 이해한다",
                "한국 현대 시의 발전 과정을 주요 시인과 작품을 중심으로 학습합니다.");
        addLecture(l3, "한국 현대 시의 흐름", 2, List.of(
                sec("1. 일제강점기 시", "일제강점기에는 저항시와 순수시가 공존했습니다. 저항시인들은 민족의식을 노래했고, 순수시인들은 언어의 예술성을 추구했습니다.", "저항시: 윤동주 '서시', 이육사 '광야'", "민족의식과 시적 아름다움의 결합", "한용운 '님의 침묵': 민족과 사랑의 이중 상징"),
                sec("2. 해방 이후 현대 시", "해방 이후 한국 시는 전쟁의 상흔, 산업화, 민주화 등 시대적 상황을 반영하며 다양하게 발전했습니다.", "전후 시: 전쟁의 아픔과 허무 (김수영)", "참여시: 사회 현실 비판 (신동엽, 김지하)", "서정시: 자연과 인간의 교감 (정지용, 박목월)")
        ), "한국 현대 시의 흐름을 시대별로 이해하고 주요 시인의 특징을 설명할 수 있습니다.");

        var l4 = addCurriculum(lit, 4, "현대 소설", "한국 현대 소설의 흐름과 주요 작가를 이해한다",
                "한국 현대 소설의 발전 과정을 주요 작가와 작품을 중심으로 학습합니다.");
        addLecture(l4, "한국 현대 소설의 흐름", 2, List.of(
                sec("1. 초기 현대 소설", "이광수의 '무정'은 한국 최초의 현대 장편소설로 평가됩니다. 이후 김동인, 현진건 등이 사실주의 소설을 발전시켰습니다.", "이광수 '무정': 최초의 현대 장편소설", "김동인: 자연주의, '감자'", "현진건: 사실주의, '운수 좋은 날'"),
                sec("2. 해방 이후 소설", "해방과 한국전쟁 이후 분단 문제, 산업화의 명암을 다루는 소설이 등장했습니다. 현대에는 다양한 실험적 기법과 주제가 시도되고 있습니다.", "분단 소설: 황순원 '학', 이호철 등", "산업화 소설: 조세희 '난장이가 쏘아올린 작은 공'", "박경리 '토지': 한국 대하소설의 대표작")
        ), "한국 현대 소설의 흐름을 이해하고 주요 작가와 작품의 특징을 설명할 수 있습니다.");
        var lq = addQuizMaterial(l4, "한국 문학사 종합 퀴즈", 2);
        addQuiz(lq, 600, List.of(
                mc(1, "시조의 형식으로 올바른 것은?", 1, "시조는 초장·중장·종장의 3장 6구 형식이며, 45자 내외의 정형시입니다.", "2장 4구", "3장 6구", "4장 8구", "자유 형식"),
                mc(2, "한국 최초의 현대 장편소설로 평가받는 작품은?", 0, "이광수의 '무정'(1917)은 한국 최초의 현대 장편소설로 평가됩니다.", "무정 (이광수)", "감자 (김동인)", "운수 좋은 날 (현진건)", "토지 (박경리)"),
                mc(3, "'서시'를 쓴 일제강점기 저항시인은?", 2, "'서시'는 윤동주의 대표작으로, 일제강점기 민족의식을 담고 있습니다.", "한용운", "이육사", "윤동주", "김소월"),
                sa(4, "판소리에서 소리꾼 옆에서 북을 치며 추임새를 넣는 사람을 무엇이라 하나요?", "고수", "판소리는 소리꾼(창자)과 고수(북 반주)로 구성됩니다.")
        ));
    }

    // ==================== 프로그래밍 콘텐츠 ====================

    private void initProgrammingContent(Course py, Course web, Course ai, Course java, Course alg) {
        // Python 프로그래밍 입문
        var py1 = addCurriculum(py, 1, "변수와 자료형", "Python의 변수 선언과 기본 자료형을 이해한다",
                "프로그래밍의 기초인 변수와 자료형을 배웁니다. int, float, str, bool 타입의 특징과 형변환을 학습합니다.");
        addLecture(py1, "변수와 자료형 이해", 1, List.of(
                sec("1. 변수와 대입", "변수는 데이터를 저장하는 공간입니다. Python에서는 타입 선언 없이 값을 대입하면 자동으로 타입이 결정됩니다. 변수명은 영문, 숫자, 밑줄만 사용하며 숫자로 시작할 수 없습니다.", "x = 10 → 정수형 변수 생성", "name = 'Alice' → 문자열 변수 생성", "변수명 규칙: snake_case 권장"),
                sec("2. 기본 자료형", "Python의 기본 자료형으로 int(정수), float(실수), str(문자열), bool(참/거짓)이 있습니다. type() 함수로 자료형을 확인하고, int(), str() 등으로 형변환합니다.", "int: 정수 (1, -5, 100)", "float: 실수 (3.14, -0.5)", "str: 문자열 ('hello'), bool: 논리값 (True/False)")
        ), "Python의 변수 선언과 기본 자료형을 이해하고 활용할 수 있습니다.");

        var py2 = addCurriculum(py, 2, "조건문과 반복문", "if/elif/else 조건문과 for/while 반복문을 작성한다",
                "프로그램의 흐름을 제어하는 조건문과 반복문을 학습합니다.");
        addLecture(py2, "조건문과 반복문", 1, List.of(
                sec("1. 조건문 if", "조건에 따라 다른 코드를 실행합니다. if-elif-else 구조를 사용하며, 들여쓰기(인덴트)로 블록을 구분합니다. 비교연산자(==, !=, <, >)와 논리연산자(and, or, not)를 활용합니다.", "if 조건: → 참일 때 실행", "elif 다른 조건: → 위 조건이 거짓이고 이 조건이 참일 때", "else: → 모든 조건이 거짓일 때"),
                sec("2. 반복문 for / while", "for문은 정해진 횟수만큼, while문은 조건이 참인 동안 반복합니다. range() 함수로 반복 범위를 지정하고, break/continue로 반복을 제어합니다.", "for i in range(10): → 0~9 반복", "while 조건: → 조건이 참인 동안 반복", "break: 반복 중단, continue: 현재 회차 건너뛰기")
        ), "조건문과 반복문을 활용해 프로그램의 흐름을 제어할 수 있습니다.");

        var py3 = addCurriculum(py, 3, "함수", "사용자 정의 함수를 작성하고 매개변수와 반환값을 이해한다",
                "코드의 재사용성을 높이는 함수의 정의, 호출, 매개변수, 반환값, 스코프를 학습합니다.");
        addLecture(py3, "함수 작성하기", 1, List.of(
                sec("1. 함수 정의와 호출", "def 키워드로 함수를 정의하고, 함수명()으로 호출합니다. 매개변수로 값을 전달받고, return으로 결과를 반환합니다.", "def 함수명(매개변수): → 함수 정의", "return 값 → 결과 반환", "기본값 매개변수: def greet(name='World')"),
                sec("2. 변수의 범위(스코프)", "함수 안에서 만든 변수는 지역 변수로, 함수 밖에서는 사용할 수 없습니다. 함수 밖의 변수는 전역 변수입니다.", "지역 변수: 함수 안에서만 유효", "전역 변수: 프로그램 전체에서 유효", "global 키워드: 함수 안에서 전역 변수 수정 시 사용")
        ), "함수를 정의하고 매개변수, 반환값, 스코프를 이해하여 코드를 모듈화할 수 있습니다.");

        var py4 = addCurriculum(py, 4, "리스트와 딕셔너리", "리스트와 딕셔너리를 활용해 데이터를 관리한다",
                "여러 데이터를 효율적으로 관리하는 리스트(순서 있음)와 딕셔너리(키-값 쌍) 자료구조를 배웁니다.");
        addLecture(py4, "리스트와 딕셔너리", 2, List.of(
                sec("1. 리스트", "리스트는 순서가 있는 데이터 모음입니다. 인덱스로 접근하며 append(), remove(), sort() 등의 메서드로 조작합니다. 리스트 컴프리헨션으로 간결하게 생성할 수 있습니다.", "생성: fruits = ['apple', 'banana']", "인덱싱: fruits[0] → 'apple'", "컴프리헨션: [x**2 for x in range(5)]"),
                sec("2. 딕셔너리", "딕셔너리는 키-값 쌍으로 데이터를 저장합니다. 키로 빠르게 값을 조회할 수 있어 데이터 관리에 유용합니다.", "생성: student = {'name': 'Kim', 'age': 15}", "조회: student['name'] → 'Kim'", "메서드: keys(), values(), items()")
        ), "리스트와 딕셔너리를 활용해 데이터를 효율적으로 저장하고 조작할 수 있습니다.");
        var pyq = addQuizMaterial(py4, "Python 입문 종합 퀴즈", 1);
        addQuiz(pyq, 600, List.of(
                mc(1, "Python에서 변수 x에 정수 10을 저장하는 올바른 코드는?", 1, "Python에서는 타입 선언 없이 x = 10으로 변수에 값을 대입합니다.", "int x = 10", "x = 10", "var x = 10", "let x = 10"),
                mc(2, "for i in range(3): 에서 i의 값 범위는?", 0, "range(3)은 0, 1, 2를 생성합니다.", "0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "1, 2"),
                mc(3, "함수에서 결과를 반환하는 키워드는?", 2, "return 키워드로 함수의 결과값을 반환합니다.", "print", "def", "return", "yield"),
                sa(4, "리스트 [1, 2, 3]에 4를 추가하는 메서드 이름은?", "append", "리스트의 append() 메서드로 끝에 요소를 추가합니다.")
        ));

        // 웹 개발 부트캠프
        var wb1 = addCurriculum(web, 1, "HTML과 CSS 기초", "웹 페이지의 구조(HTML)와 스타일(CSS)을 작성한다",
                "웹의 기본인 HTML로 구조를 만들고 CSS로 디자인을 입히는 방법을 배웁니다.");
        addLecture(wb1, "HTML & CSS 시작하기", 1, List.of(
                sec("1. HTML 기초", "HTML은 태그로 웹 페이지의 구조를 정의합니다. 시맨틱 태그(header, nav, main, footer)를 사용하면 의미 있는 구조를 만들 수 있습니다.", "<h1>~<h6>: 제목 태그", "<p>: 문단, <a>: 링크, <img>: 이미지", "시맨틱 태그: <header>, <nav>, <main>, <footer>"),
                sec("2. CSS 기초", "CSS는 HTML 요소의 스타일을 정의합니다. 선택자로 대상을 지정하고 속성: 값 형태로 스타일을 적용합니다.", "선택자 { 속성: 값; } 형태", "클래스 선택자: .class-name", "Flexbox/Grid로 레이아웃 구성")
        ), "HTML과 CSS를 사용해 기본적인 웹 페이지를 만들 수 있습니다.");

        var wb2 = addCurriculum(web, 2, "JavaScript 핵심", "JavaScript의 핵심 문법과 DOM 조작을 익힌다",
                "웹 페이지에 동적인 기능을 추가하는 JavaScript의 핵심 문법과 DOM API를 학습합니다.");
        addLecture(wb2, "JavaScript 핵심 문법", 2, List.of(
                sec("1. JavaScript 기본", "변수 선언(let, const), 함수(function, arrow function), 배열, 객체 등 JavaScript의 핵심 문법을 배웁니다.", "let/const: 변수 선언 (var 지양)", "화살표 함수: const add = (a, b) => a + b", "템플릿 리터럴: `Hello ${name}`"),
                sec("2. DOM 조작", "DOM(Document Object Model)은 HTML 문서를 객체로 표현한 것입니다. JavaScript로 DOM을 조작하여 동적 웹 페이지를 만듭니다.", "querySelector(): 요소 선택", "addEventListener(): 이벤트 처리", "innerHTML/textContent: 내용 변경")
        ), "JavaScript로 동적 웹 페이지를 만들 수 있습니다.");

        var wb3 = addCurriculum(web, 3, "React 기초", "React의 컴포넌트, State, Props 개념을 이해한다",
                "현대 웹 개발의 핵심 라이브러리인 React의 기본 개념과 사용법을 학습합니다.");
        addLecture(wb3, "React 시작하기", 2, List.of(
                sec("1. 컴포넌트와 JSX", "React는 UI를 재사용 가능한 컴포넌트 단위로 구성합니다. JSX는 JavaScript 안에서 HTML처럼 작성할 수 있는 문법 확장입니다.", "함수형 컴포넌트: function App() { return <div>...</div> }", "JSX: JavaScript + HTML 혼합 문법", "컴포넌트 재사용: <Button />, <Card /> 등"),
                sec("2. State와 Props", "State는 컴포넌트 내부의 변경 가능한 데이터이고, Props는 부모에서 자식으로 전달되는 읽기 전용 데이터입니다.", "useState(): 상태 관리 훅", "Props: 부모 → 자식 데이터 전달", "State 변경 → 자동 리렌더링")
        ), "React의 핵심 개념을 이해하고 간단한 컴포넌트를 작성할 수 있습니다.");

        var wb4 = addCurriculum(web, 4, "풀스택 프로젝트", "프론트엔드와 백엔드를 연동하는 풀스택 프로젝트를 완성한다",
                "React 프론트엔드에서 REST API를 호출하여 백엔드와 데이터를 주고받는 풀스택 웹 애플리케이션을 만듭니다.");
        addLecture(wb4, "풀스택 웹 개발", 3, List.of(
                sec("1. REST API 연동", "fetch()나 axios를 사용해 백엔드 API를 호출합니다. HTTP 메서드(GET, POST, PUT, DELETE)에 따라 CRUD 작업을 수행합니다.", "fetch('/api/data'): GET 요청", "POST: 데이터 생성, PUT: 수정, DELETE: 삭제", "async/await로 비동기 처리"),
                sec("2. 배포", "프론트엔드는 Vercel/Netlify, 백엔드는 Heroku/Railway 등으로 배포할 수 있습니다. 환경 변수로 개발/운영 환경을 분리합니다.", "프론트엔드: npm run build → 정적 파일 배포", "백엔드: Docker 컨테이너 또는 PaaS 배포", "환경 변수: .env 파일로 설정 분리")
        ), "프론트엔드와 백엔드를 연동하고 배포하는 풀스택 개발 능력을 갖출 수 있습니다.");
        var wbq = addQuizMaterial(wb4, "웹 개발 종합 퀴즈", 2);
        addQuiz(wbq, 600, List.of(
                mc(1, "HTML에서 하이퍼링크를 만드는 태그는?", 1, "<a> 태그의 href 속성으로 링크 대상을 지정합니다.", "<link>", "<a>", "<href>", "<url>"),
                mc(2, "JavaScript에서 변수 선언 시 재할당이 불가능한 키워드는?", 2, "const로 선언한 변수는 재할당할 수 없습니다.", "var", "let", "const", "def"),
                mc(3, "React에서 컴포넌트 내부의 변경 가능한 데이터를 관리하는 것은?", 0, "State는 컴포넌트 내부에서 관리되는 변경 가능한 데이터입니다.", "State", "Props", "DOM", "CSS"),
                sa(4, "HTTP 메서드 중 데이터를 삭제할 때 사용하는 것은? (영문 대문자)", "DELETE", "DELETE 메서드는 서버의 리소스를 삭제할 때 사용합니다.")
        ));

        // AI/머신러닝 기초
        var ai1 = addCurriculum(ai, 1, "인공지능 개요", "AI의 개념과 머신러닝의 기본 원리를 이해한다",
                "인공지능의 정의, 역사, 종류를 알아보고 머신러닝의 학습 원리를 개괄적으로 학습합니다.");
        addLecture(ai1, "AI와 머신러닝 개론", 2, List.of(
                sec("1. 인공지능이란", "인공지능(AI)은 인간의 지능을 모방한 컴퓨터 시스템입니다. 좁은 AI(특정 작업)와 일반 AI(범용)로 나뉘며, 현재 기술은 좁은 AI 수준입니다.", "AI: 인간 지능을 모방한 시스템", "머신러닝: 데이터에서 패턴을 학습하는 AI의 하위 분야", "딥러닝: 인공 신경망 기반 머신러닝"),
                sec("2. 머신러닝의 종류", "머신러닝은 학습 방식에 따라 지도학습, 비지도학습, 강화학습으로 분류됩니다. 데이터와 목적에 맞는 방식을 선택합니다.", "지도학습: 정답이 있는 데이터로 학습 (분류, 회귀)", "비지도학습: 정답 없이 패턴 발견 (군집화)", "강화학습: 보상을 최대화하는 행동 학습")
        ), "AI와 머신러닝의 기본 개념을 이해하고 학습 유형을 구분할 수 있습니다.");

        var ai2 = addCurriculum(ai, 2, "데이터 전처리", "Pandas로 데이터를 로드하고 전처리한다",
                "머신러닝 모델의 성능을 좌우하는 데이터 전처리 기법을 Pandas 라이브러리로 실습합니다.");
        addLecture(ai2, "데이터 전처리 실습", 2, List.of(
                sec("1. Pandas 기초", "Pandas는 Python의 데이터 분석 라이브러리입니다. DataFrame으로 표 형태 데이터를 다루고, 다양한 메서드로 조작합니다.", "import pandas as pd", "pd.read_csv(): CSV 파일 로드", "df.head(), df.info(), df.describe(): 데이터 탐색"),
                sec("2. 결측치와 정규화", "결측치(빈 값)는 삭제하거나 평균/중앙값으로 대체합니다. 정규화는 특성 값의 범위를 통일하여 모델 성능을 높입니다.", "결측치 확인: df.isnull().sum()", "결측치 처리: fillna(평균) 또는 dropna()", "정규화: Min-Max 스케일링, 표준화(Z-score)")
        ), "Pandas로 데이터를 로드하고 결측치 처리, 정규화 등 전처리를 수행할 수 있습니다.");

        var ai3 = addCurriculum(ai, 3, "지도학습", "회귀와 분류 모델을 scikit-learn으로 구현한다",
                "지도학습의 두 가지 주요 유형인 회귀(연속값 예측)와 분류(범주 예측)를 실습합니다.");
        addLecture(ai3, "회귀와 분류 모델", 3, List.of(
                sec("1. 회귀 모델", "회귀는 연속적인 수치를 예측하는 문제입니다. 선형회귀는 데이터를 가장 잘 설명하는 직선을 찾습니다.", "선형회귀: y = ax + b (최적의 a, b 찾기)", "scikit-learn: LinearRegression().fit(X, y)", "평가 지표: MSE, R² 스코어"),
                sec("2. 분류 모델", "분류는 데이터를 범주로 나누는 문제입니다. 로지스틱 회귀, 결정 트리, KNN 등 다양한 알고리즘이 있습니다.", "분류 예: 스팸 메일 판별, 질병 진단", "scikit-learn: LogisticRegression, DecisionTreeClassifier", "평가 지표: 정확도, 정밀도, 재현율, F1 스코어")
        ), "scikit-learn으로 회귀와 분류 모델을 구현하고 평가할 수 있습니다.");

        var ai4 = addCurriculum(ai, 4, "딥러닝 입문", "인공 신경망의 원리를 이해하고 TensorFlow로 구현한다",
                "인공 신경망의 구조와 학습 원리를 이해하고, TensorFlow/Keras로 간단한 모델을 만들어 봅니다.");
        addLecture(ai4, "신경망과 딥러닝", 3, List.of(
                sec("1. 인공 신경망 구조", "인공 신경망은 입력층, 은닉층, 출력층으로 구성됩니다. 각 뉴런은 가중치와 활성화 함수를 통해 입력을 변환하여 출력합니다.", "뉴런: 입력 × 가중치 + 편향 → 활성화 함수", "층(Layer): 뉴런들의 집합", "깊은 신경망 = 여러 은닉층 → 딥러닝"),
                sec("2. TensorFlow/Keras 실습", "TensorFlow의 Keras API를 사용하면 간결한 코드로 신경망을 구축할 수 있습니다. Sequential 모델에 Dense 층을 쌓아 만듭니다.", "model = Sequential([Dense(64, activation='relu'), Dense(10, activation='softmax')])", "model.compile(optimizer, loss, metrics)", "model.fit(X_train, y_train, epochs=10)")
        ), "인공 신경망의 원리를 이해하고 TensorFlow로 간단한 모델을 구현할 수 있습니다.");
        var aiq = addQuizMaterial(ai4, "AI/머신러닝 종합 퀴즈", 3);
        addQuiz(aiq, 600, List.of(
                mc(1, "정답 라벨이 있는 데이터로 학습하는 머신러닝 유형은?", 0, "지도학습은 입력과 정답 쌍으로 이루어진 데이터로 학습합니다.", "지도학습", "비지도학습", "강화학습", "전이학습"),
                mc(2, "데이터의 빈 값을 처리하는 방법이 아닌 것은?", 3, "결측치 처리 방법으로는 삭제, 평균/중앙값 대체, 보간 등이 있지만 정규화는 값의 스케일을 조정하는 것입니다.", "삭제(dropna)", "평균으로 대체", "중앙값으로 대체", "정규화"),
                mc(3, "인공 신경망에서 입력과 출력 사이에 있는 층을?", 1, "은닉층(hidden layer)은 입력층과 출력층 사이에서 데이터를 변환하는 중간 층입니다.", "입력층", "은닉층", "출력층", "합성곱층"),
                sa(4, "머신러닝에서 연속적인 수치를 예측하는 문제 유형을 무엇이라 하나요? (두 글자)", "회귀", "회귀(regression)는 연속적인 수치를 예측하는 지도학습 유형입니다.")
        ));

        // Java 객체지향 프로그래밍
        var jv1 = addCurriculum(java, 1, "클래스와 객체", "Java의 클래스 정의와 객체 생성을 이해한다",
                "객체지향 프로그래밍(OOP)의 기본 단위인 클래스와 객체의 개념, 필드, 메서드, 생성자를 학습합니다.");
        addLecture(jv1, "클래스와 객체 기초", 2, List.of(
                sec("1. 클래스 정의", "클래스는 객체의 설계도입니다. 필드(데이터)와 메서드(동작)를 정의하고, new 키워드로 객체(인스턴스)를 생성합니다.", "class Student { String name; int age; }", "필드: 객체의 상태(데이터) 저장", "메서드: 객체의 동작(행위) 정의"),
                sec("2. 생성자와 접근 제어", "생성자는 객체 생성 시 초기화를 담당합니다. 접근 제어자(public, private, protected)로 외부 접근을 제어하여 캡슐화를 구현합니다.", "생성자: 클래스명과 같은 이름, 반환 타입 없음", "private 필드 + public getter/setter = 캡슐화", "this: 현재 객체 자신을 참조")
        ), "Java 클래스를 정의하고 객체를 생성하여 캡슐화를 구현할 수 있습니다.");

        var jv2 = addCurriculum(java, 2, "상속과 다형성", "상속을 통한 코드 재사용과 다형성의 원리를 이해한다",
                "extends 키워드로 클래스를 상속하고, 오버라이딩과 업캐스팅을 통한 다형성을 학습합니다.");
        addLecture(jv2, "상속과 다형성", 2, List.of(
                sec("1. 상속(Inheritance)", "자식 클래스가 부모 클래스의 필드와 메서드를 물려받습니다. extends 키워드로 상속하며, super로 부모 클래스에 접근합니다.", "class Dog extends Animal { ... }", "super(): 부모 생성자 호출", "메서드 오버라이딩: 부모 메서드 재정의"),
                sec("2. 다형성(Polymorphism)", "같은 타입의 변수가 다양한 객체를 참조할 수 있는 성질입니다. 부모 타입으로 자식 객체를 참조하면 실행 시 실제 객체의 메서드가 호출됩니다.", "업캐스팅: Animal a = new Dog()", "동적 바인딩: 실행 시 실제 객체의 메서드 호출", "instanceof: 객체 타입 확인")
        ), "상속으로 코드를 재사용하고 다형성의 원리를 활용할 수 있습니다.");

        var jv3 = addCurriculum(java, 3, "인터페이스와 추상 클래스", "추상화의 두 가지 도구를 이해하고 활용한다",
                "추상 클래스(abstract class)와 인터페이스(interface)의 차이점과 활용 사례를 배웁니다.");
        addLecture(jv3, "인터페이스와 추상 클래스", 3, List.of(
                sec("1. 추상 클래스", "추상 메서드(구현 없는 메서드)를 포함한 클래스입니다. 직접 인스턴스를 생성할 수 없고, 상속을 통해 추상 메서드를 구현해야 합니다.", "abstract class Shape { abstract double area(); }", "일부 메서드는 구현 가능 (일반 메서드)", "공통 속성/메서드를 가진 클래스군의 기반"),
                sec("2. 인터페이스", "모든 메서드가 추상인 순수한 계약(contract)입니다. 클래스는 여러 인터페이스를 구현(implements)할 수 있어 다중 상속의 효과를 줍니다.", "interface Flyable { void fly(); }", "implements: 인터페이스 구현", "다중 구현 가능: class Duck implements Flyable, Swimmable")
        ), "추상 클래스와 인터페이스의 차이를 이해하고 적절히 활용할 수 있습니다.");

        var jv4 = addCurriculum(java, 4, "컬렉션 프레임워크", "List, Map, Set 등 컬렉션을 활용해 데이터를 관리한다",
                "Java 컬렉션 프레임워크의 주요 인터페이스와 구현체, 그리고 Stream API를 학습합니다.");
        addLecture(jv4, "컬렉션과 Stream", 3, List.of(
                sec("1. 주요 컬렉션", "List(순서 있음, 중복 허용), Set(순서 없음, 중복 불가), Map(키-값 쌍)이 핵심 인터페이스입니다. 각각 ArrayList, HashSet, HashMap이 가장 많이 쓰입니다.", "List<String> names = new ArrayList<>()", "Set<Integer> ids = new HashSet<>()", "Map<String, Integer> scores = new HashMap<>()"),
                sec("2. Stream API", "Java 8부터 도입된 Stream API로 컬렉션 데이터를 함수형으로 처리합니다. filter, map, sorted, collect 등 연산을 체이닝합니다.", "list.stream().filter(s -> s.length() > 3)", "map(): 요소 변환, sorted(): 정렬", "collect(Collectors.toList()): 결과 수집")
        ), "Java 컬렉션 프레임워크를 활용하고 Stream API로 데이터를 처리할 수 있습니다.");
        var jvq = addQuizMaterial(jv4, "Java OOP 종합 퀴즈", 2);
        addQuiz(jvq, 600, List.of(
                mc(1, "Java에서 객체를 생성하는 키워드는?", 2, "new 키워드로 클래스의 인스턴스(객체)를 생성합니다.", "create", "make", "new", "init"),
                mc(2, "Java에서 다중 상속 효과를 제공하는 것은?", 1, "Java는 클래스 다중 상속을 지원하지 않지만, 인터페이스는 여러 개를 구현할 수 있습니다.", "추상 클래스", "인터페이스", "제네릭", "어노테이션"),
                mc(3, "중복 요소를 허용하지 않는 컬렉션은?", 1, "Set은 중복 요소를 허용하지 않는 컬렉션입니다.", "List", "Set", "Map", "Queue"),
                sa(4, "부모 클래스의 메서드를 자식 클래스에서 재정의하는 것을 무엇이라 하나요? (영문)", "오버라이딩", "오버라이딩(Overriding)은 상속받은 메서드를 자식 클래스에서 재정의하는 것입니다.")
        ));

        // 알고리즘과 자료구조
        var al1 = addCurriculum(alg, 1, "배열과 문자열", "배열 탐색과 문자열 처리 알고리즘을 익힌다",
                "가장 기본적인 자료구조인 배열과 문자열에 대한 주요 알고리즘을 학습합니다.");
        addLecture(al1, "배열과 문자열 알고리즘", 2, List.of(
                sec("1. 배열 탐색", "배열에서 원하는 값을 찾는 방법으로 선형 탐색(O(n))과 이진 탐색(O(log n))이 있습니다. 이진 탐색은 정렬된 배열에서만 사용 가능합니다.", "선형 탐색: 처음부터 끝까지 하나씩 확인", "이진 탐색: 중앙값과 비교하여 탐색 범위 절반씩 축소", "투 포인터: 두 개의 포인터로 효율적 탐색"),
                sec("2. 문자열 처리", "문자열 뒤집기, 팰린드롬 판별, 아나그램 확인 등은 코딩테스트 빈출 유형입니다. 문자열은 불변(immutable)이므로 StringBuilder를 활용합니다.", "팰린드롬: 앞뒤로 읽어도 같은 문자열", "아나그램: 같은 문자 구성의 다른 단어", "시간복잡도 분석이 중요")
        ), "배열과 문자열 관련 주요 알고리즘을 구현하고 시간복잡도를 분석할 수 있습니다.");

        var al2 = addCurriculum(alg, 2, "스택과 큐", "스택과 큐의 원리와 활용 문제를 학습한다",
                "LIFO(Last In First Out) 구조의 스택과 FIFO(First In First Out) 구조의 큐를 학습합니다.");
        addLecture(al2, "스택과 큐", 2, List.of(
                sec("1. 스택(Stack)", "스택은 후입선출(LIFO) 구조입니다. push(삽입)와 pop(제거/반환) 연산이 핵심입니다. 괄호 짝 맞추기, 후위 표기법 계산 등에 활용됩니다.", "LIFO: 마지막에 넣은 것이 먼저 나옴", "push: 스택 맨 위에 삽입", "pop: 스택 맨 위에서 제거 및 반환"),
                sec("2. 큐(Queue)", "큐는 선입선출(FIFO) 구조입니다. enqueue(삽입)와 dequeue(제거/반환) 연산이 핵심입니다. BFS 탐색, 프린터 대기열 등에 활용됩니다.", "FIFO: 먼저 넣은 것이 먼저 나옴", "Java: Queue<Integer> q = new LinkedList<>()", "우선순위 큐: PriorityQueue (힙 기반)")
        ), "스택과 큐의 동작 원리를 이해하고 관련 문제를 풀 수 있습니다.");

        var al3 = addCurriculum(alg, 3, "정렬과 탐색", "주요 정렬 알고리즘과 이진 탐색을 구현한다",
                "버블, 선택, 삽입, 퀵, 머지 소트의 원리와 시간복잡도를 비교하고 이진 탐색을 심화 학습합니다.");
        addLecture(al3, "정렬 알고리즘 비교", 3, List.of(
                sec("1. O(n²) 정렬", "버블 정렬(인접 요소 비교·교환), 선택 정렬(최솟값 선택), 삽입 정렬(적절한 위치에 삽입)은 이해하기 쉽지만 느립니다(O(n²)).", "버블 정렬: 인접 요소 비교, 큰 값을 뒤로", "선택 정렬: 매 회전 최솟값을 앞으로", "삽입 정렬: 정렬된 부분에 올바른 위치 삽입"),
                sec("2. O(n log n) 정렬", "퀵 소트(피벗 기준 분할)와 머지 소트(분할 후 병합)는 효율적인 정렬 알고리즘입니다. 실무에서는 주로 이들이 사용됩니다.", "퀵 소트: 평균 O(n log n), 최악 O(n²)", "머지 소트: 항상 O(n log n), 안정 정렬", "Java: Arrays.sort() → 듀얼 피벗 퀵소트 사용")
        ), "주요 정렬 알고리즘을 이해하고 시간복잡도를 비교 분석할 수 있습니다.");

        var al4 = addCurriculum(alg, 4, "그래프와 트리", "그래프 탐색(DFS, BFS)과 이진 트리를 학습한다",
                "비선형 자료구조인 그래프와 트리의 개념, DFS/BFS 탐색 알고리즘을 학습합니다.");
        addLecture(al4, "그래프와 트리 탐색", 3, List.of(
                sec("1. 그래프 탐색", "그래프는 정점(노드)과 간선(엣지)으로 이루어진 자료구조입니다. DFS(깊이 우선)는 스택/재귀, BFS(너비 우선)는 큐를 사용합니다.", "DFS: 한 경로를 끝까지 탐색 후 백트래킹", "BFS: 가까운 노드부터 레벨별 탐색", "인접 리스트/인접 행렬로 그래프 표현"),
                sec("2. 이진 트리", "이진 트리는 각 노드가 최대 2개의 자식을 가지는 트리입니다. 전위/중위/후위 순회와 이진 탐색 트리(BST)를 학습합니다.", "전위 순회: 루트 → 왼쪽 → 오른쪽", "중위 순회: 왼쪽 → 루트 → 오른쪽 (BST에서 정렬 결과)", "BST: 왼쪽 < 루트 < 오른쪽")
        ), "그래프 탐색(DFS, BFS)을 구현하고 이진 트리를 다룰 수 있습니다.");
        var alq = addQuizMaterial(al4, "알고리즘 종합 퀴즈", 3);
        addQuiz(alq, 600, List.of(
                mc(1, "정렬된 배열에서 값을 찾는 가장 효율적인 알고리즘은?", 1, "이진 탐색은 정렬된 배열에서 O(log n) 시간에 값을 찾습니다.", "선형 탐색", "이진 탐색", "해시 탐색", "BFS"),
                mc(2, "스택의 특성은?", 0, "스택은 LIFO(Last In First Out) 구조로, 마지막에 넣은 요소가 먼저 나옵니다.", "LIFO (후입선출)", "FIFO (선입선출)", "우선순위 기반", "랜덤 접근"),
                mc(3, "퀵 소트의 평균 시간복잡도는?", 1, "퀵 소트의 평균 시간복잡도는 O(n log n)이며, 최악은 O(n²)입니다.", "O(n)", "O(n log n)", "O(n²)", "O(log n)"),
                sa(4, "그래프 탐색에서 가까운 노드부터 레벨별로 탐색하는 알고리즘은? (영문 약어 3글자)", "BFS", "BFS(Breadth-First Search, 너비 우선 탐색)는 큐를 사용하여 가까운 노드부터 탐색합니다.")
        ));
    }

    // ==================== 헬퍼 메서드 ====================

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("JSON 직렬화 실패", e);
        }
    }

    private Curriculum addCurriculum(Course course, int week, String topic, String objectives, String content) {
        return curriculumRepository.save(Curriculum.builder()
                .course(course)
                .weekNumber(week)
                .topic(topic)
                .objectives(objectives)
                .contentJson(toJson(Map.of("content", content)))
                .build());
    }

    private Material addLecture(Curriculum c, String title, int difficulty,
                                 List<Map<String, Object>> sections, String summary) {
        return materialRepository.save(Material.builder()
                .curriculum(c)
                .type(Material.MaterialType.LECTURE)
                .title(title)
                .difficulty(difficulty)
                .contentJson(toJson(Map.of("title", title, "sections", sections, "summary", summary)))
                .build());
    }

    private Material addQuizMaterial(Curriculum c, String title, int difficulty) {
        return materialRepository.save(Material.builder()
                .curriculum(c)
                .type(Material.MaterialType.QUIZ)
                .title(title)
                .difficulty(difficulty)
                .contentJson(toJson(Map.of("title", title, "sections", List.of(), "summary", "퀴즈를 통해 학습 내용을 확인해보세요.")))
                .build());
    }

    private void addQuiz(Material material, int timeLimit, List<Map<String, Object>> questions) {
        quizRepository.save(Quiz.builder()
                .material(material)
                .questionsJson(toJson(Map.of("questions", questions)))
                .timeLimit(timeLimit)
                .build());
    }

    private Map<String, Object> sec(String heading, String content, String... keyPoints) {
        return Map.of("heading", heading, "content", content, "keyPoints", List.of(keyPoints));
    }

    private Map<String, Object> mc(int num, String question, int answer, String explanation,
                                    String opt1, String opt2, String opt3, String opt4) {
        return Map.of(
                "number", num, "type", "MULTIPLE_CHOICE",
                "question", question, "options", List.of(opt1, opt2, opt3, opt4),
                "answer", answer, "explanation", explanation
        );
    }

    private Map<String, Object> sa(int num, String question, String answer, String explanation) {
        return Map.of(
                "number", num, "type", "SHORT_ANSWER",
                "question", question, "options", List.of(),
                "answer", answer, "explanation", explanation
        );
    }
}
