package com.educraftai.infra.ai;

import java.util.*;

/**
 * 오프라인 커리큘럼 데이터
 * AI API 키가 없을 때 사용하는 내장 커리큘럼 템플릿.
 * 프로그래밍, 수학, 과학 등 주요 과목별 주차별 커리큘럼을 제공한다.
 */
public class OfflineCurriculumData {

    /** 주차별 커리큘럼 항목 */
    public record WeekEntry(String topic, String objectives, String content) {}

    // ==================== 템플릿 매칭 ====================

    /**
     * subject/topic 키워드를 분석해 가장 적합한 커리큘럼 템플릿을 반환
     */
    public static List<WeekEntry> findTemplate(String subject, String topic) {
        String combined = (subject + " " + topic).toLowerCase();

        // Java / 객체지향
        if (matches(combined, "java", "자바", "jdk", "객체지향", "oop", "object")) {
            return JAVA_OOP;
        }
        // Python
        if (matches(combined, "python", "파이썬")) {
            return PYTHON;
        }
        // Web / HTML / CSS / JavaScript
        if (matches(combined, "web", "웹", "html", "css", "javascript", "프론트엔드", "frontend")) {
            return WEB_DEVELOPMENT;
        }
        // React / Vue / Angular
        if (matches(combined, "react", "리액트", "vue", "angular", "spa", "컴포넌트")) {
            return REACT_FRONTEND;
        }
        // Spring / 백엔드
        if (matches(combined, "spring", "스프링", "boot", "백엔드", "backend", "서버")) {
            return SPRING_BACKEND;
        }
        // Database / SQL
        if (matches(combined, "database", "데이터베이스", "sql", "db", "mysql", "rdbms")) {
            return DATABASE;
        }
        // 자료구조
        if (matches(combined, "자료구조", "data structure", "linkedlist", "tree", "graph", "stack", "queue")) {
            return DATA_STRUCTURE;
        }
        // 알고리즘
        if (matches(combined, "알고리즘", "algorithm", "정렬", "탐색", "dp", "dynamic")) {
            return ALGORITHM;
        }
        // C / C++
        if (matches(combined, "c언어", "c++", "cpp", "c 프로그래밍", "c프로그래밍", "시스템프로그래밍")) {
            return C_PROGRAMMING;
        }
        // 모바일 / Android / iOS
        if (matches(combined, "android", "안드로이드", "ios", "모바일", "mobile", "앱", "kotlin", "swift", "flutter")) {
            return MOBILE_APP;
        }
        // 네트워크
        if (matches(combined, "네트워크", "network", "tcp", "http", "protocol", "통신")) {
            return NETWORK;
        }
        // 운영체제
        if (matches(combined, "운영체제", "operating", "os", "프로세스", "스레드", "커널")) {
            return OPERATING_SYSTEM;
        }
        // 머신러닝 / AI
        if (matches(combined, "머신러닝", "machine learning", "딥러닝", "deep learning", "ai", "인공지능", "tensorflow", "pytorch")) {
            return MACHINE_LEARNING;
        }
        // 수학
        if (matches(combined, "수학", "math", "미적분", "선형대수", "확률", "통계")) {
            return MATHEMATICS;
        }

        // 매칭 실패 시 제네릭 템플릿 생성
        return generateGenericTemplate(subject, topic);
    }

    private static boolean matches(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }

    // ==================== 제네릭 템플릿 생성 ====================

    private static List<WeekEntry> generateGenericTemplate(String subject, String topic) {
        return List.of(
            new WeekEntry(topic + " 개요 및 학습 로드맵",
                subject + "의 기본 개념을 이해하고 학습 계획을 수립한다",
                subject + " 분야의 역사와 발전 과정을 살펴봅니다. " + topic + "이(가) 왜 중요한지, 어디에 활용되는지 알아보고, 앞으로의 학습 로드맵을 설정합니다. 기본 용어와 개념을 정리합니다."),
            new WeekEntry(topic + " 기초 이론",
                topic + "의 핵심 기초 이론을 학습한다",
                topic + "을(를) 구성하는 기본 요소와 원리를 학습합니다. 핵심 개념을 정의하고, 기본적인 예제를 통해 이해를 확인합니다."),
            new WeekEntry("기본 원리와 구조",
                topic + "의 기본 원리와 내부 구조를 파악한다",
                topic + "이(가) 어떻게 동작하는지 내부 구조를 분석합니다. 주요 구성 요소 간의 관계를 이해하고, 기본적인 동작 흐름을 따라가 봅니다."),
            new WeekEntry("핵심 개념 심화",
                topic + "의 핵심 개념을 심화 학습한다",
                "앞서 배운 기초 위에 심화 개념을 쌓아 올립니다. " + topic + "에서 자주 사용되는 패턴과 기법을 익히고, 실습을 통해 적용합니다."),
            new WeekEntry("실전 활용 기법",
                topic + "을(를) 실제 상황에 적용하는 방법을 익힌다",
                "실제 문제 상황에서 " + topic + "을(를) 어떻게 활용하는지 배웁니다. 다양한 사례를 분석하고, 직접 실습하며 응용력을 키웁니다."),
            new WeekEntry("고급 주제 탐구",
                topic + "의 고급 주제를 학습한다",
                topic + " 분야의 고급 기법과 최신 동향을 탐구합니다. 효율성, 최적화, 확장성 관점에서 심화 내용을 다룹니다."),
            new WeekEntry("문제 해결과 실습",
                "종합적인 문제를 분석하고 해결하는 능력을 기른다",
                "지금까지 학습한 내용을 총동원하여 종합 문제를 해결합니다. 단계별 문제 해결 과정을 체계화하고, 다양한 접근 방법을 비교합니다."),
            new WeekEntry("프로젝트 기획 및 구현",
                topic + " 관련 소규모 프로젝트를 기획하고 구현한다",
                "학습한 내용을 바탕으로 실전 프로젝트를 진행합니다. 요구사항 분석부터 설계, 구현까지의 전 과정을 경험합니다."),
            new WeekEntry("프로젝트 완성 및 개선",
                "프로젝트를 완성하고 개선점을 도출한다",
                "프로젝트를 마무리하고, 테스트와 디버깅을 수행합니다. 코드 리뷰와 피드백을 통해 개선점을 찾고 적용합니다."),
            new WeekEntry("종합 정리 및 평가",
                "전체 학습 내용을 정리하고 성취도를 평가한다",
                subject + " 전체 학습 내용을 복습하고 핵심 개념을 정리합니다. 종합 평가를 통해 학습 성취도를 확인하고, 향후 학습 방향을 설정합니다.")
        );
    }

    // ==================== 프로그래밍 커리큘럼 템플릿 ====================

    static final List<WeekEntry> JAVA_OOP = List.of(
        new WeekEntry("Java 개발환경 구축",
            "JDK 설치, IDE 설정, Java 프로그램의 기본 구조를 이해한다",
            "JDK(Java Development Kit) 설치 및 환경변수 설정, IntelliJ IDEA / Eclipse 등 IDE 설치와 프로젝트 생성 방법을 배웁니다. 'Hello World' 프로그램을 작성하며 컴파일과 실행 과정(javac → java)을 이해합니다. Java 프로그램의 기본 구조(class, main 메서드), 주석 작성법, 코딩 컨벤션을 학습합니다."),
        new WeekEntry("변수, 자료형, 연산자",
            "Java의 기본 자료형과 연산자를 활용할 수 있다",
            "기본 자료형 8가지(byte, short, int, long, float, double, char, boolean)의 크기와 범위를 학습합니다. 참조형(String, 배열)과 기본형의 차이, 형변환(자동/강제), 리터럴 표기법을 다룹니다. 산술·비교·논리·비트·삼항 연산자와 연산자 우선순위, Scanner를 활용한 입력 처리를 실습합니다."),
        new WeekEntry("제어문 — 조건과 반복",
            "if/switch 조건문과 for/while 반복문을 능숙하게 사용할 수 있다",
            "if-else, else if, switch-case 조건문의 구조와 활용 패턴을 학습합니다. for, while, do-while 반복문과 중첩 반복, break/continue 제어를 실습합니다. 별 찍기, 구구단, 소수 판별 등 다양한 알고리즘 문제를 풀며 제어 흐름을 체화합니다."),
        new WeekEntry("배열과 문자열",
            "1·2차원 배열과 String 클래스를 활용할 수 있다",
            "1차원·2차원 배열의 선언, 초기화, 순회 방법을 학습합니다. Arrays 유틸리티 클래스(sort, copyOf, fill, toString)를 활용합니다. String 클래스의 주요 메서드(length, charAt, substring, indexOf, split, replace, equals), StringBuilder/StringBuffer 차이점, 문자열 포매팅(String.format, printf)을 실습합니다."),
        new WeekEntry("클래스와 객체",
            "클래스를 정의하고 객체를 생성·활용할 수 있다",
            "객체지향 프로그래밍(OOP)의 핵심 개념(캡슐화, 추상화)을 학습합니다. 클래스 정의(필드, 생성자, 메서드), 접근 제어자(public, private, protected, default), this 키워드를 다룹니다. 생성자 오버로딩, getter/setter 패턴, static 멤버와 인스턴스 멤버의 차이를 실습합니다. 학생 관리, 은행 계좌 등 실제 도메인 모델링 예제를 구현합니다."),
        new WeekEntry("상속과 다형성",
            "상속 관계를 설계하고 다형성을 활용할 수 있다",
            "extends를 이용한 클래스 상속, super 키워드로 부모 생성자/메서드 호출하는 방법을 학습합니다. 메서드 오버라이딩(@Override)과 오버로딩의 차이, 동적 바인딩(Dynamic Dispatch) 원리를 이해합니다. 업캐스팅/다운캐스팅, instanceof 연산자, Object 클래스(toString, equals, hashCode)를 다루며, 동물-개-고양이 같은 계층 구조 예제를 구현합니다."),
        new WeekEntry("추상 클래스와 인터페이스",
            "추상 클래스와 인터페이스의 차이를 이해하고 적절히 활용할 수 있다",
            "abstract 클래스와 abstract 메서드의 역할, 인스턴스화 불가 원칙을 학습합니다. interface 정의, implements, 다중 구현, default 메서드(Java 8+)를 다룹니다. 추상 클래스 vs 인터페이스 선택 기준, IS-A vs HAS-A 관계, 의존성 역전 원칙(DIP)을 소개합니다. 도형 넓이 계산(Shape → Circle, Rectangle), Comparable/Comparator 구현 등을 실습합니다."),
        new WeekEntry("예외 처리와 입출력",
            "Java의 예외 처리 메커니즘과 파일 I/O를 이해한다",
            "try-catch-finally, try-with-resources 구문, Checked vs Unchecked 예외 차이를 학습합니다. 사용자 정의 예외 클래스 생성, throws 선언, 예외 전파 흐름을 이해합니다. File, FileReader/FileWriter, BufferedReader/BufferedWriter를 이용한 파일 읽기/쓰기, InputStream/OutputStream 바이트 스트림도 다룹니다."),
        new WeekEntry("컬렉션 프레임워크",
            "List, Set, Map 등 주요 컬렉션을 능숙하게 활용할 수 있다",
            "Java Collections Framework의 전체 구조(Collection, List, Set, Map 인터페이스 계층)를 학습합니다. ArrayList vs LinkedList 성능 비교, HashSet vs TreeSet 정렬, HashMap vs TreeMap vs LinkedHashMap 특징을 다룹니다. Iterator, for-each 순회, Collections 유틸리티 클래스(sort, shuffle, reverse)를 실습합니다. Stack, Queue, Deque, PriorityQueue 등 특수 컬렉션도 소개합니다."),
        new WeekEntry("제네릭과 열거형",
            "제네릭 타입과 Enum을 활용하여 타입 안전한 코드를 작성할 수 있다",
            "제네릭(Generic)의 필요성, 타입 매개변수(<T, E, K, V>), 제네릭 클래스/메서드 정의를 학습합니다. 와일드카드(<?>), 상한/하한 바운드(<? extends>, <? super>), 타입 소거(Type Erasure) 개념을 다룹니다. Enum 정의, 생성자와 필드, values()/valueOf() 메서드, EnumSet/EnumMap 활용법을 실습합니다."),
        new WeekEntry("람다와 함수형 프로그래밍",
            "람다식과 함수형 인터페이스를 활용한 함수형 프로그래밍을 할 수 있다",
            "람다식(Lambda Expression) 문법, 함수형 인터페이스(@FunctionalInterface)의 개념을 학습합니다. 주요 내장 함수형 인터페이스(Predicate, Function, Consumer, Supplier, BiFunction)를 활용합니다. 메서드 참조(::), 클로저(Closure) 개념, 람다와 익명 클래스의 차이를 다룹니다."),
        new WeekEntry("스트림 API",
            "Stream API를 활용하여 컬렉션 데이터를 효율적으로 처리할 수 있다",
            "Stream의 생성(of, iterate, generate, 컬렉션.stream()), 중간 연산(filter, map, flatMap, sorted, distinct, peek), 최종 연산(collect, forEach, reduce, count, findFirst)을 학습합니다. Collectors 유틸리티(toList, groupingBy, joining, summarizingInt)를 다루고, 병렬 스트림(parallelStream)과 Optional 클래스도 실습합니다."),
        new WeekEntry("멀티스레드와 동시성",
            "Thread 생성과 동기화, 동시성 제어 기법을 이해한다",
            "Thread 클래스 상속과 Runnable 인터페이스 구현 방식의 스레드 생성, start() vs run() 차이를 학습합니다. synchronized 키워드, wait/notify, Lock/ReentrantLock, volatile을 이용한 동기화를 다룹니다. ExecutorService, ThreadPool, Future, CompletableFuture 등 java.util.concurrent 패키지의 고급 동시성 도구를 실습합니다."),
        new WeekEntry("디자인 패턴 기초",
            "주요 디자인 패턴(Singleton, Factory, Observer, Strategy)을 이해하고 적용할 수 있다",
            "GoF 디자인 패턴의 분류(생성·구조·행동)를 개관합니다. Singleton 패턴(Eager, Lazy, Enum 방식), Factory Method 패턴, Strategy 패턴을 자바 코드로 구현합니다. Observer 패턴, Template Method 패턴을 소개하고, 실제 JDK/Spring에서의 패턴 활용 사례를 분석합니다."),
        new WeekEntry("종합 프로젝트 — 설계 및 구현",
            "학습 내용을 종합하여 미니 프로젝트를 설계하고 구현한다",
            "도서 관리 시스템, 학생 성적 관리, 간단한 채팅 등 주제를 선정하고 요구사항을 분석합니다. 클래스 다이어그램 설계(UML), 패키지 구조 결정, MVC 패턴 적용을 다룹니다. 컬렉션, 스트림, 예외 처리, 파일 I/O를 조합하여 프로젝트를 구현합니다."),
        new WeekEntry("프로젝트 발표 및 종합 평가",
            "프로젝트를 완성·발표하고 학습 전체를 정리한다",
            "프로젝트 코드 리뷰, 리팩토링, 테스트(JUnit 기초)를 수행합니다. 프로젝트 발표와 피드백을 진행합니다. 전체 학습 내용 종합 퀴즈, OOP 4대 원칙(캡슐화, 상속, 다형성, 추상화) 최종 정리, 향후 학습 로드맵(Spring Framework, JPA, 디자인 패턴 심화)을 안내합니다.")
    );

    static final List<WeekEntry> PYTHON = List.of(
        new WeekEntry("Python 소개와 개발환경",
            "Python의 특징을 이해하고 개발환경을 구축한다",
            "Python 언어의 역사, 특징(인터프리터, 동적 타이핑, 간결한 문법), 활용 분야를 소개합니다. Python 3 설치, pip 패키지 관리자, VS Code / PyCharm IDE 설정, 가상환경(venv) 생성을 다룹니다. 'Hello World' 프로그램 작성, REPL(대화형 인터프리터) 활용, PEP 8 코딩 스타일 가이드를 학습합니다."),
        new WeekEntry("변수, 자료형, 연산자",
            "Python의 기본 자료형과 연산자를 이해하고 활용한다",
            "숫자형(int, float, complex), 문자열(str), 불리언(bool), None 타입을 학습합니다. 변수 할당, 동적 타이핑, type() 함수, 형변환(int(), str(), float())을 다룹니다. 산술·비교·논리·멤버십(in)·항등(is) 연산자, f-string 포매팅, input() 입력 처리를 실습합니다."),
        new WeekEntry("제어 흐름 — 조건문과 반복문",
            "if/elif/else, for, while을 사용한 프로그램 흐름 제어를 할 수 있다",
            "if-elif-else 조건문, 삼항 연산자(x if cond else y)를 학습합니다. for 반복문과 range(), enumerate(), zip() 활용, while 반복문, break/continue/else 절을 다룹니다. 리스트 컴프리헨션(List Comprehension), 중첩 반복, 별 찍기·구구단·피보나치 등 기초 알고리즘 문제를 풀어봅니다."),
        new WeekEntry("자료구조 — 리스트, 튜플, 딕셔너리, 셋",
            "Python 내장 자료구조를 능숙하게 활용할 수 있다",
            "리스트(list): 생성, 인덱싱, 슬라이싱, append/insert/remove/pop/sort/reverse 메서드를 학습합니다. 튜플(tuple): 불변성, 패킹/언패킹, namedtuple을 다룹니다. 딕셔너리(dict): key-value 구조, get/items/keys/values/update, 딕셔너리 컴프리헨션을 실습합니다. 셋(set): 집합 연산(합집합, 교집합, 차집합), frozenset도 소개합니다."),
        new WeekEntry("함수와 모듈",
            "함수를 정의하고 모듈 시스템을 활용할 수 있다",
            "함수 정의(def), 매개변수(기본값, *args, **kwargs), return, docstring을 학습합니다. 변수 스코프(local, global, nonlocal), 재귀 함수, 람다(lambda) 표현식을 다룹니다. 모듈(import, from-import, as), 패키지 구조(__init__.py), 표준 라이브러리(os, sys, math, random, datetime) 활용을 실습합니다."),
        new WeekEntry("파일 입출력과 예외 처리",
            "파일을 읽고 쓰며 예외를 적절히 처리할 수 있다",
            "open() 함수, 읽기/쓰기/추가 모드(r, w, a), with 문(컨텍스트 매니저)을 학습합니다. CSV 파일 처리(csv 모듈), JSON 파일 처리(json 모듈)를 실습합니다. try-except-else-finally 구조, 내장 예외 계층, 사용자 정의 예외(raise, class MyError(Exception))를 다룹니다."),
        new WeekEntry("객체지향 프로그래밍 기초",
            "클래스를 정의하고 OOP 기본 개념을 적용할 수 있다",
            "클래스 정의, __init__ 생성자, self, 인스턴스 변수와 메서드를 학습합니다. 접근 제어 관례(_, __), property 데코레이터, @classmethod/@staticmethod를 다룹니다. 매직 메서드(__str__, __repr__, __eq__, __len__, __add__)를 활용한 연산자 오버로딩을 실습합니다."),
        new WeekEntry("OOP 심화 — 상속과 다형성",
            "상속, 다형성, 추상 클래스를 활용한 설계를 할 수 있다",
            "클래스 상속(super()), 메서드 오버라이딩, 다중 상속과 MRO(Method Resolution Order)를 학습합니다. 추상 클래스(abc.ABC, @abstractmethod), 덕 타이핑(Duck Typing) 개념을 다룹니다. 컴포지션 vs 상속, SOLID 원칙 소개, dataclasses 모듈(@dataclass)을 실습합니다."),
        new WeekEntry("고급 Python — 데코레이터와 제너레이터",
            "데코레이터, 제너레이터, 이터레이터를 활용할 수 있다",
            "클로저(Closure) 개념, 데코레이터(@decorator) 작성법, functools.wraps를 학습합니다. 제너레이터 함수(yield), 제너레이터 표현식, itertools 모듈(chain, product, combinations)을 다룹니다. 이터레이터 프로토콜(__iter__, __next__), 코루틴 기초도 소개합니다."),
        new WeekEntry("데이터 처리 — NumPy & Pandas 기초",
            "NumPy 배열과 Pandas DataFrame으로 데이터를 처리할 수 있다",
            "NumPy: ndarray 생성, 인덱싱/슬라이싱, reshape, 브로드캐스팅, 벡터 연산을 학습합니다. Pandas: Series와 DataFrame 생성, CSV/Excel 읽기, 인덱싱(loc, iloc), 필터링을 다룹니다. 데이터 정제(결측값 처리, 타입 변환), groupby 집계, merge/concat 결합을 실습합니다."),
        new WeekEntry("데이터 시각화 — Matplotlib & Seaborn",
            "다양한 차트를 생성하여 데이터를 시각적으로 표현할 수 있다",
            "Matplotlib: figure, axes, plot/bar/scatter/hist/pie 차트 생성, 제목/범례/축 설정을 학습합니다. Seaborn: heatmap, boxplot, violinplot, pairplot 등 통계 시각화를 다룹니다. 한글 폰트 설정, 서브플롯(subplot), 차트 저장(savefig)을 실습합니다."),
        new WeekEntry("웹 크롤링과 API 활용",
            "웹 데이터 수집과 REST API 호출을 할 수 있다",
            "requests 라이브러리를 이용한 HTTP 요청(GET, POST), 상태 코드, 헤더, JSON 응답 처리를 학습합니다. BeautifulSoup을 이용한 HTML 파싱, CSS 선택자로 데이터 추출을 다룹니다. REST API 호출(공공데이터, 날씨 API), API 키 관리, 요청 제한(Rate Limit) 대응을 실습합니다."),
        new WeekEntry("테스트와 코드 품질",
            "단위 테스트를 작성하고 코드 품질을 관리할 수 있다",
            "unittest, pytest 프레임워크를 이용한 테스트 작성(assert, fixture, parametrize)을 학습합니다. 테스트 주도 개발(TDD) 사이클(Red-Green-Refactor)을 다룹니다. 타입 힌트(Type Hints), mypy 정적 분석, flake8/black 코드 포매터를 실습합니다."),
        new WeekEntry("종합 프로젝트",
            "학습 내용을 종합한 미니 프로젝트를 완성한다",
            "데이터 분석 프로젝트, 간단한 웹 애플리케이션(Flask/FastAPI), 자동화 스크립트 중 주제를 선택합니다. 요구사항 분석, 프로젝트 구조 설계, Git 버전 관리를 적용합니다. 프로젝트 구현, 테스트, 문서화(README), 발표를 진행합니다."),
        new WeekEntry("종합 정리 및 평가",
            "전체 학습 내용을 정리하고 향후 학습 방향을 설정한다",
            "Python 핵심 개념 총정리 퀴즈를 풀어봅니다. 프로젝트 코드 리뷰와 피드백, 리팩토링을 수행합니다. 향후 학습 로드맵(Django/FastAPI 웹 개발, 데이터 사이언스, 머신러닝)을 안내합니다.")
    );

    static final List<WeekEntry> WEB_DEVELOPMENT = List.of(
        new WeekEntry("웹의 동작 원리와 HTML 기초",
            "웹의 기본 구조(클라이언트-서버)를 이해하고 HTML 기본 태그를 사용할 수 있다",
            "인터넷과 웹의 차이, HTTP 프로토콜(요청/응답), URL 구조, 브라우저 렌더링 과정을 학습합니다. HTML5 문서 구조(<!DOCTYPE>, <html>, <head>, <body>), 시맨틱 태그(<header>, <nav>, <main>, <section>, <article>, <footer>)를 다룹니다. 텍스트 태그(h1~h6, p, span, strong, em), 목록(ul, ol, li), 링크(<a>), 이미지(<img>)를 실습합니다."),
        new WeekEntry("HTML 심화 — 폼, 테이블, 멀티미디어",
            "HTML 폼과 테이블을 작성하고 멀티미디어를 삽입할 수 있다",
            "폼 태그(<form>, <input>, <textarea>, <select>, <button>), input 유형(text, email, password, number, date, file, checkbox, radio)을 학습합니다. 폼 유효성 검사(required, pattern, minlength), label과 접근성을 다룹니다. 테이블(<table>, <thead>, <tbody>, <tr>, <th>, <td>), colspan/rowspan, 멀티미디어(<video>, <audio>, <iframe>)를 실습합니다."),
        new WeekEntry("CSS 기초 — 선택자, 박스 모델, 색상",
            "CSS 선택자와 박스 모델을 이해하고 기본 스타일링을 할 수 있다",
            "CSS 적용 방식(인라인, 내부, 외부 스타일시트), 선택자(태그, 클래스, ID, 자손, 자식, 형제, 가상 클래스/요소)를 학습합니다. 박스 모델(content, padding, border, margin), box-sizing: border-box를 다룹니다. 색상(hex, rgb, hsl, rgba), 배경(background-color, image, size, position), 텍스트 스타일링(font-family, size, weight, line-height, text-align)을 실습합니다."),
        new WeekEntry("CSS 레이아웃 — Flexbox와 Grid",
            "Flexbox와 Grid를 사용하여 반응형 레이아웃을 구성할 수 있다",
            "display 속성(block, inline, inline-block, none), position(static, relative, absolute, fixed, sticky)을 학습합니다. Flexbox: flex-direction, justify-content, align-items, flex-wrap, flex-grow/shrink/basis, gap을 다룹니다. CSS Grid: grid-template-columns/rows, fr 단위, grid-gap, grid-area, repeat(), auto-fill/auto-fit을 실습합니다."),
        new WeekEntry("반응형 웹 디자인과 CSS 애니메이션",
            "미디어 쿼리를 활용한 반응형 웹과 CSS 애니메이션을 구현할 수 있다",
            "반응형 웹의 개념, viewport 메타 태그, 미디어 쿼리(@media)로 브레이크포인트 설정을 학습합니다. 모바일 퍼스트 전략, 상대 단위(%, em, rem, vw, vh, vmin, vmax)를 다룹니다. transition, transform(translate, rotate, scale), @keyframes animation, hover 효과를 실습합니다."),
        new WeekEntry("JavaScript 기초 — 변수, 자료형, 함수",
            "JavaScript의 기본 문법과 함수를 활용할 수 있다",
            "JavaScript의 역할, <script> 태그, let/const/var 차이, 호이스팅을 학습합니다. 자료형(Number, String, Boolean, null, undefined, Symbol, BigInt), 템플릿 리터럴(`${}`)을 다룹니다. 함수 선언식/표현식, 화살표 함수(=>), 콜백 함수, 스코프와 클로저, 기본값 매개변수를 실습합니다."),
        new WeekEntry("JavaScript 심화 — 배열, 객체, 제어문",
            "배열·객체를 다루고 ES6+ 문법을 활용할 수 있다",
            "배열 메서드(push, pop, map, filter, reduce, find, forEach, some, every, flat), 스프레드 연산자(...)를 학습합니다. 객체 리터럴, 구조 분해 할당(Destructuring), 옵셔널 체이닝(?.), Nullish coalescing(??)을 다룹니다. for...of, for...in, try-catch, JSON(parse, stringify), 모듈(import/export)을 실습합니다."),
        new WeekEntry("DOM 조작과 이벤트 처리",
            "JavaScript로 DOM을 조작하고 이벤트를 처리할 수 있다",
            "DOM 트리 구조, querySelector/querySelectorAll, getElementById/ClassName을 학습합니다. 요소 조작(textContent, innerHTML, classList, style, setAttribute), 노드 생성/삽입/삭제(createElement, appendChild, remove)를 다룹니다. 이벤트 리스너(addEventListener), 이벤트 객체(e.target, e.preventDefault), 이벤트 버블링/캡처링, 이벤트 위임을 실습합니다."),
        new WeekEntry("비동기 프로그래밍 — Promise, Async/Await, Fetch",
            "비동기 처리 패턴과 HTTP 통신을 구현할 수 있다",
            "동기 vs 비동기, 콜 스택과 이벤트 루프, 콜백 함수와 콜백 지옥을 학습합니다. Promise(resolve, reject, then, catch, finally), Promise.all/race/allSettled를 다룹니다. async/await 문법, fetch API로 REST API 호출(GET, POST), JSON 응답 처리, 에러 핸들링을 실습합니다."),
        new WeekEntry("로컬 스토리지, 세션, 쿠키",
            "클라이언트 측 데이터 저장 방식을 활용할 수 있다",
            "localStorage와 sessionStorage의 차이, setItem/getItem/removeItem, JSON 직렬화를 학습합니다. 쿠키(document.cookie) 설정, 만료일, 보안 속성(HttpOnly, Secure, SameSite)을 다룹니다. Todo 리스트, 다크 모드 전환 등 실제 활용 예제를 구현합니다."),
        new WeekEntry("Git & GitHub 협업, 배포",
            "Git 버전 관리와 GitHub Pages 배포를 할 수 있다",
            "Git 기본 명령어(init, add, commit, status, log, diff, branch, checkout, merge)를 학습합니다. GitHub 원격 저장소(push, pull, clone, fork, PR), 브랜치 전략(Git Flow)을 다룹니다. GitHub Pages 정적 사이트 배포, Netlify/Vercel 배포를 실습합니다."),
        new WeekEntry("종합 프로젝트 — 포트폴리오 웹사이트",
            "HTML/CSS/JavaScript를 활용한 포트폴리오 사이트를 제작한다",
            "포트폴리오 사이트 기획(와이어프레임, 컬러 팔레트, 폰트 선정)을 진행합니다. 반응형 레이아웃 구현(Flexbox/Grid), 네비게이션 바, 히어로 섹션, 프로젝트 갤러리를 구현합니다. 스크롤 애니메이션, 폼 유효성 검사, API 연동(GitHub API 등)을 적용하고 배포합니다.")
    );

    static final List<WeekEntry> REACT_FRONTEND = List.of(
        new WeekEntry("React 소개와 개발환경",
            "React의 핵심 철학을 이해하고 프로젝트를 생성한다",
            "React의 탄생 배경, 가상 DOM, 컴포넌트 기반 아키텍처, 단방향 데이터 흐름 개념을 학습합니다. Vite(create-react-app 대체)로 프로젝트 생성, 폴더 구조, JSX 문법, 개발 서버 실행을 다룹니다. ES6+ 핵심 문법 복습(화살표 함수, 구조 분해, 스프레드, 모듈 import/export)을 실습합니다."),
        new WeekEntry("JSX와 컴포넌트",
            "함수형 컴포넌트를 작성하고 JSX로 UI를 표현할 수 있다",
            "JSX 규칙(단일 루트, className, camelCase 속성, 표현식 삽입 {}), Fragment(<>)를 학습합니다. 함수형 컴포넌트 정의, props 전달과 구조 분해, children props를 다룹니다. 조건부 렌더링(삼항, &&), 리스트 렌더링(map + key), 이벤트 핸들러(onClick, onChange)를 실습합니다."),
        new WeekEntry("State와 이벤트 핸들링",
            "useState로 상태를 관리하고 사용자 입력을 처리할 수 있다",
            "useState 훅의 동작 원리(불변성, 리렌더링 조건), 상태 업데이트(직접값 vs 함수형)를 학습합니다. 폼 입력 처리(controlled component), 여러 상태 관리, 상태 끌어올리기(Lifting State Up)를 다룹니다. 투두 리스트, 카운터 앱 등을 구현하며 상태 관리 패턴을 체화합니다."),
        new WeekEntry("useEffect와 생명주기",
            "사이드 이펙트를 관리하고 컴포넌트 생명주기를 이해한다",
            "useEffect 훅: 의존성 배열([], [dep]), cleanup 함수, 실행 타이밍을 학습합니다. API 호출(fetch + useEffect), 로딩/에러 상태 관리, AbortController를 다룹니다. useRef(DOM 참조, 값 유지), useMemo, useCallback으로 성능 최적화를 실습합니다."),
        new WeekEntry("React Router와 라우팅",
            "SPA 라우팅을 구현하고 페이지 간 네비게이션을 처리할 수 있다",
            "React Router v6: BrowserRouter, Routes, Route, Link, NavLink 설정을 학습합니다. 동적 라우팅(useParams), 중첩 라우팅(Outlet), 리다이렉트(Navigate), useNavigate를 다룹니다. 보호된 라우트(Protected Route), 레이아웃 패턴, 404 페이지를 실습합니다."),
        new WeekEntry("전역 상태 관리 — Context API & Zustand",
            "전역 상태 관리 패턴을 이해하고 적용할 수 있다",
            "Context API: createContext, Provider, useContext, 상태 공유 패턴을 학습합니다. Zustand: store 생성, 셀렉터, 미들웨어(persist, devtools)를 다룹니다. 인증 상태 관리(로그인/로그아웃), 테마 전환 등 실제 사용 사례를 구현합니다."),
        new WeekEntry("서버 상태 관리 — TanStack Query",
            "TanStack Query로 서버 데이터를 효율적으로 관리할 수 있다",
            "TanStack Query(React Query): useQuery, useMutation, QueryClient 설정을 학습합니다. staleTime, gcTime, refetchOnWindowFocus, enabled 옵션을 다룹니다. 낙관적 업데이트(Optimistic Update), 무한 스크롤(useInfiniteQuery), 쿼리 무효화를 실습합니다."),
        new WeekEntry("스타일링 — Tailwind CSS",
            "Tailwind CSS를 활용한 효율적인 UI 스타일링을 할 수 있다",
            "Tailwind CSS 설치 및 설정(tailwind.config.js), 유틸리티 퍼스트 방식의 장단점을 학습합니다. 레이아웃(flex, grid, gap), 타이포그래피, 색상, 반응형(sm, md, lg, xl), 다크 모드를 다룹니다. 커스텀 컴포넌트 스타일링, 애니메이션(transition, animate), cn() 유틸리티를 실습합니다."),
        new WeekEntry("폼 처리와 유효성 검사",
            "React Hook Form과 Zod로 폼을 효율적으로 관리할 수 있다",
            "React Hook Form: useForm, register, handleSubmit, formState(errors, isSubmitting)를 학습합니다. Zod 스키마 검증: z.object(), z.string().email(), zodResolver 연동을 다룹니다. 복잡한 폼(회원가입, 설문조사), 파일 업로드, 멀티 스텝 폼을 구현합니다."),
        new WeekEntry("인증과 보안",
            "JWT 기반 인증 흐름을 프론트엔드에서 구현할 수 있다",
            "JWT 구조(Header.Payload.Signature), 인증 흐름(로그인 → 토큰 저장 → 요청 시 전송)을 학습합니다. Axios 인터셉터로 토큰 자동 첨부, 401 에러 처리(로그아웃 리다이렉트)를 다룹니다. 소셜 로그인(OAuth 2.0) 프론트엔드 처리, XSS/CSRF 방어 기초를 실습합니다."),
        new WeekEntry("성능 최적화",
            "React 앱의 성능을 측정하고 최적화할 수 있다",
            "React DevTools Profiler, Chrome Performance 탭을 이용한 성능 측정을 학습합니다. React.memo, useMemo, useCallback의 올바른 사용법과 주의점을 다룹니다. 코드 스플리팅(React.lazy, Suspense), 이미지 최적화, 번들 사이즈 분석(vite-plugin-visualizer)을 실습합니다."),
        new WeekEntry("테스트 — Vitest & Testing Library",
            "컴포넌트 단위 테스트를 작성할 수 있다",
            "Vitest 설정, describe/it/expect 패턴, 테스트 러너 실행을 학습합니다. React Testing Library: render, screen, fireEvent, userEvent, waitFor를 다룹니다. 컴포넌트 렌더링 테스트, 사용자 인터랙션 테스트, API 모킹(MSW)을 실습합니다."),
        new WeekEntry("종합 프로젝트",
            "풀스택 웹 앱의 프론트엔드를 설계·구현한다",
            "프로젝트 기획(게시판, SNS, 쇼핑몰 등), 화면 설계(Figma 와이어프레임), 컴포넌트 트리 설계를 진행합니다. React Router + TanStack Query + Zustand + Tailwind CSS를 조합하여 구현합니다. API 연동, 인증, CRUD 기능, 반응형 UI를 완성합니다."),
        new WeekEntry("배포와 종합 정리",
            "프론트엔드를 배포하고 전체 학습 내용을 정리한다",
            "Vite 프로덕션 빌드(npm run build), Vercel/Netlify 배포, 환경변수 관리를 학습합니다. 프로젝트 코드 리뷰, 리팩토링, 문서화(README)를 진행합니다. React 생태계 정리, Next.js/Remix 소개, 향후 학습 로드맵을 안내합니다.")
    );

    static final List<WeekEntry> SPRING_BACKEND = List.of(
        new WeekEntry("Spring Framework 소개와 개발환경",
            "Spring Boot의 핵심 개념을 이해하고 프로젝트를 생성한다",
            "Spring Framework의 역사, Spring Boot의 등장 배경, 컨벤션 오버 설정(Convention over Configuration) 철학을 학습합니다. Spring Initializr(start.spring.io)로 프로젝트 생성, 의존성(Spring Web, JPA, H2, Lombok) 추가를 다룹니다. 프로젝트 구조(src/main/java, resources), application.yml, @SpringBootApplication을 실습합니다."),
        new WeekEntry("Spring IoC/DI와 빈 관리",
            "의존성 주입 원리를 이해하고 스프링 빈을 관리할 수 있다",
            "IoC(Inversion of Control) 컨테이너, DI(Dependency Injection) 개념, 결합도 감소 효과를 학습합니다. @Component, @Service, @Repository, @Configuration, @Bean 어노테이션을 다룹니다. 생성자 주입(권장) vs 필드 주입, @Autowired, 컴포넌트 스캔 범위를 실습합니다."),
        new WeekEntry("REST API 개발 — Controller",
            "RESTful API를 설계하고 Controller를 구현할 수 있다",
            "REST 아키텍처 원칙(리소스 중심, HTTP 메서드 활용, 무상태), API 설계 가이드를 학습합니다. @RestController, @RequestMapping, @GetMapping/@PostMapping/@PutMapping/@DeleteMapping을 다룹니다. @PathVariable, @RequestParam, @RequestBody, ResponseEntity를 실습합니다."),
        new WeekEntry("Spring Data JPA와 엔티티 설계",
            "JPA 엔티티를 설계하고 Repository를 활용할 수 있다",
            "ORM(Object-Relational Mapping) 개념, JPA vs Hibernate, @Entity, @Id, @GeneratedValue를 학습합니다. 필드 매핑(@Column, @Enumerated, @Lob), 연관관계(@ManyToOne, @OneToMany, @ManyToMany)를 다룹니다. JpaRepository 상속, 쿼리 메서드(findByEmail, findByNameContaining), JPQL, @Query를 실습합니다."),
        new WeekEntry("서비스 계층과 트랜잭션",
            "비즈니스 로직을 서비스 계층에 구현하고 트랜잭션을 관리할 수 있다",
            "계층형 아키텍처(Controller → Service → Repository) 설계 원칙을 학습합니다. @Service, @Transactional(readOnly), 트랜잭션 전파(REQUIRED, REQUIRES_NEW)를 다룹니다. DTO(Data Transfer Object) 패턴, Entity ↔ DTO 변환, 비즈니스 규칙 검증을 실습합니다."),
        new WeekEntry("예외 처리와 검증",
            "전역 예외 처리와 입력 검증을 구현할 수 있다",
            "@ExceptionHandler, @ControllerAdvice, @RestControllerAdvice로 전역 예외 처리를 학습합니다. 커스텀 예외 클래스, ErrorCode Enum, ApiResponse 공통 응답 래퍼를 다룹니다. Bean Validation(@Valid, @NotBlank, @Email, @Size, @Min, @Max, @Pattern) 입력 검증을 실습합니다."),
        new WeekEntry("Spring Security와 JWT 인증",
            "Spring Security로 인증/인가를 구현하고 JWT를 발급할 수 있다",
            "Spring Security 아키텍처(SecurityFilterChain, AuthenticationManager)를 학습합니다. JWT(JSON Web Token) 구조, 토큰 생성/검증(jjwt 라이브러리), JwtFilter 구현을 다룹니다. SecurityConfig(permitAll, authenticated), BCryptPasswordEncoder, 커스텀 UserDetailsService를 실습합니다."),
        new WeekEntry("파일 업로드와 외부 API 연동",
            "파일 업로드 처리와 외부 API 호출을 구현할 수 있다",
            "MultipartFile 처리, 파일 저장 경로 관리, 정적 리소스 서빙(ResourceHandler)을 학습합니다. RestTemplate / WebClient로 외부 API 호출, JSON 파싱(ObjectMapper)을 다룹니다. CORS 설정(@CrossOrigin, WebMvcConfigurer), 환경 변수(@Value) 관리를 실습합니다."),
        new WeekEntry("테스트 — JUnit 5 & Mockito",
            "단위 테스트와 통합 테스트를 작성할 수 있다",
            "JUnit 5 어노테이션(@Test, @BeforeEach, @DisplayName, @Nested), Assertions를 학습합니다. Mockito(@Mock, @InjectMocks, when-thenReturn, verify, BDDMockito)를 다룹니다. @SpringBootTest 통합 테스트, @WebMvcTest 컨트롤러 테스트, MockMvc를 실습합니다."),
        new WeekEntry("성능 최적화와 N+1 문제 해결",
            "JPA 쿼리 성능을 최적화하고 N+1 문제를 해결할 수 있다",
            "N+1 문제의 원인과 감지(show-sql, p6spy), Fetch Join(@EntityGraph, JPQL JOIN FETCH)을 학습합니다. default_batch_fetch_size 설정, DTO 프로젝션, QueryDSL 기초를 다룹니다. 인덱스 설계, 캐싱(@Cacheable), 페이징(Pageable) 최적화를 실습합니다."),
        new WeekEntry("배포 — Docker & CI/CD",
            "Spring Boot 앱을 Docker로 컨테이너화하고 배포할 수 있다",
            "Dockerfile 작성(멀티 스테이지 빌드), docker-compose.yml(앱 + DB + Redis)을 학습합니다. application.yml 프로필(local, docker, prod), 환경변수 주입을 다룹니다. GitHub Actions CI/CD 파이프라인(빌드 → 테스트 → 배포) 기초를 실습합니다."),
        new WeekEntry("종합 프로젝트",
            "REST API 백엔드를 설계·구현·배포한다",
            "프로젝트 주제 선정(게시판, 쇼핑몰, LMS 등), ERD 설계, API 명세 작성을 진행합니다. 엔티티, Repository, Service, Controller, Security, 예외 처리를 조합하여 구현합니다. 테스트 작성, Docker 배포, API 문서(Swagger/SpringDoc) 생성까지 완성합니다.")
    );

    static final List<WeekEntry> DATABASE = List.of(
        new WeekEntry("데이터베이스 기초와 관계형 모델",
            "데이터베이스의 기본 개념과 관계형 데이터 모델을 이해한다",
            "데이터베이스의 필요성, DBMS의 역할, 파일 시스템과의 차이를 학습합니다. 관계형 모델(릴레이션, 튜플, 속성, 도메인), 키(기본키, 외래키, 후보키, 슈퍼키)를 다룹니다. MySQL/PostgreSQL 설치, 데이터베이스 생성, 테이블 생성(CREATE TABLE), 자료형을 실습합니다."),
        new WeekEntry("SQL 기초 — SELECT와 WHERE",
            "SELECT 문으로 데이터를 조회하고 조건을 필터링할 수 있다",
            "SELECT 기본 구문(SELECT, FROM, WHERE, ORDER BY, LIMIT), 별칭(AS)을 학습합니다. 비교 연산자, BETWEEN, IN, LIKE, IS NULL, AND/OR/NOT 조건 조합을 다룹니다. DISTINCT, 집계 함수(COUNT, SUM, AVG, MAX, MIN), GROUP BY, HAVING을 실습합니다."),
        new WeekEntry("SQL 심화 — JOIN과 서브쿼리",
            "여러 테이블을 조인하고 서브쿼리를 활용할 수 있다",
            "INNER JOIN, LEFT/RIGHT OUTER JOIN, CROSS JOIN, SELF JOIN의 동작 원리를 학습합니다. 서브쿼리(스칼라, 인라인 뷰, WHERE 절), EXISTS, ANY/ALL을 다룹니다. 복잡한 조인 쿼리, 3개 이상 테이블 조인, 실무 쿼리 작성을 실습합니다."),
        new WeekEntry("DML과 DDL — 데이터 조작과 정의",
            "데이터를 삽입, 수정, 삭제하고 테이블 구조를 변경할 수 있다",
            "INSERT INTO (단건/다건), UPDATE SET WHERE, DELETE FROM WHERE 구문을 학습합니다. CREATE TABLE(제약 조건: PRIMARY KEY, NOT NULL, UNIQUE, CHECK, DEFAULT, FOREIGN KEY)을 다룹니다. ALTER TABLE(ADD, MODIFY, DROP COLUMN), DROP TABLE, TRUNCATE를 실습합니다."),
        new WeekEntry("인덱스와 뷰",
            "인덱스로 쿼리 성능을 향상시키고 뷰를 활용할 수 있다",
            "인덱스의 원리(B-Tree, Hash), CREATE INDEX, 인덱스 설계 전략(카디널리티, 선택도)을 학습합니다. 실행 계획(EXPLAIN) 분석, 풀 테이블 스캔 vs 인덱스 스캔을 다룹니다. VIEW 생성(CREATE VIEW), 가상 테이블의 장단점, 업데이트 가능 뷰를 실습합니다."),
        new WeekEntry("ER 모델링과 정규화",
            "ER 다이어그램을 설계하고 정규화를 적용할 수 있다",
            "ER(Entity-Relationship) 모델: 엔티티, 속성, 관계(1:1, 1:N, M:N), 카디널리티를 학습합니다. 정규화: 1NF, 2NF, 3NF, BCNF의 개념과 적용, 함수적 종속성을 다룹니다. 반정규화(De-normalization)의 필요성, 실무 ERD 설계 도구(ERDCloud, dbdiagram.io) 사용을 실습합니다."),
        new WeekEntry("트랜잭션과 동시성 제어",
            "트랜잭션의 ACID 속성과 동시성 제어를 이해한다",
            "트랜잭션 개념, ACID 속성(원자성, 일관성, 고립성, 지속성), COMMIT/ROLLBACK을 학습합니다. 동시성 문제(Dirty Read, Non-repeatable Read, Phantom Read), 격리 수준(READ UNCOMMITTED ~ SERIALIZABLE)을 다룹니다. 락(Shared Lock, Exclusive Lock), 데드락 감지와 해결을 실습합니다."),
        new WeekEntry("저장 프로시저와 함수",
            "저장 프로시저, 함수, 트리거를 작성할 수 있다",
            "저장 프로시저(CREATE PROCEDURE), 매개변수(IN, OUT, INOUT), 변수 선언, 조건·반복문을 학습합니다. 사용자 정의 함수(CREATE FUNCTION), 스칼라 함수를 다룹니다. 트리거(CREATE TRIGGER, BEFORE/AFTER, INSERT/UPDATE/DELETE)의 활용과 주의점을 실습합니다."),
        new WeekEntry("NoSQL과 Redis 기초",
            "NoSQL 데이터베이스의 개념과 Redis를 이해한다",
            "NoSQL의 분류(Key-Value, Document, Column-Family, Graph), CAP 정리를 학습합니다. MongoDB 기초(Document 구조, CRUD, find 쿼리)를 다룹니다. Redis: 데이터 타입(String, List, Set, Hash, Sorted Set), 캐싱 전략(Cache Aside, Write Through)을 실습합니다."),
        new WeekEntry("종합 프로젝트 — 데이터베이스 설계와 구현",
            "실제 서비스의 데이터베이스를 설계하고 구현한다",
            "서비스 요구사항 분석(쇼핑몰, 예약 시스템 등), ERD 설계, 정규화 적용을 진행합니다. 테이블 생성, 인덱스 설계, 초기 데이터 입력, 복잡 쿼리 작성을 수행합니다. 성능 튜닝(EXPLAIN 분석), 프로시저/트리거 적용, 발표를 완성합니다.")
    );

    static final List<WeekEntry> DATA_STRUCTURE = List.of(
        new WeekEntry("자료구조 개요와 알고리즘 분석",
            "자료구조의 종류와 알고리즘 시간·공간 복잡도를 이해한다",
            "자료구조의 분류(선형 vs 비선형, 정적 vs 동적)와 추상 자료형(ADT) 개념을 학습합니다. 알고리즘 성능 분석: Big-O 표기법(O(1), O(log n), O(n), O(n log n), O(n²), O(2^n))을 다룹니다. 시간·공간 복잡도 계산 연습, 최선/평균/최악 케이스 분석을 실습합니다."),
        new WeekEntry("배열과 연결 리스트",
            "배열과 연결 리스트의 구조·연산·성능을 비교할 수 있다",
            "배열(Array)의 메모리 구조, 인덱싱(O(1)), 삽입/삭제(O(n)) 특성을 학습합니다. 단일 연결 리스트(Singly Linked List): 노드 구조, 삽입/삭제/탐색 구현을 다룹니다. 이중 연결 리스트(Doubly), 원형 연결 리스트(Circular), 배열 vs 연결 리스트 성능 비교를 실습합니다."),
        new WeekEntry("스택과 큐",
            "스택과 큐를 구현하고 활용할 수 있다",
            "스택(Stack): LIFO 원리, push/pop/peek/isEmpty, 배열·연결 리스트 기반 구현을 학습합니다. 스택 활용: 괄호 검사, 후위 표기식 계산, 함수 호출 스택(재귀)을 다룹니다. 큐(Queue): FIFO 원리, enqueue/dequeue, 원형 큐, 덱(Deque), 우선순위 큐를 실습합니다."),
        new WeekEntry("해시 테이블",
            "해시 함수와 충돌 해결 기법을 이해하고 해시 테이블을 구현할 수 있다",
            "해시 함수의 역할, 좋은 해시 함수의 조건, 나눗셈법/곱셈법을 학습합니다. 충돌 해결: 체이닝(Chaining), 개방 주소법(Linear Probing, Quadratic Probing, Double Hashing)을 다룹니다. 해시 테이블의 시간 복잡도(평균 O(1), 최악 O(n)), 적재율(Load Factor), 리해싱을 실습합니다."),
        new WeekEntry("트리 기초 — 이진 트리, BST",
            "트리 구조와 이진 탐색 트리(BST)를 이해하고 구현할 수 있다",
            "트리 용어(루트, 부모, 자식, 리프, 깊이, 높이, 차수), 이진 트리(Binary Tree)의 종류(완전, 포화, 편향)를 학습합니다. 트리 순회: 전위(Preorder), 중위(Inorder), 후위(Postorder), 레벨(Level-order, BFS)을 다룹니다. 이진 탐색 트리(BST): 삽입, 탐색, 삭제 연산과 O(log n) 성능을 실습합니다."),
        new WeekEntry("균형 트리 — AVL, Red-Black",
            "균형 이진 탐색 트리의 원리와 회전 연산을 이해한다",
            "BST의 편향 문제, 균형 트리의 필요성을 학습합니다. AVL 트리: 균형 인수(Balance Factor), LL/RR/LR/RL 회전을 다룹니다. Red-Black 트리: 5가지 성질, 삽입 시 리밸런싱, Java의 TreeMap/TreeSet 내부 구현을 소개합니다."),
        new WeekEntry("힙과 우선순위 큐",
            "힙 구조를 이해하고 우선순위 큐를 구현할 수 있다",
            "힙(Heap)의 정의(최대 힙, 최소 힙), 배열 기반 구현(부모/자식 인덱스 관계)을 학습합니다. 삽입(Heapify Up)과 삭제(Heapify Down) 알고리즘, 힙 정렬(Heap Sort, O(n log n))을 다룹니다. 우선순위 큐 ADT, Java PriorityQueue, 다익스트라 알고리즘에서의 활용을 실습합니다."),
        new WeekEntry("그래프 기초",
            "그래프의 표현 방법과 기본 순회 알고리즘을 이해한다",
            "그래프 용어(정점, 간선, 차수, 경로, 사이클), 방향/무방향, 가중치 그래프를 학습합니다. 그래프 표현: 인접 행렬(Adjacency Matrix), 인접 리스트(Adjacency List)를 다룹니다. BFS(너비 우선 탐색), DFS(깊이 우선 탐색) 구현, 연결 요소 탐색을 실습합니다."),
        new WeekEntry("그래프 알고리즘 심화",
            "최단 경로, 최소 신장 트리 알고리즘을 이해하고 구현할 수 있다",
            "다익스트라(Dijkstra) 알고리즘: 단일 출발점 최단 경로, 우선순위 큐 활용을 학습합니다. 벨만-포드(Bellman-Ford), 플로이드-워셜(Floyd-Warshall) 최단 경로를 다룹니다. 최소 신장 트리: 크루스칼(Kruskal, Union-Find), 프림(Prim) 알고리즘을 실습합니다."),
        new WeekEntry("종합 정리와 문제 풀이",
            "전체 자료구조를 비교 정리하고 종합 문제를 해결한다",
            "자료구조별 시간·공간 복잡도 비교표를 정리합니다. 상황별 최적 자료구조 선택 기준(삽입/삭제 빈도, 탐색 패턴, 메모리 제약)을 다룹니다. 코딩 테스트 기출 문제를 풀며 적절한 자료구조를 선택하고 구현하는 실전 연습을 합니다.")
    );

    static final List<WeekEntry> ALGORITHM = List.of(
        new WeekEntry("알고리즘 입문과 복잡도 분석",
            "알고리즘의 개념과 시간·공간 복잡도 분석 방법을 이해한다",
            "알고리즘의 정의, 좋은 알고리즘의 조건(정확성, 효율성), 의사코드(Pseudocode) 작성법을 학습합니다. Big-O, Big-Omega, Big-Theta 표기법, 주요 복잡도 클래스(O(1) ~ O(n!)) 비교를 다룹니다. 루프 분석, 재귀 점화식(T(n) = aT(n/b) + f(n)), 마스터 정리 기초를 실습합니다."),
        new WeekEntry("정렬 알고리즘",
            "주요 정렬 알고리즘을 이해하고 구현할 수 있다",
            "기본 정렬: 버블(Bubble), 선택(Selection), 삽입(Insertion) 정렬의 원리와 O(n²) 성능을 학습합니다. 고급 정렬: 병합 정렬(Merge Sort, 분할 정복), 퀵 정렬(Quick Sort, 피벗 선택 전략)의 O(n log n)을 다룹니다. 힙 정렬, 계수 정렬(Counting Sort), 기수 정렬(Radix Sort), 안정/불안정 정렬 비교를 실습합니다."),
        new WeekEntry("탐색 알고리즘",
            "선형 탐색과 이진 탐색을 이해하고 응용할 수 있다",
            "선형 탐색(O(n)), 이진 탐색(O(log n))의 원리와 전제 조건(정렬된 배열)을 학습합니다. 이진 탐색 변형: Lower Bound, Upper Bound, 매개변수 탐색(Parametric Search)을 다룹니다. 해싱 기반 탐색, 보간 탐색(Interpolation Search)을 소개하고 실전 문제를 풀어봅니다."),
        new WeekEntry("재귀와 분할 정복",
            "재귀적 사고와 분할 정복 패러다임을 적용할 수 있다",
            "재귀 함수의 구조(기저 조건, 재귀 호출), 호출 스택 시각화, 꼬리 재귀를 학습합니다. 분할 정복(Divide and Conquer) 전략: 분할 → 정복 → 결합 단계를 다룹니다. 거듭제곱(O(log n)), 카라추바 곱셈, 가장 가까운 점 쌍(Closest Pair) 문제를 실습합니다."),
        new WeekEntry("동적 프로그래밍(DP)",
            "DP의 원리를 이해하고 점화식을 세워 문제를 해결할 수 있다",
            "최적 부분 구조(Optimal Substructure), 중복 부분 문제(Overlapping Subproblems) 개념을 학습합니다. Top-down(메모이제이션) vs Bottom-up(테이블 채우기) 접근법을 다룹니다. 피보나치, 계단 오르기, 배낭 문제(Knapsack), LCS(최장 공통 부분 수열), LIS(최장 증가 부분 수열) 등을 실습합니다."),
        new WeekEntry("그리디 알고리즘",
            "그리디 전략의 적용 조건을 판단하고 문제를 해결할 수 있다",
            "그리디(탐욕) 알고리즘의 원리, 최적해 보장 조건(그리디 선택 속성, 최적 부분 구조)을 학습합니다. 활동 선택 문제(Activity Selection), 분할 가능 배낭(Fractional Knapsack), 거스름돈을 다룹니다. 허프만 코딩(Huffman Coding), 크루스칼/프림 알고리즘(MST)을 실습합니다."),
        new WeekEntry("그래프 탐색 알고리즘",
            "DFS, BFS를 활용한 그래프 탐색 문제를 해결할 수 있다",
            "DFS(깊이 우선 탐색): 재귀/스택 구현, 방문 체크, 사이클 검출을 학습합니다. BFS(너비 우선 탐색): 큐 구현, 최단 거리, 레벨별 탐색을 다룹니다. 위상 정렬(Topological Sort), 강한 연결 요소(SCC), 이분 그래프 판별을 실습합니다."),
        new WeekEntry("최단 경로 알고리즘",
            "다양한 최단 경로 알고리즘을 이해하고 적용할 수 있다",
            "다익스트라(Dijkstra): 양의 가중치, 우선순위 큐, O((V+E)log V)를 학습합니다. 벨만-포드(Bellman-Ford): 음의 가중치 허용, 음의 사이클 검출, O(VE)를 다룹니다. 플로이드-워셜(Floyd-Warshall): 모든 쌍 최단 경로, O(V³)를 실습합니다."),
        new WeekEntry("백트래킹",
            "백트래킹 기법으로 조합 탐색 문제를 해결할 수 있다",
            "백트래킹(Backtracking)의 개념: 상태 공간 트리, 가지치기(Pruning)를 학습합니다. N-Queen 문제, 스도쿠 풀기, 부분 집합의 합(Subset Sum)을 다룹니다. 순열(Permutation), 조합(Combination) 생성, 문자열 문제를 실습합니다."),
        new WeekEntry("종합 문제 풀이 및 코딩 테스트 대비",
            "다양한 알고리즘을 조합하여 종합 문제를 해결한다",
            "문제 유형별 접근 전략(정렬, 탐색, DP, 그래프, 그리디, 백트래킹) 선택 기준을 정리합니다. 코딩 테스트 실전 문제(백준, 프로그래머스 기출)를 시간 제한 내 풀어봅니다. 코드 최적화, 엣지 케이스 처리, 시간 복잡도 예측 연습을 합니다.")
    );

    static final List<WeekEntry> C_PROGRAMMING = List.of(
        new WeekEntry("C 언어 소개와 개발환경",
            "C 언어의 특징을 이해하고 개발환경을 구축한다",
            "C 언어의 역사(Dennis Ritchie, UNIX), 특징(절차적, 저수준 접근, 이식성), 활용 분야를 학습합니다. GCC/Clang 컴파일러 설치, VS Code/CLion IDE 설정, 컴파일 과정(전처리 → 컴파일 → 어셈블 → 링킹)을 다룹니다. 'Hello World', printf/scanf, #include, main 함수 구조를 실습합니다."),
        new WeekEntry("변수, 자료형, 연산자",
            "C의 기본 자료형과 연산자를 활용할 수 있다",
            "기본 자료형(char, short, int, long, float, double), sizeof 연산자, 형변환(암시적/명시적)을 학습합니다. 상수(const, #define, enum), 변수의 메모리 표현(2의 보수, IEEE 754)을 다룹니다. 산술·비교·논리·비트 연산자, 연산자 우선순위, 증감 연산자(++/--)를 실습합니다."),
        new WeekEntry("제어문과 함수",
            "조건·반복문을 사용하고 함수를 정의·호출할 수 있다",
            "if-else, switch-case, for, while, do-while, break/continue, goto를 학습합니다. 함수 정의(반환형, 매개변수, 프로토타입 선언), Call by Value를 다룹니다. 재귀 함수(팩토리얼, 피보나치, 하노이 탑), 지역/전역/정적 변수 스코프를 실습합니다."),
        new WeekEntry("배열과 문자열",
            "1·2차원 배열과 C 스타일 문자열을 다룰 수 있다",
            "1차원 배열 선언, 초기화, 인덱스 접근, 배열과 메모리 레이아웃을 학습합니다. 2차원 배열, 행렬 연산, 배열 매개변수(크기 전달)를 다룹니다. C 문자열(char[]), string.h 함수(strlen, strcpy, strcat, strcmp, strstr, strtok)를 실습합니다."),
        new WeekEntry("포인터 기초",
            "포인터의 개념과 기본 사용법을 이해한다",
            "포인터 변수 선언(*), 주소 연산자(&), 역참조(*), NULL 포인터를 학습합니다. 포인터와 배열의 관계(배열명 = 시작 주소), 포인터 산술(p+1, p++)을 다룹니다. 함수에서의 포인터 활용(Call by Reference 효과), swap 함수 구현을 실습합니다."),
        new WeekEntry("포인터 심화와 동적 메모리",
            "이중 포인터, 동적 메모리 할당을 활용할 수 있다",
            "이중 포인터(**), 포인터 배열 vs 배열 포인터, 함수 포인터를 학습합니다. 동적 메모리: malloc, calloc, realloc, free, 메모리 누수 방지를 다룹니다. 동적 배열, 동적 2차원 배열 생성, Valgrind 메모리 디버깅을 실습합니다."),
        new WeekEntry("구조체와 공용체",
            "구조체를 정의하고 활용하여 복합 데이터를 관리할 수 있다",
            "struct 정의, 멤버 접근(.), 포인터 접근(->), 초기화, typedef를 학습합니다. 구조체 배열, 구조체 포인터, 함수 매개변수로서의 구조체를 다룹니다. 공용체(union), 열거형(enum), 비트 필드(Bit Field), 자기 참조 구조체(연결 리스트)를 실습합니다."),
        new WeekEntry("파일 입출력",
            "파일을 읽고 쓰며 이진 파일을 처리할 수 있다",
            "파일 포인터(FILE *), fopen/fclose, 파일 모드(r, w, a, rb, wb)를 학습합니다. 텍스트 파일: fprintf/fscanf, fgets/fputs, fgetc/fputc를 다룹니다. 이진 파일: fread/fwrite, fseek/ftell/rewind, 구조체 직렬화를 실습합니다."),
        new WeekEntry("전처리기와 분할 컴파일",
            "전처리기 지시문과 다중 파일 프로젝트를 관리할 수 있다",
            "#include, #define(매크로, 함수형 매크로), #ifdef/#ifndef/가드를 학습합니다. 헤더 파일(.h)과 소스 파일(.c) 분리, extern 선언, static 링크를 다룹니다. Makefile 작성 기초(타겟, 의존성, 명령), 분할 컴파일 프로젝트를 실습합니다."),
        new WeekEntry("자료구조 구현과 종합 프로젝트",
            "C로 연결 리스트, 스택, 큐를 구현하고 종합 프로젝트를 완성한다",
            "단일/이중 연결 리스트 구현(삽입, 삭제, 탐색), 스택(배열/연결 리스트 기반)을 구현합니다. 큐, 이진 탐색 트리(BST) 기초 구현, 메모리 관리를 다룹니다. 종합 프로젝트(학생 관리 시스템, 파일 기반 주소록 등)를 구현하고 발표합니다.")
    );

    static final List<WeekEntry> MOBILE_APP = List.of(
        new WeekEntry("모바일 앱 개발 개요",
            "모바일 플랫폼과 개발 방식을 이해한다",
            "네이티브(Android/iOS) vs 크로스 플랫폼(Flutter, React Native)의 장단점을 학습합니다. Android 개발 환경(Android Studio, Kotlin), iOS 개발 환경(Xcode, Swift)을 소개합니다. 간단한 앱 프로젝트 생성, 에뮬레이터 실행, 프로젝트 구조를 실습합니다."),
        new WeekEntry("UI 기초 — 레이아웃과 위젯",
            "기본 UI 컴포넌트와 레이아웃을 구성할 수 있다",
            "레이아웃 시스템(LinearLayout, ConstraintLayout / HStack, VStack, ZStack)을 학습합니다. 텍스트, 버튼, 이미지, 입력 필드, 리스트 뷰 등 기본 위젯을 다룹니다. 스타일링(색상, 폰트, 크기, 패딩, 마진), 다크 모드 대응을 실습합니다."),
        new WeekEntry("네비게이션과 화면 전환",
            "여러 화면 간의 네비게이션을 구현할 수 있다",
            "화면 전환(Activity/Fragment, NavigationController), 데이터 전달을 학습합니다. 탭 바, 드로어(사이드 메뉴), 바텀 내비게이션 구현을 다룹니다. 딥 링크, 화면 전환 애니메이션을 실습합니다."),
        new WeekEntry("상태 관리와 생명주기",
            "앱의 생명주기와 상태 관리를 이해한다",
            "Activity/ViewController 생명주기(onCreate-onDestroy, viewDidLoad-viewWillDisappear)를 학습합니다. 상태 관리 패턴(ViewModel, StateFlow, Combine)을 다룹니다. 화면 회전, 백그라운드 전환 시 데이터 보존을 실습합니다."),
        new WeekEntry("리스트와 RecyclerView",
            "동적 리스트 UI를 효율적으로 구현할 수 있다",
            "RecyclerView(Android) / UITableView(iOS) / ListView(Flutter)의 구조와 어댑터 패턴을 학습합니다. ViewHolder 패턴, 아이템 레이아웃, 클릭 이벤트 처리를 다룹니다. 무한 스크롤, 새로고침(Pull-to-Refresh), 아이템 애니메이션을 실습합니다."),
        new WeekEntry("네트워크 통신 — REST API",
            "REST API를 호출하고 응답 데이터를 표시할 수 있다",
            "HTTP 통신 라이브러리(Retrofit, Alamofire, http/dio), JSON 파싱을 학습합니다. 비동기 처리(Coroutine, async/await, Combine), 로딩/에러 상태 관리를 다룹니다. 실제 API 연동(날씨, 뉴스 등), 이미지 로딩(Glide, Kingfisher)을 실습합니다."),
        new WeekEntry("로컬 데이터 저장",
            "앱 내 데이터를 저장하고 관리할 수 있다",
            "SharedPreferences/UserDefaults(키-값 저장), SQLite/Room/Core Data(로컬 DB)를 학습합니다. CRUD 구현, 마이그레이션, 데이터 암호화를 다룹니다. 오프라인 모드 지원, 캐시 전략을 실습합니다."),
        new WeekEntry("인증과 소셜 로그인",
            "사용자 인증과 소셜 로그인을 구현할 수 있다",
            "JWT 기반 인증 흐름, 토큰 저장(Keystore/Keychain), 자동 로그인을 학습합니다. OAuth 2.0 소셜 로그인(Google, Kakao, Apple Sign-in)을 다룹니다. 회원가입/로그인/로그아웃 화면과 흐름을 구현합니다."),
        new WeekEntry("카메라, 갤러리, 권한 처리",
            "카메라/갤러리 연동과 런타임 권한을 처리할 수 있다",
            "런타임 권한 요청(카메라, 저장소, 위치), 권한 거부 시 대응을 학습합니다. 카메라 촬영, 갤러리 이미지 선택, 이미지 크롭/리사이즈를 다룹니다. 위치 서비스(GPS), 지도 연동(Google Maps/Apple Maps)을 실습합니다."),
        new WeekEntry("종합 프로젝트",
            "실전 모바일 앱을 기획, 설계, 구현, 배포한다",
            "앱 기획(와이어프레임, 사용자 스토리), UI/UX 설계를 진행합니다. 네트워크 통신, 로컬 저장, 인증을 결합한 완성도 높은 앱을 구현합니다. 테스트, 앱 아이콘/스플래시 화면 설정, 스토어 배포(Play Store/App Store) 준비를 합니다.")
    );

    static final List<WeekEntry> NETWORK = List.of(
        new WeekEntry("네트워크 기초와 OSI 7계층",
            "네트워크의 기본 개념과 OSI 참조 모델을 이해한다",
            "네트워크의 정의, 분류(LAN, WAN, MAN), 토폴로지(버스, 스타, 링, 메시)를 학습합니다. OSI 7계층(물리, 데이터링크, 네트워크, 전송, 세션, 표현, 응용)의 역할과 데이터 캡슐화를 다룹니다. TCP/IP 4계층 모델과 OSI 비교, 각 계층의 대표 프로토콜을 정리합니다."),
        new WeekEntry("물리 계층과 데이터 링크 계층",
            "물리적 전송 매체와 데이터 링크 프로토콜을 이해한다",
            "전송 매체(UTP, 광섬유, 무선), 대역폭, 전송 속도, 인코딩 방식을 학습합니다. 이더넷(Ethernet) 프레임 구조, MAC 주소, CSMA/CD, 스위치 동작 원리를 다룹니다. ARP 프로토콜, VLAN, STP(Spanning Tree Protocol)를 소개합니다."),
        new WeekEntry("네트워크 계층 — IP와 라우팅",
            "IP 주소 체계와 라우팅 프로토콜을 이해한다",
            "IPv4 주소 구조, 서브넷 마스크, CIDR 표기법, 서브네팅 계산을 학습합니다. 라우팅의 개념, 정적/동적 라우팅, 라우팅 테이블, TTL을 다룹니다. ICMP(ping, traceroute), NAT, IPv6 기초를 실습합니다."),
        new WeekEntry("전송 계층 — TCP와 UDP",
            "TCP와 UDP의 동작 원리를 비교하고 이해한다",
            "TCP: 3-way handshake, 4-way handshake, 시퀀스 번호, ACK, 흐름 제어(슬라이딩 윈도우)를 학습합니다. TCP 혼잡 제어(Slow Start, Congestion Avoidance, Fast Retransmit)를 다룹니다. UDP: 비연결, 데이터그램, 활용 사례(DNS, VoIP, 게임), TCP vs UDP 비교를 실습합니다."),
        new WeekEntry("응용 계층 — HTTP, DNS, DHCP",
            "주요 응용 계층 프로토콜의 동작 원리를 이해한다",
            "HTTP/1.1 vs HTTP/2 vs HTTP/3(QUIC), 요청/응답 구조, 상태 코드, 헤더를 학습합니다. DNS: 도메인 네임 시스템, 재귀/반복 질의, DNS 레코드(A, AAAA, CNAME, MX, NS)를 다룹니다. DHCP 동작(DORA), 이메일 프로토콜(SMTP, POP3, IMAP), FTP를 소개합니다."),
        new WeekEntry("네트워크 보안 기초",
            "네트워크 보안 위협과 방어 기법을 이해한다",
            "대칭키/비대칭키 암호화(AES, RSA), 해시 함수(SHA-256), 디지털 서명을 학습합니다. SSL/TLS 동작(핸드셰이크, 인증서, HTTPS), PKI(공개키 기반 구조)를 다룹니다. 방화벽, IDS/IPS, VPN, 주요 공격 유형(DDoS, 스니핑, 스푸핑, MITM)을 소개합니다."),
        new WeekEntry("소켓 프로그래밍 실습",
            "TCP/UDP 소켓 프로그래밍을 구현할 수 있다",
            "소켓 API(socket, bind, listen, accept, connect, send, recv, close) 흐름을 학습합니다. TCP 에코 서버/클라이언트, 채팅 프로그래밍(Java/Python)을 다룹니다. UDP 소켓, 멀티스레드 서버, 논블로킹 I/O를 실습합니다."),
        new WeekEntry("종합 정리와 실습",
            "네트워크 전체 내용을 정리하고 실습 프로젝트를 완성한다",
            "Wireshark를 이용한 패킷 캡처와 분석 실습을 진행합니다. 네트워크 구성 시뮬레이션(Cisco Packet Tracer), 서브네팅 문제를 풀어봅니다. 전체 내용 종합 퀴즈, 네트워크 관련 자격증(CCNA) 소개, 향후 학습 방향을 안내합니다.")
    );

    static final List<WeekEntry> OPERATING_SYSTEM = List.of(
        new WeekEntry("운영체제 개요",
            "운영체제의 역할과 구조를 이해한다",
            "운영체제의 정의, 역할(자원 관리, 인터페이스 제공), 발전 과정(배치→멀티프로그래밍→시분할→실시간)을 학습합니다. 커널(Kernel)과 셸(Shell), 시스템 콜(System Call), 이중 모드(커널 모드/사용자 모드)를 다룹니다. 운영체제 구조: 단일 커널, 마이크로커널, 하이브리드 비교를 소개합니다."),
        new WeekEntry("프로세스 관리",
            "프로세스의 개념, 상태, 생성/종료를 이해한다",
            "프로세스 정의, PCB(Process Control Block), 프로세스 상태(생성, 준비, 실행, 대기, 종료) 전이를 학습합니다. fork(), exec(), wait() 시스템 콜, 프로세스 간 통신(IPC: 파이프, 메시지 큐, 공유 메모리)을 다룹니다. 컨텍스트 스위칭(Context Switching) 비용, 프로세스 vs 스레드를 비교합니다."),
        new WeekEntry("스레드와 동시성",
            "스레드의 개념과 동시성 프로그래밍을 이해한다",
            "스레드의 정의, 멀티스레드 모델(1:1, N:1, M:N), 사용자 수준/커널 수준 스레드를 학습합니다. POSIX 스레드(pthread), Java 스레드 모델을 다룹니다. 동기화 문제: 경쟁 조건(Race Condition), 임계 구역(Critical Section), 상호 배제(Mutual Exclusion)를 실습합니다."),
        new WeekEntry("동기화 — 뮤텍스, 세마포어, 모니터",
            "동기화 도구를 이해하고 적용할 수 있다",
            "뮤텍스(Mutex), 세마포어(Semaphore, 이진/카운팅), 모니터(Monitor)의 원리를 학습합니다. 고전적 동기화 문제: 생산자-소비자, 읽기-쓰기, 식사하는 철학자 문제를 다룹니다. 데드락(Deadlock): 4가지 필요 조건, 예방/회피/탐지/복구 전략을 실습합니다."),
        new WeekEntry("CPU 스케줄링",
            "CPU 스케줄링 알고리즘을 이해하고 비교할 수 있다",
            "스케줄링 기준(CPU 사용률, 처리율, 대기 시간, 응답 시간, 반환 시간)을 학습합니다. 비선점: FCFS, SJF, 우선순위 / 선점: SRTF, Round Robin, 다단계 큐(MLQ, MLFQ)를 다룹니다. Gantt 차트 그리기, 평균 대기/반환 시간 계산, 스케줄링 시뮬레이션을 실습합니다."),
        new WeekEntry("메모리 관리",
            "메모리 할당 기법과 가상 메모리를 이해한다",
            "물리/논리 주소, MMU(Memory Management Unit), 연속 메모리 할당(First Fit, Best Fit, Worst Fit)을 학습합니다. 단편화(내부/외부), 페이징(Paging), 세그멘테이션(Segmentation)을 다룹니다. 가상 메모리: 요구 페이징(Demand Paging), 페이지 폴트, 페이지 교체 알고리즘(FIFO, LRU, LFU, Optimal)을 실습합니다."),
        new WeekEntry("파일 시스템",
            "파일 시스템의 구조와 디스크 관리를 이해한다",
            "파일의 개념, 디렉토리 구조(단일/2단계/트리/비순환 그래프), 접근 제어(ACL)를 학습합니다. 파일 할당 방식: 연속, 연결, 인덱스, FAT, inode 구조를 다룹니다. 디스크 스케줄링(FCFS, SSTF, SCAN, C-SCAN, LOOK), RAID 레벨(0, 1, 5, 6, 10)을 소개합니다."),
        new WeekEntry("종합 정리",
            "운영체제 전체 내용을 종합 정리한다",
            "프로세스/스레드, 동기화, 스케줄링, 메모리, 파일 시스템 핵심 개념을 총정리합니다. 종합 문제 풀이(대학 기출, 정보처리기사 기출)를 진행합니다. Linux 실습(프로세스 확인, 메모리 모니터링, 파일 시스템 명령어)을 수행합니다.")
    );

    static final List<WeekEntry> MACHINE_LEARNING = List.of(
        new WeekEntry("머신러닝 개요",
            "머신러닝의 개념과 분류를 이해한다",
            "AI, 머신러닝, 딥러닝의 관계, 머신러닝의 역사와 최근 동향을 학습합니다. 학습 유형: 지도학습, 비지도학습, 강화학습의 차이를 다룹니다. Python 환경 설정(Jupyter Notebook, scikit-learn, numpy, pandas), 첫 번째 ML 모델 실행을 실습합니다."),
        new WeekEntry("데이터 전처리와 탐색적 분석",
            "데이터를 정제하고 시각적으로 분석할 수 있다",
            "데이터 수집, 결측값 처리(삭제, 대치), 이상치 탐지, 데이터 타입 변환을 학습합니다. 탐색적 데이터 분석(EDA): 통계량, 분포 확인, 상관관계 분석, 시각화(matplotlib, seaborn)를 다룹니다. 특성 스케일링(StandardScaler, MinMaxScaler), 인코딩(Label, One-Hot)을 실습합니다."),
        new WeekEntry("회귀 모델",
            "선형 회귀와 다항 회귀를 이해하고 구현할 수 있다",
            "선형 회귀: 가설 함수, 비용 함수(MSE), 경사 하강법(Gradient Descent)을 학습합니다. 다중 선형 회귀, 다항 회귀, 정규화(Ridge, Lasso, ElasticNet)를 다룹니다. scikit-learn으로 모델 학습, 평가 지표(MAE, MSE, RMSE, R²)를 실습합니다."),
        new WeekEntry("분류 모델",
            "로지스틱 회귀, SVM, 의사결정 트리를 이해하고 활용할 수 있다",
            "로지스틱 회귀: 시그모이드 함수, 이진/다중 분류, 결정 경계를 학습합니다. SVM(Support Vector Machine): 마진 최대화, 커널 트릭(Linear, RBF, Polynomial)을 다룹니다. 의사결정 트리: 정보 이득, 엔트로피, 지니 계수, 가지치기를 실습합니다."),
        new WeekEntry("앙상블 학습",
            "앙상블 기법으로 모델 성능을 향상시킬 수 있다",
            "배깅(Bagging): Random Forest, 특성 랜덤 선택, Out-of-Bag 평가를 학습합니다. 부스팅(Boosting): AdaBoost, Gradient Boosting, XGBoost, LightGBM을 다룹니다. 스태킹(Stacking), 보팅(Voting), 하이퍼파라미터 튜닝(GridSearchCV, RandomizedSearchCV)을 실습합니다."),
        new WeekEntry("비지도학습 — 군집화와 차원 축소",
            "군집화와 차원 축소 기법을 이해하고 적용할 수 있다",
            "K-Means 클러스터링: 알고리즘 과정, K 선택(Elbow Method, Silhouette Score)을 학습합니다. DBSCAN, 계층적 군집화(덴드로그램), GMM(Gaussian Mixture Model)을 다룹니다. PCA(주성분 분석), t-SNE, UMAP 차원 축소와 시각화를 실습합니다."),
        new WeekEntry("딥러닝 기초 — 신경망",
            "인공 신경망(ANN)의 구조와 학습 원리를 이해한다",
            "퍼셉트론, 다층 퍼셉트론(MLP), 활성화 함수(Sigmoid, ReLU, Softmax)를 학습합니다. 순전파(Forward Propagation)와 역전파(Backpropagation), 옵티마이저(SGD, Adam)를 다룹니다. PyTorch/TensorFlow로 간단한 신경망 구현, MNIST 손글씨 분류를 실습합니다."),
        new WeekEntry("CNN과 이미지 처리",
            "CNN 구조를 이해하고 이미지 분류 모델을 만들 수 있다",
            "컨볼루션 연산, 풀링(Pooling), 패딩(Padding), 스트라이드(Stride)를 학습합니다. CNN 아키텍처: LeNet, VGG, ResNet, 전이 학습(Transfer Learning)을 다룹니다. 데이터 증강(Augmentation), 배치 정규화, 드롭아웃을 적용하여 CIFAR-10 분류를 실습합니다."),
        new WeekEntry("모델 평가와 실전 프로젝트",
            "모델을 체계적으로 평가하고 실전 프로젝트를 수행한다",
            "평가 지표: 정확도, 정밀도, 재현율, F1-Score, AUC-ROC, 혼동 행렬을 학습합니다. 교차 검증(K-Fold), 과적합/과소적합 진단, 학습 곡선 분석을 다룹니다. 캐글(Kaggle) 데이터셋으로 End-to-End 프로젝트(EDA → 전처리 → 모델링 → 평가 → 제출)를 실습합니다."),
        new WeekEntry("종합 정리",
            "머신러닝 전체 내용을 정리하고 향후 학습 방향을 설정한다",
            "ML 알고리즘 비교표(성능, 해석 가능성, 학습 시간) 정리를 진행합니다. MLOps 기초(모델 서빙, 모니터링, CI/CD), AutoML 소개를 다룹니다. NLP(자연어 처리), 생성형 AI, LLM(Large Language Model) 등 향후 학습 방향을 안내합니다.")
    );

    static final List<WeekEntry> MATHEMATICS = List.of(
        new WeekEntry("수학적 사고와 기초",
            "수학적 증명 방법과 기초 개념을 복습한다",
            "수학적 사고법, 명제와 논리(AND, OR, NOT, 조건문, 역·이·대우)를 학습합니다. 증명 방법: 직접 증명, 귀류법, 수학적 귀납법을 다룹니다. 집합론 기초(합집합, 교집합, 여집합, 드모르간 법칙), 함수(정의역, 공역, 치역, 전사/단사/전단사)를 복습합니다."),
        new WeekEntry("선형대수 — 벡터와 행렬",
            "벡터와 행렬의 기본 연산을 수행할 수 있다",
            "벡터: 정의, 덧셈, 스칼라배, 내적(Dot Product), 외적(Cross Product), 노름을 학습합니다. 행렬: 정의, 덧셈, 곱셈, 전치 행렬, 단위 행렬, 역행렬을 다룹니다. 연립 일차 방정식의 행렬 표현, 가우스 소거법을 실습합니다."),
        new WeekEntry("선형대수 — 선형 변환과 고유값",
            "선형 변환과 고유값 분해를 이해한다",
            "선형 변환의 정의, 행렬 표현, 기하학적 의미(회전, 반사, 축척)를 학습합니다. 행렬식(Determinant), 고유값(Eigenvalue), 고유벡터(Eigenvector), 대각화를 다룹니다. PCA(주성분 분석)에서의 고유값 활용, NumPy를 이용한 계산을 실습합니다."),
        new WeekEntry("미적분 — 극한과 미분",
            "극한의 개념과 미분법을 이해하고 활용할 수 있다",
            "극한의 정의(엡실론-델타), 좌극한/우극한, 연속 함수의 조건을 학습합니다. 도함수의 정의, 미분 규칙(합, 곱, 몫, 연쇄 법칙), 고계 도함수를 다룹니다. 편미분, 그래디언트(Gradient), 방향 도함수, 경사 하강법과의 연결을 실습합니다."),
        new WeekEntry("미적분 — 적분",
            "정적분과 부정적분을 이해하고 계산할 수 있다",
            "부정적분(역도함수), 기본 적분 공식, 치환 적분, 부분 적분을 학습합니다. 정적분과 넓이, 미적분학의 기본 정리(Fundamental Theorem of Calculus)를 다룹니다. 다중 적분(이중/삼중 적분), 확률 분포에서의 적분 활용을 실습합니다."),
        new WeekEntry("확률 기초",
            "확률의 기본 개념과 주요 정리를 이해한다",
            "표본 공간, 사건, 확률의 공리적 정의, 조건부 확률, 독립 사건을 학습합니다. 베이즈 정리(Bayes' Theorem), 전확률 공식, 베이즈 분류기 기초를 다룹니다. 순열, 조합, 이항 계수, 확률 문제 풀이를 실습합니다."),
        new WeekEntry("확률 분포",
            "주요 확률 분포의 특성을 이해하고 활용할 수 있다",
            "이산 확률 변수, 확률 질량 함수(PMF), 기댓값, 분산을 학습합니다. 이산 분포: 베르누이, 이항, 포아송, 기하 분포를 다룹니다. 연속 분포: 균일, 정규(가우시안), 지수, 감마 분포, 중심극한정리를 실습합니다."),
        new WeekEntry("통계 추론",
            "표본 통계량과 추정·검정의 기본을 이해한다",
            "모집단과 표본, 표본 평균의 분포, 표준 오차를 학습합니다. 점 추정, 구간 추정(신뢰 구간), 최대 가능도 추정(MLE)을 다룹니다. 가설 검정: 귀무/대립 가설, p-value, 유의 수준, t-검정, 카이제곱 검정을 실습합니다."),
        new WeekEntry("종합 정리와 응용",
            "수학 전체 내용을 정리하고 실제 응용 분야와 연결한다",
            "선형대수, 미적분, 확률/통계의 핵심 개념 종합 정리를 진행합니다. 머신러닝/데이터 사이언스에서의 수학 활용 사례를 분석합니다. 종합 문제 풀이, Python(NumPy, SciPy)을 이용한 수치 계산 실습을 합니다.")
    );
}
