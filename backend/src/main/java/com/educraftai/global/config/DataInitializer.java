package com.educraftai.global.config;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 로컬 개발 환경 초기 데이터 생성기
 * 서버 시작 시 샘플 교강사 계정과 강의 데이터를 자동 생성한다.
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
    private final PasswordEncoder passwordEncoder;

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
        courseRepository.save(Course.builder().teacher(teacher1).title("기초 수학 완성반").subject("수학")
                .description("수학의 기본 개념부터 차근차근! 수와 연산, 방정식, 함수의 기초를 탄탄히 다지는 과정입니다.").build());
        courseRepository.save(Course.builder().teacher(teacher1).title("중등 수학 심화").subject("수학")
                .description("중학교 수학 심화 과정입니다. 도형, 확률과 통계, 함수 심화 문제를 다룹니다.").build());
        courseRepository.save(Course.builder().teacher(teacher1).title("고등 미적분 입문").subject("수학")
                .description("미분과 적분의 기본 개념을 이해하고 실생활 문제에 적용하는 방법을 배웁니다.").build());

        // 영어 강의
        courseRepository.save(Course.builder().teacher(teacher2).title("왕초보 영어 회화").subject("영어")
                .description("알파벳부터 시작! 일상생활에서 바로 쓸 수 있는 기초 영어 회화를 배워봅시다.").build());
        courseRepository.save(Course.builder().teacher(teacher2).title("영어 문법 마스터").subject("영어")
                .description("헷갈리는 영문법을 체계적으로 정리! 시제, 조동사, 관계대명사 등 핵심 문법을 완벽 정복합니다.").build());
        courseRepository.save(Course.builder().teacher(teacher2).title("토익 800+ 달성 전략").subject("영어")
                .description("토익 고득점을 위한 파트별 전략과 실전 문제풀이를 제공합니다.").build());

        // 과학 강의
        courseRepository.save(Course.builder().teacher(teacher3).title("재미있는 물리학").subject("과학")
                .description("일상 속 물리 현상을 이해하는 재미있는 물리학 강의! 역학, 열, 파동을 쉽게 설명합니다.").build());
        courseRepository.save(Course.builder().teacher(teacher3).title("화학 기초 다지기").subject("과학")
                .description("원소, 화합물, 화학반응의 기본을 배우고 실험으로 확인하는 화학 입문 과정입니다.").build());
        courseRepository.save(Course.builder().teacher(teacher3).title("생명과학 탐구").subject("과학")
                .description("세포, 유전, 생태계까지! 생명의 신비를 탐구하는 생명과학 강의입니다.").build());

        // 국어 강의
        courseRepository.save(Course.builder().teacher(teacher4).title("국어 독해력 향상").subject("국어")
                .description("비문학, 문학 지문을 정확하게 읽고 이해하는 독해 전략을 훈련합니다.").build());
        courseRepository.save(Course.builder().teacher(teacher4).title("논술 글쓰기 특강").subject("국어")
                .description("논리적 글쓰기의 기본부터 실전까지! 대입 논술과 자소서 작성에 필요한 글쓰기 능력을 키웁니다.").build());
        courseRepository.save(Course.builder().teacher(teacher4).title("한국 문학사 이해").subject("국어")
                .description("고전문학부터 현대문학까지 한국 문학의 흐름을 시대별로 정리합니다.").build());

        // 프로그래밍 강의
        courseRepository.save(Course.builder().teacher(teacher5).title("Python 프로그래밍 입문").subject("프로그래밍")
                .description("프로그래밍을 처음 접하는 분을 위한 Python 기초! 변수, 조건문, 반복문, 함수를 배웁니다.").build());
        courseRepository.save(Course.builder().teacher(teacher5).title("웹 개발 부트캠프").subject("프로그래밍")
                .description("HTML, CSS, JavaScript부터 React까지! 나만의 웹사이트를 만드는 풀스택 과정입니다.").build());
        courseRepository.save(Course.builder().teacher(teacher5).title("AI/머신러닝 기초").subject("프로그래밍")
                .description("인공지능의 원리를 이해하고, scikit-learn과 TensorFlow로 간단한 모델을 만들어 봅니다.").build());
        courseRepository.save(Course.builder().teacher(teacher5).title("Java 객체지향 프로그래밍").subject("프로그래밍")
                .description("Java 언어로 OOP 개념을 배우고, Spring Boot 입문까지 이어지는 체계적 과정입니다.").build());
        courseRepository.save(Course.builder().teacher(teacher5).title("알고리즘과 자료구조").subject("프로그래밍")
                .description("코딩테스트 대비! 배열, 스택, 큐, 트리, 그래프와 정렬·탐색 알고리즘을 마스터합니다.").build());

        // ====== 학생 계정 생성 (다양한 학년) ======
        User student1 = userRepository.save(User.builder()
                .email("student1@edu.com").name("홍길동").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL)
                .grade("MIDDLE_1").build());

        User student2 = userRepository.save(User.builder()
                .email("student2@edu.com").name("김영희").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL)
                .grade("HIGH_2").build());

        User student3 = userRepository.save(User.builder()
                .email("student3@edu.com").name("이철수").password(passwordEncoder.encode("1234"))
                .role(User.Role.STUDENT).socialProvider(User.SocialProvider.LOCAL)
                .grade("ELEMENTARY_5").build());

        // ====== 샘플 수강 신청 (강의 탐색 페이지에서 수강생 수가 표시되도록) ======
        var allCourses = courseRepository.findAll();
        // student1: 수학, 영어 강의 수강
        allCourses.stream().filter(c -> c.getSubject().equals("수학") || c.getSubject().equals("영어"))
                .forEach(c -> courseEnrollmentRepository.save(
                        CourseEnrollment.builder().course(c).student(student1).build()));
        // student2: 프로그래밍 강의 수강
        allCourses.stream().filter(c -> c.getSubject().equals("프로그래밍"))
                .forEach(c -> courseEnrollmentRepository.save(
                        CourseEnrollment.builder().course(c).student(student2).build()));
        // student3: 국어, 과학 강의 수강
        allCourses.stream().filter(c -> c.getSubject().equals("국어") || c.getSubject().equals("과학"))
                .forEach(c -> courseEnrollmentRepository.save(
                        CourseEnrollment.builder().course(c).student(student3).build()));

        log.info("[DataInitializer] 교강사 {}명, 학생 {}명, 강의 {}건, 수강신청 {}건 생성 완료!",
                userRepository.count() - 3, 3, courseRepository.count(), courseEnrollmentRepository.count());
    }
}
