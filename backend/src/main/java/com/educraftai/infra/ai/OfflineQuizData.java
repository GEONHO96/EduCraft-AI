package com.educraftai.infra.ai;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * 오프라인 퀴즈 문제 은행
 * AI API가 사용 불가능할 때(오프라인 모드) 실제 교육용 퀴즈 문제를 제공한다.
 * 커리큘럼 주제별로 정확한 문제와 해설을 내장하고 있다.
 */
public class OfflineQuizData {

    // ==================== 공개 API ====================

    /**
     * 주어진 주제에 맞는 퀴즈 문제를 count개 반환한다.
     * 키워드 매칭으로 적합한 문제 은행을 찾고, 셔플 후 count개를 잘라 번호를 매긴다.
     *
     * @param topic 커리큘럼 주제 (예: "Java 개발환경 구축", "변수, 자료형, 연산자")
     * @param count 반환할 문제 수
     * @return 문제 리스트 (각 문제는 number, type, question, options, answer, explanation 포함)
     */
    public static List<Map<String, Object>> findQuestions(String topic, int count) {
        String lower = topic.toLowerCase();
        List<Map<String, Object>> bank = new ArrayList<>();

        // ── Java ──
        if (matches(lower, "jdk", "개발환경", "jre", "jvm", "javac", "설치")) {
            bank.addAll(JAVA_JDK_ENV);
        }
        if (matches(lower, "변수", "자료형", "연산자", "primitive", "타입", "캐스팅")) {
            bank.addAll(JAVA_VARIABLES);
        }
        if (matches(lower, "제어문", "조건", "반복", "if", "switch", "for", "while")) {
            bank.addAll(JAVA_CONTROL_FLOW);
        }
        if (matches(lower, "배열", "문자열", "string", "stringbuilder", "array")) {
            bank.addAll(JAVA_ARRAY_STRING);
        }
        if (matches(lower, "클래스", "객체", "생성자", "class", "object", "constructor")) {
            bank.addAll(JAVA_CLASS_OBJECT);
        }
        if (matches(lower, "상속", "다형성", "extends", "override", "polymorphism")) {
            bank.addAll(JAVA_INHERITANCE);
        }
        if (matches(lower, "추상", "인터페이스", "abstract", "interface")) {
            bank.addAll(JAVA_ABSTRACT_INTERFACE);
        }
        if (matches(lower, "예외", "입출력", "exception", "try", "catch", "io", "stream")) {
            bank.addAll(JAVA_EXCEPTION_IO);
        }
        if (matches(lower, "컬렉션", "collection", "arraylist", "hashmap", "list", "set", "map")) {
            bank.addAll(JAVA_COLLECTION);
        }
        if (matches(lower, "제네릭", "열거", "generic", "enum", "wildcard")) {
            bank.addAll(JAVA_GENERIC_ENUM);
        }

        // ── Python ──
        if (matches(lower, "python", "파이썬", "pip", "venv", "인터프리터")) {
            bank.addAll(PYTHON_ENV);
        }
        if (matches(lower, "리스트", "튜플", "딕셔너리", "dict", "tuple", "set")) {
            bank.addAll(PYTHON_DATA_STRUCTURES);
        }
        if (matches(lower, "함수", "모듈", "lambda", "def", "import", "args", "kwargs")) {
            bank.addAll(PYTHON_FUNCTION_MODULE);
        }
        if (matches(lower, "객체지향", "oop", "__init__", "self", "클래스", "class")) {
            bank.addAll(PYTHON_OOP);
        }
        if (matches(lower, "데코레이터", "제너레이터", "decorator", "generator", "yield", "closure")) {
            bank.addAll(PYTHON_DECORATOR_GENERATOR);
        }

        // ── Web ──
        if (matches(lower, "html", "시맨틱", "태그", "폼", "form", "doctype")) {
            bank.addAll(WEB_HTML);
        }
        if (matches(lower, "css", "스타일", "flexbox", "grid", "박스모델", "box model")) {
            bank.addAll(WEB_CSS);
        }
        if (matches(lower, "javascript", "자바스크립트", "js 기초", "let", "const", "var", "호이스팅", "클로저")) {
            bank.addAll(WEB_JS_BASIC);
        }
        if (matches(lower, "dom", "이벤트", "queryselector", "event", "버블링", "delegation")) {
            bank.addAll(WEB_DOM_EVENT);
        }
        if (matches(lower, "react", "리액트", "컴포넌트", "usestate", "useeffect", "props", "virtual dom")) {
            bank.addAll(WEB_REACT);
        }

        // ── Database / CS ──
        if (matches(lower, "sql", "데이터베이스", "database", "select", "join", "index", "정규화")) {
            bank.addAll(DB_SQL);
        }
        if (matches(lower, "자료구조", "data structure", "스택", "큐", "트리", "해시")) {
            bank.addAll(CS_DATA_STRUCTURE);
        }
        if (matches(lower, "알고리즘", "algorithm", "정렬", "탐색", "시간복잡도", "재귀")) {
            bank.addAll(CS_ALGORITHM);
        }

        // ── 매칭 실패 시 스마트 폴백 ──
        if (bank.isEmpty()) {
            bank.addAll(generateFallback(topic));
        }

        // 셔플 후 count개만 잘라서 번호 매기기
        List<Map<String, Object>> shuffled = new ArrayList<>(bank);
        Collections.shuffle(shuffled);
        int limit = Math.min(count, shuffled.size());

        return IntStream.range(0, limit)
                .mapToObj(i -> {
                    Map<String, Object> q = new LinkedHashMap<>(shuffled.get(i));
                    q.put("number", i + 1);
                    return q;
                })
                .collect(Collectors.toList());
    }

    // ==================== 유틸리티 ====================

    private static boolean matches(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }

    /** 객관식 문제 생성 헬퍼 */
    private static Map<String, Object> mc(String question,
                                          String o1, String o2, String o3, String o4,
                                          int answer, String explanation) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("number", 0);
        m.put("type", "MULTIPLE_CHOICE");
        m.put("question", question);
        m.put("options", List.of(o1, o2, o3, o4));
        m.put("answer", answer);
        m.put("explanation", explanation);
        return m;
    }

    /** 주관식 문제 생성 헬퍼 */
    private static Map<String, Object> sa(String question,
                                          String answer, String explanation) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("number", 0);
        m.put("type", "SHORT_ANSWER");
        m.put("question", question);
        m.put("options", List.of());
        m.put("answer", answer);
        m.put("explanation", explanation);
        return m;
    }

    // ==================== 스마트 폴백 ====================

    private static List<Map<String, Object>> generateFallback(String topic) {
        List<Map<String, Object>> questions = new ArrayList<>();
        questions.add(mc(
                topic + "에서 가장 기본이 되는 개념은 무엇인가요?",
                "기초 문법 이해", "고급 최적화 기법", "배포 자동화", "보안 취약점 분석",
                0,
                "어떤 기술이든 기초 문법과 핵심 개념을 먼저 이해하는 것이 중요합니다."
        ));
        questions.add(mc(
                topic + " 학습 시 가장 효과적인 방법은?",
                "이론만 반복 암기", "직접 코드를 작성하며 실습", "다른 사람의 코드만 읽기", "시험 문제만 풀기",
                1,
                "프로그래밍은 직접 코드를 작성하고 실행해보는 실습이 가장 효과적인 학습 방법입니다."
        ));
        questions.add(mc(
                topic + " 관련 오류가 발생했을 때 가장 먼저 해야 할 일은?",
                "코드를 전부 삭제하고 다시 작성", "오류 메시지를 정확히 읽고 분석", "컴퓨터를 재부팅", "다른 프로젝트를 시작",
                1,
                "오류 메시지는 문제의 원인과 위치를 알려주므로 가장 먼저 정확히 읽고 분석해야 합니다."
        ));
        questions.add(sa(
                topic + "을(를) 학습할 때 공식 문서를 참고하는 것이 중요한 이유를 간단히 설명하세요.",
                "공식 문서는 가장 정확하고 최신 정보를 제공하기 때문",
                "공식 문서(Official Documentation)는 해당 기술의 개발자가 직접 작성하여 가장 정확하고 신뢰할 수 있는 정보를 제공합니다."
        ));
        questions.add(mc(
                topic + "에서 코드의 가독성을 높이기 위해 가장 중요한 것은?",
                "변수명을 한 글자로 짧게", "의미 있는 이름과 일관된 코딩 컨벤션", "주석 없이 코드만 작성", "모든 코드를 한 줄로 작성",
                1,
                "의미 있는 변수/함수 이름과 일관된 코딩 컨벤션은 코드의 가독성과 유지보수성을 크게 높입니다."
        ));
        return questions;
    }

    // ====================================================================
    //  Java 문제 은행
    // ====================================================================

    // ── 1. JDK / 개발환경 ──
    private static final List<Map<String, Object>> JAVA_JDK_ENV = List.of(
            mc("JDK, JRE, JVM의 관계로 올바른 것은?",
                    "JVM ⊃ JRE ⊃ JDK",
                    "JDK ⊃ JRE ⊃ JVM",
                    "JRE ⊃ JDK ⊃ JVM",
                    "JDK = JRE = JVM",
                    1,
                    "JDK(Java Development Kit)는 JRE(Java Runtime Environment)를 포함하고, JRE는 JVM(Java Virtual Machine)을 포함합니다. JDK는 개발도구(컴파일러 등)를 추가로 포함합니다."),
            mc("Java 소스 파일(.java)을 바이트코드(.class)로 변환하는 도구는?",
                    "java",
                    "javac",
                    "javadoc",
                    "jar",
                    1,
                    "javac는 Java Compiler로, .java 소스 파일을 JVM이 실행할 수 있는 .class 바이트코드 파일로 컴파일합니다."),
            mc("Java 프로그램의 진입점(entry point)인 main 메서드의 올바른 선언은?",
                    "public void main(String args)",
                    "public static void main(String[] args)",
                    "static int main(String[] args)",
                    "void main()",
                    1,
                    "Java의 main 메서드는 반드시 public static void main(String[] args) 시그니처를 가져야 JVM이 진입점으로 인식합니다."),
            sa("Java 바이트코드를 실행하는 가상 머신의 이름을 영문 약자 3글자로 쓰시오.",
                    "JVM",
                    "JVM(Java Virtual Machine)은 바이트코드(.class)를 해당 운영체제에 맞게 해석하여 실행하는 가상 머신입니다. 이 덕분에 Java는 플랫폼 독립적('Write Once, Run Anywhere')입니다."),
            mc("Java의 'Write Once, Run Anywhere' 특성을 가능하게 하는 핵심 원리는?",
                    "소스 코드가 운영체제별로 자동 변환됨",
                    "바이트코드를 각 플랫폼의 JVM이 해석하여 실행",
                    "Java는 네이티브 코드로만 컴파일됨",
                    "운영체제마다 다른 Java 문법을 사용",
                    1,
                    "Java 소스는 플랫폼 독립적인 바이트코드로 컴파일되고, 각 운영체제에 설치된 JVM이 이 바이트코드를 해석하여 실행하므로 플랫폼에 무관하게 동작합니다.")
    );

    // ── 2. 변수 / 자료형 / 연산자 ──
    private static final List<Map<String, Object>> JAVA_VARIABLES = List.of(
            mc("Java의 기본형(primitive type)이 아닌 것은?",
                    "int",
                    "boolean",
                    "String",
                    "double",
                    2,
                    "String은 기본형이 아니라 참조형(Reference Type)입니다. Java의 8가지 기본형은 byte, short, int, long, float, double, char, boolean입니다."),
            mc("Java에서 int형의 크기와 값의 범위로 올바른 것은?",
                    "2바이트, -32768 ~ 32767",
                    "4바이트, 약 -21억 ~ 21억",
                    "8바이트, 약 -921경 ~ 921경",
                    "4바이트, 0 ~ 약 42억",
                    1,
                    "int는 4바이트(32비트) 정수형으로, -2,147,483,648 ~ 2,147,483,647 (약 -21억 ~ 21억)의 범위를 가집니다."),
            mc("다음 중 자동 형변환(묵시적 캐스팅)이 일어나는 경우는?",
                    "double → int",
                    "long → float",
                    "int → byte",
                    "float → long",
                    1,
                    "Java는 작은 타입에서 큰 타입으로 자동 형변환합니다. long(8바이트)에서 float(4바이트)로의 변환은 표현 범위가 넓어지므로 자동 형변환이 허용됩니다(정밀도 손실 가능)."),
            sa("Java의 8가지 기본형(primitive type) 중 정수형 4가지를 크기 순서대로 쓰시오.",
                    "byte, short, int, long",
                    "Java의 정수형은 byte(1바이트), short(2바이트), int(4바이트), long(8바이트) 4가지이며, 크기가 커질수록 표현할 수 있는 범위가 넓어집니다."),
            mc("Java에서 10 / 3의 결과는?",
                    "3.333...",
                    "3",
                    "3.0",
                    "컴파일 오류",
                    1,
                    "정수끼리의 나눗셈은 정수 나눗셈이 수행되어 소수점 이하가 버려집니다. 10 / 3은 int끼리의 연산이므로 결과도 int인 3이 됩니다.")
    );

    // ── 3. 제어문 / 조건 / 반복 ──
    private static final List<Map<String, Object>> JAVA_CONTROL_FLOW = List.of(
            mc("Java의 switch문에서 break를 생략하면 어떤 일이 발생하는가?",
                    "컴파일 오류가 발생한다",
                    "해당 case만 실행된다",
                    "fall-through가 발생하여 다음 case도 실행된다",
                    "프로그램이 종료된다",
                    2,
                    "switch문에서 break를 생략하면 fall-through가 발생하여 일치하는 case 이후의 모든 case 코드가 break를 만날 때까지 연속 실행됩니다."),
            mc("for(int i=0; i<5; i++) 반복문은 몇 번 실행되는가?",
                    "4번",
                    "5번",
                    "6번",
                    "무한 반복",
                    1,
                    "i가 0, 1, 2, 3, 4일 때 총 5번 실행됩니다. i가 5가 되면 조건 i<5가 false가 되어 반복이 종료됩니다."),
            mc("반복문에서 continue 키워드의 역할은?",
                    "반복문 전체를 즉시 종료",
                    "현재 반복 회차를 건너뛰고 다음 회차로 이동",
                    "프로그램을 종료",
                    "조건식을 다시 평가하지 않고 반복",
                    1,
                    "continue는 현재 반복 회차의 나머지 코드를 건너뛰고 반복문의 조건식 평가(또는 증감식)로 돌아가 다음 회차를 진행합니다. break는 반복문 전체를 종료합니다."),
            sa("Java에서 반복문을 즉시 종료시키는 키워드를 쓰시오.",
                    "break",
                    "break 키워드는 현재 실행 중인 반복문(for, while, do-while)이나 switch문을 즉시 빠져나오게 합니다."),
            mc("do-while문과 while문의 가장 큰 차이점은?",
                    "do-while은 조건이 false여도 최소 1회 실행된다",
                    "while은 무한 루프가 불가능하다",
                    "do-while은 break를 사용할 수 없다",
                    "while은 조건식이 없다",
                    0,
                    "do-while문은 조건을 나중에 검사하므로, 조건이 처음부터 false라도 본문이 최소 1회 실행됩니다. while문은 조건을 먼저 검사하므로 조건이 false면 한 번도 실행되지 않을 수 있습니다.")
    );

    // ── 4. 배열 / 문자열 / String ──
    private static final List<Map<String, Object>> JAVA_ARRAY_STRING = List.of(
            mc("Java에서 배열을 올바르게 선언하고 초기화하는 방법은?",
                    "int arr = new int[5];",
                    "int[] arr = new int[5];",
                    "int[] arr = new int[];",
                    "array<int> arr = new array(5);",
                    1,
                    "Java 배열은 '타입[] 변수명 = new 타입[크기];' 형식으로 선언합니다. 크기를 반드시 지정해야 하며, 생성 후 크기 변경이 불가합니다."),
            mc("Java에서 String이 불변(immutable)이라는 의미는?",
                    "String 변수에 다른 값을 대입할 수 없다",
                    "한 번 생성된 String 객체의 내용을 변경할 수 없다",
                    "String은 상속할 수 없다",
                    "String은 null이 될 수 없다",
                    1,
                    "String 객체가 생성되면 그 내부 문자열 데이터는 변경할 수 없습니다. 문자열 조작 메서드(concat, replace 등)는 항상 새로운 String 객체를 생성하여 반환합니다."),
            mc("두 String 객체의 내용이 같은지 비교할 때 사용해야 하는 것은?",
                    "== 연산자",
                    ".equals() 메서드",
                    ".compare() 메서드",
                    ".match() 메서드",
                    1,
                    "== 연산자는 참조(메모리 주소)를 비교하고, .equals() 메서드는 실제 문자열 내용을 비교합니다. 내용 비교에는 반드시 equals()를 사용해야 합니다."),
            sa("문자열을 자주 변경해야 할 때 String 대신 사용하는 클래스의 이름을 쓰시오.",
                    "StringBuilder",
                    "StringBuilder는 가변(mutable) 문자열 클래스로, 문자열을 반복적으로 수정할 때 매번 새 객체를 생성하지 않아 성능이 우수합니다. 멀티스레드 환경에서는 StringBuffer를 사용합니다."),
            mc("int[] arr = {1, 2, 3}; 에서 arr.length의 값은?",
                    "2",
                    "3",
                    "4",
                    "컴파일 오류",
                    1,
                    "배열의 length 속성은 배열의 전체 요소 개수를 반환합니다. {1, 2, 3}으로 초기화했으므로 요소가 3개이고, arr.length는 3입니다.")
    );

    // ── 5. 클래스 / 객체 ──
    private static final List<Map<String, Object>> JAVA_CLASS_OBJECT = List.of(
            mc("Java에서 생성자(Constructor)에 대한 설명으로 틀린 것은?",
                    "클래스 이름과 동일한 이름을 가진다",
                    "반환 타입이 void이다",
                    "객체 생성 시 자동으로 호출된다",
                    "오버로딩이 가능하다",
                    1,
                    "생성자는 반환 타입이 없습니다(void도 아님). 클래스명과 동일한 이름을 가지며, new 키워드로 객체 생성 시 자동 호출되고, 매개변수를 달리하여 오버로딩할 수 있습니다."),
            mc("접근 제한자의 접근 범위가 좁은 순서에서 넓은 순서로 올바른 것은?",
                    "private → default → protected → public",
                    "public → protected → default → private",
                    "private → protected → default → public",
                    "default → private → protected → public",
                    0,
                    "private(해당 클래스만) → default(같은 패키지) → protected(같은 패키지 + 자식 클래스) → public(모든 곳) 순으로 접근 범위가 넓어집니다."),
            mc("static 키워드가 붙은 멤버에 대한 설명으로 옳은 것은?",
                    "객체를 생성해야만 사용할 수 있다",
                    "클래스 레벨에 속하며 객체 생성 없이 사용 가능하다",
                    "상속할 수 없다",
                    "한 번만 호출할 수 있다",
                    1,
                    "static 멤버는 클래스가 로딩될 때 메모리에 할당되며, 해당 클래스의 모든 인스턴스가 공유합니다. 클래스명.멤버명으로 객체 생성 없이 접근할 수 있습니다."),
            sa("Java에서 현재 객체 자신을 가리키는 키워드를 쓰시오.",
                    "this",
                    "this는 현재 인스턴스 자기 자신을 참조하는 키워드입니다. 매개변수와 인스턴스 변수의 이름이 같을 때 구분하거나, 다른 생성자를 호출(this())할 때 사용합니다."),
            mc("다음 중 Java에서 객체를 생성하는 올바른 방법은?",
                    "Student s = Student();",
                    "Student s = new Student();",
                    "new Student s = Student();",
                    "Student s = create Student();",
                    1,
                    "Java에서 객체는 new 키워드를 사용하여 생성합니다. new 연산자가 힙 메모리에 객체를 생성하고, 생성자를 호출한 뒤 참조를 반환합니다.")
    );

    // ── 6. 상속 / 다형성 ──
    private static final List<Map<String, Object>> JAVA_INHERITANCE = List.of(
            mc("Java에서 클래스 상속 시 사용하는 키워드는?",
                    "implements",
                    "extends",
                    "inherits",
                    "super",
                    1,
                    "Java에서 클래스 상속은 extends 키워드를 사용합니다. implements는 인터페이스 구현에 사용합니다. Java는 단일 상속만 허용합니다."),
            mc("메서드 오버라이딩(@Override)의 조건으로 올바른 것은?",
                    "메서드 이름만 같으면 된다",
                    "메서드 이름, 매개변수, 반환타입이 모두 동일해야 한다",
                    "접근 제한자를 더 좁게 변경할 수 있다",
                    "static 메서드도 오버라이딩할 수 있다",
                    1,
                    "오버라이딩은 부모 클래스의 메서드와 이름, 매개변수 목록, 반환 타입이 동일해야 합니다. 접근 제한자는 같거나 더 넓게만 변경 가능하며, static 메서드는 오버라이딩이 아닌 하이딩(hiding)됩니다."),
            mc("업캐스팅(Upcasting)에 대한 설명으로 옳은 것은?",
                    "부모 타입을 자식 타입으로 변환하는 것",
                    "자식 객체를 부모 타입 변수에 대입하는 것",
                    "명시적 형변환이 반드시 필요하다",
                    "컴파일 오류가 발생한다",
                    1,
                    "업캐스팅은 자식 클래스의 객체를 부모 클래스 타입의 참조 변수에 대입하는 것으로, 자동으로(묵시적으로) 이루어집니다. 다형성의 기본 원리입니다."),
            sa("Java에서 객체의 실제 타입을 확인하는 연산자를 쓰시오.",
                    "instanceof",
                    "instanceof 연산자는 객체가 특정 클래스의 인스턴스인지 확인합니다. 다운캐스팅 전 안전한 타입 확인에 사용하며, null은 항상 false를 반환합니다."),
            mc("부모 클래스의 생성자를 호출할 때 사용하는 키워드는?",
                    "this()",
                    "super()",
                    "parent()",
                    "base()",
                    1,
                    "super()는 부모 클래스의 생성자를 호출합니다. 자식 클래스의 생성자 첫 줄에서 호출해야 하며, 명시하지 않으면 컴파일러가 자동으로 super()를 삽입합니다.")
    );

    // ── 7. 추상 / 인터페이스 ──
    private static final List<Map<String, Object>> JAVA_ABSTRACT_INTERFACE = List.of(
            mc("추상 클래스(abstract class)와 인터페이스(interface)의 차이점으로 올바른 것은?",
                    "추상 클래스는 다중 상속이 가능하다",
                    "인터페이스는 일반 메서드를 가질 수 없다",
                    "추상 클래스는 생성자와 인스턴스 변수를 가질 수 있다",
                    "인터페이스는 extends로 구현한다",
                    2,
                    "추상 클래스는 생성자, 인스턴스 변수, 일반 메서드를 가질 수 있습니다. 인터페이스는 Java 8부터 default 메서드를 가질 수 있지만, 생성자와 인스턴스 변수는 가질 수 없습니다."),
            mc("Java에서 인터페이스를 여러 개 구현할 수 있는 이유는?",
                    "Java가 다중 상속을 지원하기 때문",
                    "인터페이스는 구현부가 없는 추상 메서드로 다이아몬드 문제가 발생하지 않기 때문",
                    "인터페이스는 클래스가 아니기 때문",
                    "컴파일러가 자동으로 충돌을 해결하기 때문",
                    1,
                    "인터페이스는 기본적으로 구현부가 없는 추상 메서드만 정의하므로, 다중 상속의 다이아몬드 문제(같은 메서드의 중복 구현)가 발생하지 않아 여러 개를 동시에 구현할 수 있습니다."),
            mc("Java 8에서 인터페이스에 추가된 기능은?",
                    "생성자 정의",
                    "인스턴스 변수 선언",
                    "default 메서드 (기본 구현 포함 메서드)",
                    "private 인스턴스 필드",
                    2,
                    "Java 8부터 인터페이스에 default 메서드를 정의할 수 있어, 구현 클래스에서 반드시 오버라이드하지 않아도 되는 기본 구현을 제공할 수 있습니다."),
            sa("추상 메서드를 하나라도 포함하는 클래스에 반드시 붙여야 하는 키워드를 쓰시오.",
                    "abstract",
                    "추상 메서드(본문이 없는 메서드)를 포함하는 클래스는 반드시 abstract 키워드를 붙여 추상 클래스로 선언해야 합니다. 추상 클래스는 직접 인스턴스를 생성할 수 없습니다."),
            mc("다음 코드에서 올바른 것은?\ninterface A { void hello(); }\ninterface B { void hello(); }\nclass C implements A, B { ... }",
                    "컴파일 오류 발생 (메서드 충돌)",
                    "C 클래스에서 hello()를 한 번만 구현하면 된다",
                    "A와 B 중 하나만 구현해야 한다",
                    "hello()를 두 번 구현해야 한다",
                    1,
                    "두 인터페이스에 시그니처가 동일한 추상 메서드가 있으면, 구현 클래스에서 한 번만 구현하면 양쪽 인터페이스의 계약을 모두 충족합니다.")
    );

    // ── 8. 예외 / 입출력 ──
    private static final List<Map<String, Object>> JAVA_EXCEPTION_IO = List.of(
            mc("Java에서 Checked Exception과 Unchecked Exception의 차이는?",
                    "Checked는 RuntimeException의 하위 클래스이다",
                    "Unchecked는 반드시 try-catch로 처리해야 한다",
                    "Checked는 컴파일 시점에 처리를 강제하고, Unchecked는 강제하지 않는다",
                    "둘 사이에 차이가 없다",
                    2,
                    "Checked Exception(IOException 등)은 컴파일러가 예외 처리를 강제합니다. Unchecked Exception(NullPointerException 등)은 RuntimeException의 하위 클래스로 컴파일 시 처리를 강제하지 않습니다."),
            mc("try-catch-finally에서 finally 블록의 특징은?",
                    "예외가 발생한 경우에만 실행된다",
                    "예외 발생 여부와 관계없이 항상 실행된다",
                    "catch 블록이 없으면 실행되지 않는다",
                    "return문 이후에는 실행되지 않는다",
                    1,
                    "finally 블록은 예외 발생 여부, catch 실행 여부와 무관하게 항상 실행됩니다. 주로 자원 해제(파일 닫기, 연결 종료 등)에 사용합니다. try나 catch에 return이 있어도 finally는 실행됩니다."),
            mc("Java 7에서 도입된 try-with-resources의 장점은?",
                    "예외를 자동으로 무시해준다",
                    "AutoCloseable 자원을 자동으로 닫아준다",
                    "catch 블록이 필요 없어진다",
                    "모든 예외가 Unchecked로 변환된다",
                    1,
                    "try-with-resources는 AutoCloseable 인터페이스를 구현한 자원을 try 블록 종료 시 자동으로 close()를 호출하여 닫아줍니다. 자원 누수를 방지하는 안전한 방법입니다."),
            sa("NullPointerException은 Checked Exception인가 Unchecked Exception인가?",
                    "Unchecked Exception",
                    "NullPointerException은 RuntimeException의 하위 클래스이므로 Unchecked Exception입니다. 컴파일러가 처리를 강제하지 않으며, 주로 프로그래밍 실수로 발생합니다."),
            mc("사용자 정의 예외 클래스를 만들 때 일반적으로 상속받는 클래스는?",
                    "Object",
                    "Throwable",
                    "Exception 또는 RuntimeException",
                    "Error",
                    2,
                    "사용자 정의 예외는 일반적으로 Exception(Checked)이나 RuntimeException(Unchecked)을 상속받아 만듭니다. Error는 시스템 레벨의 심각한 오류용이므로 사용하지 않습니다.")
    );

    // ── 9. 컬렉션 ──
    private static final List<Map<String, Object>> JAVA_COLLECTION = List.of(
            mc("ArrayList와 LinkedList의 차이로 올바른 것은?",
                    "ArrayList는 삽입/삭제가 빠르고, LinkedList는 인덱스 접근이 빠르다",
                    "ArrayList는 인덱스 접근(get)이 O(1), LinkedList는 중간 삽입/삭제가 유리하다",
                    "둘 다 동일한 성능을 가진다",
                    "LinkedList는 크기가 고정이다",
                    1,
                    "ArrayList는 내부 배열 기반으로 인덱스 접근이 O(1)입니다. LinkedList는 노드 기반으로 중간 삽입/삭제 시 노드 연결만 변경하면 되어 유리하지만, 인덱스 접근은 O(n)입니다."),
            mc("HashSet의 특징으로 올바른 것은?",
                    "중복을 허용하고 순서를 보장한다",
                    "중복을 허용하지 않고 순서를 보장하지 않는다",
                    "중복을 허용하지 않고 순서를 보장한다",
                    "중복을 허용하고 순서를 보장하지 않는다",
                    1,
                    "HashSet은 Set 인터페이스의 구현체로, 중복 요소를 허용하지 않으며 저장 순서를 보장하지 않습니다. 순서가 필요하면 LinkedHashSet, 정렬이 필요하면 TreeSet을 사용합니다."),
            mc("HashMap에서 같은 key로 다른 value를 put하면?",
                    "예외가 발생한다",
                    "기존 값이 새 값으로 대체된다",
                    "두 값이 모두 저장된다",
                    "아무 일도 일어나지 않는다",
                    1,
                    "HashMap에서 동일한 key로 put하면 기존 value가 새 value로 대체(덮어쓰기)됩니다. Map은 key의 유일성을 보장하므로 같은 key에 두 값이 동시에 존재할 수 없습니다."),
            sa("Java 컬렉션에서 요소를 순차적으로 접근하기 위해 사용하는 인터페이스의 이름을 쓰시오.",
                    "Iterator",
                    "Iterator 인터페이스는 hasNext()와 next() 메서드를 제공하여 컬렉션의 요소를 순차적으로 접근할 수 있게 합니다. remove() 메서드로 순회 중 안전하게 요소를 삭제할 수도 있습니다."),
            mc("List, Set, Map 중 key-value 쌍으로 데이터를 저장하는 것은?",
                    "List",
                    "Set",
                    "Map",
                    "Queue",
                    2,
                    "Map은 key-value 쌍으로 데이터를 저장하는 자료구조입니다. List는 순서가 있는 요소의 목록, Set은 중복 없는 요소의 집합, Queue는 FIFO 구조입니다.")
    );

    // ── 10. 제네릭 / 열거형 ──
    private static final List<Map<String, Object>> JAVA_GENERIC_ENUM = List.of(
            mc("Java 제네릭(Generic)을 사용하는 가장 큰 이유는?",
                    "실행 속도를 높이기 위해",
                    "컴파일 시점에 타입 안전성을 보장하기 위해",
                    "메모리 사용량을 줄이기 위해",
                    "코드를 난독화하기 위해",
                    1,
                    "제네릭은 컴파일 시점에 타입을 검사하여 잘못된 타입 사용을 방지합니다. 런타임에 ClassCastException이 발생하는 것을 미리 방지할 수 있습니다."),
            mc("제네릭 와일드카드 '? extends Number'의 의미는?",
                    "Number 클래스만 가능",
                    "Number 또는 Number의 하위 클래스만 가능",
                    "Number의 상위 클래스만 가능",
                    "모든 타입이 가능",
                    1,
                    "'? extends Number'는 상한 와일드카드로, Number이거나 Number를 상속받는 하위 타입(Integer, Double 등)만 허용합니다. 읽기(get)는 가능하지만 쓰기(add)는 제한됩니다."),
            mc("Java enum에서 모든 열거 상수를 배열로 반환하는 메서드는?",
                    "getAll()",
                    "values()",
                    "list()",
                    "toArray()",
                    1,
                    "enum의 values() 메서드는 컴파일러가 자동으로 생성하며, 해당 enum에 정의된 모든 상수를 선언 순서대로 배열로 반환합니다."),
            sa("제네릭에서 타입 파라미터를 나타낼 때 관례적으로 사용하는 알파벳 한 글자를 쓰시오. (가장 일반적인 것)",
                    "T",
                    "제네릭 타입 파라미터로 관례적으로 T(Type)를 사용합니다. 그 외에도 E(Element), K(Key), V(Value), N(Number) 등이 사용됩니다."),
            mc("다음 중 enum의 특징이 아닌 것은?",
                    "상수들의 집합을 타입 안전하게 정의할 수 있다",
                    "메서드와 필드를 가질 수 있다",
                    "new 키워드로 인스턴스를 생성할 수 있다",
                    "switch문에서 사용할 수 있다",
                    2,
                    "enum은 new 키워드로 직접 인스턴스를 생성할 수 없습니다. 열거 상수는 enum 정의 시 자동으로 생성되며, 외부에서 추가 생성이 불가합니다.")
    );

    // ====================================================================
    //  Python 문제 은행
    // ====================================================================

    // ── 1. Python 개발환경 ──
    private static final List<Map<String, Object>> PYTHON_ENV = List.of(
            mc("Python이 인터프리터 언어라는 것의 의미는?",
                    "소스 코드를 한꺼번에 기계어로 번역한 후 실행",
                    "소스 코드를 한 줄씩 해석하며 실행",
                    "컴파일이 완료되면 실행 파일이 생성됨",
                    "바이트코드 없이 직접 CPU에서 실행됨",
                    1,
                    "인터프리터 언어는 소스 코드를 한 줄씩 해석(interpret)하며 실행합니다. 컴파일러 언어(C, Java)와 달리 별도의 컴파일 단계 없이 바로 실행할 수 있습니다."),
            mc("Python의 코딩 스타일 가이드 문서 이름은?",
                    "PEP 1",
                    "PEP 8",
                    "PEP 20",
                    "PEP 257",
                    1,
                    "PEP 8은 Python의 공식 코딩 스타일 가이드로, 들여쓰기, 네이밍 규칙, 줄 길이 등 코드 작성 규칙을 정의합니다. PEP 20은 'The Zen of Python'입니다."),
            mc("Python에서 가상 환경(venv)을 사용하는 이유는?",
                    "프로그램 실행 속도를 높이기 위해",
                    "프로젝트별로 독립적인 패키지 환경을 관리하기 위해",
                    "보안 취약점을 방지하기 위해",
                    "Python 버전을 자동 업데이트하기 위해",
                    1,
                    "가상 환경은 프로젝트마다 독립적인 Python 패키지 환경을 제공합니다. 이를 통해 프로젝트 간 패키지 버전 충돌을 방지하고 의존성을 깔끔하게 관리할 수 있습니다."),
            sa("Python에서 외부 패키지를 설치할 때 사용하는 패키지 관리자의 이름을 쓰시오.",
                    "pip",
                    "pip(Pip Installs Packages)는 Python의 표준 패키지 관리자로, PyPI(Python Package Index)에서 패키지를 검색, 설치, 삭제할 수 있습니다. 예: pip install requests"),
            mc("Python 인터프리터에서 >>> 기호가 의미하는 것은?",
                    "주석의 시작",
                    "대화형(Interactive) 인터프리터의 프롬프트",
                    "오류 메시지의 시작",
                    "파일 입출력 연산자",
                    1,
                    ">>>는 Python 대화형 인터프리터(REPL)의 기본 프롬프트입니다. 이 프롬프트에서 Python 코드를 한 줄씩 입력하고 즉시 결과를 확인할 수 있습니다.")
    );

    // ── 2. 리스트 / 튜플 / 딕셔너리 ──
    private static final List<Map<String, Object>> PYTHON_DATA_STRUCTURES = List.of(
            mc("Python에서 리스트(list)와 튜플(tuple)의 가장 큰 차이점은?",
                    "리스트는 숫자만, 튜플은 문자열만 저장",
                    "리스트는 변경 가능(mutable), 튜플은 변경 불가(immutable)",
                    "튜플이 리스트보다 항상 빠르다",
                    "리스트는 []로, 튜플은 {}로 생성한다",
                    1,
                    "리스트는 요소의 추가, 삭제, 변경이 가능한 가변(mutable) 자료형이고, 튜플은 생성 후 요소를 변경할 수 없는 불변(immutable) 자료형입니다. 리스트는 [], 튜플은 ()로 생성합니다."),
            mc("Python 딕셔너리(dict)에서 존재하지 않는 키에 접근할 때 KeyError를 방지하는 메서드는?",
                    "dict.find(key)",
                    "dict.get(key)",
                    "dict.search(key)",
                    "dict.fetch(key)",
                    1,
                    "dict.get(key)는 키가 존재하면 값을 반환하고, 존재하지 않으면 None(또는 지정한 기본값)을 반환합니다. dict[key]는 키가 없으면 KeyError를 발생시킵니다."),
            mc("Python set(집합)의 특징이 아닌 것은?",
                    "중복 요소를 허용하지 않는다",
                    "순서가 보장되지 않는다",
                    "인덱스로 요소에 접근할 수 있다",
                    "합집합, 교집합 연산이 가능하다",
                    2,
                    "set은 순서가 없는 자료구조이므로 인덱스로 요소에 접근할 수 없습니다. 중복을 허용하지 않으며, 합집합(|), 교집합(&), 차집합(-) 등의 집합 연산을 지원합니다."),
            sa("Python에서 리스트에 요소를 추가하는 메서드 이름을 쓰시오.",
                    "append",
                    "list.append(요소)는 리스트의 맨 끝에 하나의 요소를 추가합니다. 여러 요소를 한 번에 추가하려면 extend()를, 특정 위치에 삽입하려면 insert()를 사용합니다."),
            mc("my_list = [1, 2, 3]일 때, my_list[::-1]의 결과는?",
                    "[1, 2, 3]",
                    "[3, 2, 1]",
                    "[3]",
                    "오류 발생",
                    1,
                    "[::-1]은 슬라이싱에서 step이 -1인 경우로, 리스트를 역순으로 반환합니다. 원본 리스트는 변경되지 않고 새로운 역순 리스트가 생성됩니다.")
    );

    // ── 3. 함수 / 모듈 ──
    private static final List<Map<String, Object>> PYTHON_FUNCTION_MODULE = List.of(
            mc("Python에서 함수 정의 시 사용하는 키워드는?",
                    "function",
                    "func",
                    "def",
                    "fn",
                    2,
                    "Python에서 함수는 def 키워드를 사용하여 정의합니다. 'def 함수이름(매개변수):' 형식이며, 함수 본문은 들여쓰기로 구분합니다."),
            mc("Python에서 *args의 역할은?",
                    "키워드 인자를 딕셔너리로 받는다",
                    "가변 개수의 위치 인자를 튜플로 받는다",
                    "인자의 타입을 지정한다",
                    "기본값 인자를 설정한다",
                    1,
                    "*args는 함수에 전달되는 가변 개수의 위치 인자(positional arguments)를 튜플로 묶어서 받습니다. **kwargs는 가변 개수의 키워드 인자를 딕셔너리로 받습니다."),
            mc("Python의 lambda 표현식에 대한 설명으로 옳은 것은?",
                    "여러 줄의 코드를 포함할 수 있다",
                    "이름 없는 한 줄 짜리 익명 함수를 만든다",
                    "반드시 변수에 할당해야 한다",
                    "return 키워드를 반드시 사용해야 한다",
                    1,
                    "lambda는 한 줄로 작성하는 익명 함수입니다. 'lambda 매개변수: 표현식' 형식이며, 표현식의 결과가 자동으로 반환됩니다. 간단한 함수를 인라인으로 정의할 때 유용합니다."),
            sa("Python에서 다른 모듈을 불러올 때 사용하는 키워드를 쓰시오.",
                    "import",
                    "import 키워드로 다른 모듈을 불러옵니다. 'import 모듈명', 'from 모듈명 import 함수명', 'import 모듈명 as 별칭' 등의 형태로 사용합니다."),
            mc("Python에서 함수 내부에서 정의된 변수의 스코프(scope)는?",
                    "전역(global) 스코프",
                    "지역(local) 스코프",
                    "클래스 스코프",
                    "모듈 스코프",
                    1,
                    "함수 내부에서 정의된 변수는 지역(local) 스코프를 가지며, 해당 함수 내에서만 접근 가능합니다. 함수 외부에서는 접근할 수 없으며, 함수 실행이 끝나면 소멸됩니다.")
    );

    // ── 4. 객체지향 / 클래스 / OOP ──
    private static final List<Map<String, Object>> PYTHON_OOP = List.of(
            mc("Python 클래스에서 __init__ 메서드의 역할은?",
                    "객체를 삭제할 때 호출되는 소멸자",
                    "객체 생성 시 초기화를 수행하는 생성자",
                    "클래스의 문자열 표현을 반환",
                    "두 객체를 비교",
                    1,
                    "__init__은 객체가 생성될 때 자동으로 호출되는 초기화 메서드(생성자)입니다. 인스턴스 변수의 초기값을 설정하는 데 사용합니다. 첫 번째 매개변수는 반드시 self입니다."),
            mc("Python 클래스 메서드에서 self가 의미하는 것은?",
                    "클래스 자체를 가리킨다",
                    "현재 인스턴스(객체) 자신을 가리킨다",
                    "부모 클래스를 가리킨다",
                    "전역 변수를 가리킨다",
                    1,
                    "self는 메서드를 호출한 현재 인스턴스(객체) 자신을 가리킵니다. 인스턴스 메서드의 첫 번째 매개변수로 자동 전달되며, 이를 통해 인스턴스 변수와 메서드에 접근합니다."),
            mc("Python에서 상속을 구현하는 올바른 방법은?",
                    "class Child inherits Parent:",
                    "class Child(Parent):",
                    "class Child extends Parent:",
                    "class Child -> Parent:",
                    1,
                    "Python에서 상속은 'class 자식클래스(부모클래스):' 형식으로 구현합니다. 괄호 안에 부모 클래스를 넣으며, 다중 상속도 지원합니다."),
            sa("Python에서 getter/setter를 파이썬스럽게 구현할 때 사용하는 데코레이터를 쓰시오.",
                    "@property",
                    "@property 데코레이터를 사용하면 메서드를 속성처럼 접근할 수 있는 getter를 만들 수 있습니다. @속성명.setter로 setter를 정의하여 값 검증 로직을 추가할 수 있습니다."),
            mc("Python의 매직 메서드(magic method) __str__의 역할은?",
                    "객체의 해시값을 반환",
                    "객체의 사람이 읽기 좋은 문자열 표현을 반환",
                    "두 객체의 동등성을 비교",
                    "객체의 크기를 반환",
                    1,
                    "__str__은 print()나 str()로 객체를 문자열로 변환할 때 호출되는 매직 메서드입니다. 사람이 읽기 좋은 형태의 문자열을 반환하도록 정의합니다.")
    );

    // ── 5. 데코레이터 / 제너레이터 ──
    private static final List<Map<String, Object>> PYTHON_DECORATOR_GENERATOR = List.of(
            mc("Python에서 클로저(closure)란?",
                    "클래스 내부의 메서드",
                    "외부 함수의 변수를 기억하는 내부 함수",
                    "전역 변수를 사용하는 함수",
                    "재귀 호출하는 함수",
                    1,
                    "클로저는 외부 함수가 종료된 후에도 외부 함수의 지역 변수를 기억하고 접근할 수 있는 내부 함수입니다. 데코레이터의 핵심 원리이기도 합니다."),
            mc("Python 데코레이터(@decorator)의 역할은?",
                    "함수를 삭제한다",
                    "기존 함수의 기능을 수정하지 않고 추가 기능을 래핑한다",
                    "함수의 반환 타입을 강제한다",
                    "함수를 비동기로 변환한다",
                    1,
                    "데코레이터는 기존 함수의 코드를 수정하지 않으면서 추가적인 기능(로깅, 인증, 캐싱 등)을 래핑하여 부여합니다. @기호를 사용하며, 함수를 인자로 받아 새 함수를 반환합니다."),
            mc("Python에서 yield 키워드를 사용하는 함수를 무엇이라 하는가?",
                    "코루틴(Coroutine)",
                    "제너레이터(Generator)",
                    "데코레이터(Decorator)",
                    "이터레이터(Iterator)",
                    1,
                    "yield를 포함하는 함수는 제너레이터 함수입니다. 호출 시 제너레이터 객체를 반환하며, next()가 호출될 때마다 yield 지점까지 실행하고 값을 반환한 뒤 상태를 유지합니다."),
            sa("Python 이터레이터 프로토콜에서 다음 값을 반환하는 메서드 이름을 쓰시오.",
                    "__next__",
                    "__next__ 메서드는 이터레이터에서 다음 값을 반환합니다. 더 이상 값이 없으면 StopIteration 예외를 발생시킵니다. __iter__와 함께 이터레이터 프로토콜을 구성합니다."),
            mc("제너레이터의 가장 큰 장점은?",
                    "실행 속도가 일반 함수보다 항상 빠르다",
                    "값을 한꺼번에 메모리에 올리지 않고 필요할 때마다 생성하여 메모리 효율적이다",
                    "멀티스레드 처리가 자동으로 된다",
                    "예외 처리가 필요 없다",
                    1,
                    "제너레이터는 지연 평가(lazy evaluation)를 통해 값을 한꺼번에 생성하지 않고 필요할 때마다 하나씩 생성합니다. 대용량 데이터 처리 시 메모리를 크게 절약할 수 있습니다.")
    );

    // ====================================================================
    //  Web 문제 은행
    // ====================================================================

    // ── 1. HTML ──
    private static final List<Map<String, Object>> WEB_HTML = List.of(
            mc("HTML5에서 시맨틱(Semantic) 태그를 사용하는 이유는?",
                    "페이지 로딩 속도를 높이기 위해",
                    "문서 구조의 의미를 명확히 전달하기 위해",
                    "CSS 스타일을 쉽게 적용하기 위해",
                    "JavaScript 성능을 향상시키기 위해",
                    1,
                    "시맨틱 태그(header, nav, main, section, article, footer 등)는 콘텐츠의 의미와 구조를 명확히 전달합니다. 검색 엔진 최적화(SEO)와 웹 접근성(스크린 리더) 향상에 도움이 됩니다."),
            mc("HTML <form> 태그에서 서버에 데이터를 전송하는 속성으로 올바른 조합은?",
                    "action, method",
                    "src, type",
                    "href, target",
                    "name, value",
                    0,
                    "action 속성은 데이터를 전송할 서버 URL을, method 속성은 전송 방식(GET/POST)을 지정합니다. GET은 URL에 데이터가 노출되고, POST는 본문에 포함되어 전송됩니다."),
            mc("HTML 문서의 첫 줄에 작성하는 <!DOCTYPE html>의 역할은?",
                    "HTML 파일의 인코딩을 지정",
                    "브라우저에게 HTML5 표준 모드로 렌더링하도록 지시",
                    "CSS 파일을 연결",
                    "JavaScript를 활성화",
                    1,
                    "<!DOCTYPE html>은 브라우저에게 이 문서가 HTML5 표준으로 작성되었음을 알려, 표준 모드(Standards Mode)로 렌더링하도록 합니다. 생략하면 호환 모드(Quirks Mode)로 동작할 수 있습니다."),
            sa("HTML에서 이미지에 대체 텍스트를 제공하는 속성의 이름을 쓰시오.",
                    "alt",
                    "alt 속성은 이미지를 표시할 수 없을 때 대체 텍스트를 제공하며, 스크린 리더가 이 텍스트를 읽어 시각장애인의 웹 접근성을 보장합니다. 웹 접근성 표준에서 필수 속성입니다."),
            mc("다음 중 HTML5에서 새로 추가된 입력(input) 타입이 아닌 것은?",
                    "email",
                    "date",
                    "password",
                    "range",
                    2,
                    "password는 HTML5 이전부터 존재하던 입력 타입입니다. email, date, range, color, number, url 등은 HTML5에서 새로 추가되어 브라우저 내장 유효성 검사와 UI를 제공합니다.")
    );

    // ── 2. CSS / 스타일 ──
    private static final List<Map<String, Object>> WEB_CSS = List.of(
            mc("CSS 박스 모델(Box Model)의 구성 요소 순서(안쪽→바깥쪽)로 올바른 것은?",
                    "margin → border → padding → content",
                    "content → padding → border → margin",
                    "padding → content → border → margin",
                    "content → border → padding → margin",
                    1,
                    "CSS 박스 모델은 안쪽부터 content(내용) → padding(안쪽 여백) → border(테두리) → margin(바깥 여백) 순서로 구성됩니다."),
            mc("CSS 선택자 우선순위(Specificity)가 가장 높은 것은?",
                    "태그 선택자 (p)",
                    "클래스 선택자 (.class)",
                    "ID 선택자 (#id)",
                    "전체 선택자 (*)",
                    2,
                    "CSS 우선순위는 !important > inline style > ID 선택자(#) > 클래스 선택자(.) > 태그 선택자 순입니다. ID 선택자가 클래스나 태그보다 높은 우선순위를 가집니다."),
            mc("Flexbox에서 주축(main axis) 방향을 변경하는 속성은?",
                    "justify-content",
                    "align-items",
                    "flex-direction",
                    "flex-wrap",
                    2,
                    "flex-direction은 Flex 컨테이너의 주축 방향을 설정합니다. row(기본값, 가로), column(세로), row-reverse, column-reverse를 사용할 수 있습니다."),
            sa("CSS에서 요소를 문서 흐름에서 완전히 제거하고 특정 위치에 고정하는 position 값을 쓰시오.",
                    "absolute",
                    "position: absolute는 요소를 문서의 일반 흐름에서 제거하고, 가장 가까운 position이 지정된 조상 요소를 기준으로 배치합니다. top, right, bottom, left로 위치를 지정합니다."),
            mc("CSS Grid에서 3열 레이아웃을 만드는 올바른 속성은?",
                    "grid-template-columns: repeat(3, 1fr)",
                    "grid-columns: 3",
                    "display: grid-3",
                    "grid-layout: three-columns",
                    0,
                    "grid-template-columns: repeat(3, 1fr)은 동일한 너비의 3열을 생성합니다. 1fr은 사용 가능한 공간을 균등하게 분배하는 유연한 단위입니다.")
    );

    // ── 3. JavaScript 기초 ──
    private static final List<Map<String, Object>> WEB_JS_BASIC = List.of(
            mc("JavaScript에서 let, const, var의 차이로 올바른 것은?",
                    "셋 다 동일하게 동작한다",
                    "var는 함수 스코프, let/const는 블록 스코프이며 const는 재할당 불가",
                    "let만 재선언이 가능하다",
                    "const는 원시값만 저장할 수 있다",
                    1,
                    "var는 함수 스코프를 가지고 재선언이 가능합니다. let은 블록 스코프이며 재할당은 가능하지만 재선언은 불가합니다. const는 블록 스코프이며 재할당과 재선언 모두 불가합니다."),
            mc("JavaScript 호이스팅(Hoisting)에 대한 설명으로 옳은 것은?",
                    "변수와 함수 선언이 코드 실행 전에 스코프 최상단으로 끌어올려지는 것",
                    "변수의 값이 자동으로 초기화되는 것",
                    "함수가 자동으로 실행되는 것",
                    "변수의 타입이 자동으로 변환되는 것",
                    0,
                    "호이스팅은 변수와 함수 선언이 해당 스코프의 최상단으로 끌어올려지는 것처럼 동작하는 것입니다. var는 undefined로 초기화되지만, let/const는 TDZ(Temporal Dead Zone)에 놓여 초기화 전 접근 시 오류가 발생합니다."),
            mc("화살표 함수(Arrow Function)의 특징이 아닌 것은?",
                    "간결한 문법을 제공한다",
                    "자체 this를 가지지 않고 외부의 this를 사용한다",
                    "arguments 객체를 사용할 수 있다",
                    "한 줄이면 중괄호와 return을 생략할 수 있다",
                    2,
                    "화살표 함수는 자체 arguments 객체를 가지지 않습니다. 또한 자체 this 바인딩이 없어 선언된 외부 스코프의 this를 그대로 사용합니다(렉시컬 this)."),
            sa("JavaScript에서 함수와 해당 함수가 선언된 렉시컬 환경의 조합을 무엇이라 하는가?",
                    "클로저",
                    "클로저(Closure)는 함수와 그 함수가 선언된 렉시컬 환경(변수 스코프)의 조합입니다. 내부 함수가 외부 함수의 변수에 접근할 수 있게 해주며, 데이터 은닉과 상태 유지에 활용됩니다."),
            mc("console.log(typeof null)의 결과는?",
                    "\"null\"",
                    "\"undefined\"",
                    "\"object\"",
                    "\"boolean\"",
                    2,
                    "typeof null은 \"object\"를 반환합니다. 이는 JavaScript 초기 구현의 버그로, 하위 호환성을 위해 수정되지 않았습니다. null은 원시값이지만 typeof에서 \"object\"로 판별됩니다.")
    );

    // ── 4. DOM / 이벤트 ──
    private static final List<Map<String, Object>> WEB_DOM_EVENT = List.of(
            mc("document.querySelector('.myClass')가 반환하는 것은?",
                    "해당 클래스를 가진 모든 요소의 배열",
                    "해당 클래스를 가진 첫 번째 요소",
                    "해당 클래스를 가진 마지막 요소",
                    "null (클래스로는 검색할 수 없음)",
                    1,
                    "querySelector는 CSS 선택자에 일치하는 첫 번째 요소를 반환합니다. 모든 일치 요소를 가져오려면 querySelectorAll을 사용해야 하며, 이는 NodeList를 반환합니다."),
            mc("이벤트 버블링(Event Bubbling)이란?",
                    "이벤트가 최상위 요소에서 하위 요소로 전파",
                    "이벤트가 발생한 요소에서 상위 요소로 전파",
                    "이벤트가 동시에 모든 요소에서 발생",
                    "이벤트가 한 번만 발생하고 사라짐",
                    1,
                    "이벤트 버블링은 이벤트가 발생한 타겟 요소에서 시작하여 DOM 트리를 따라 상위 요소로 전파되는 것입니다. 반대로 캡처링은 최상위에서 타겟까지 내려옵니다."),
            mc("이벤트 위임(Event Delegation)의 장점은?",
                    "이벤트 처리 속도가 빨라진다",
                    "부모에 하나의 핸들러로 여러 자식 요소의 이벤트를 관리할 수 있다",
                    "이벤트 버블링을 방지할 수 있다",
                    "메모리 사용량이 증가한다",
                    1,
                    "이벤트 위임은 이벤트 버블링을 활용하여 부모 요소에 하나의 이벤트 리스너만 등록해 여러 자식 요소의 이벤트를 처리합니다. 동적으로 추가되는 요소도 자동으로 처리되고, 리스너 수가 줄어 메모리가 절약됩니다."),
            sa("이벤트의 기본 동작(예: 링크 이동, 폼 제출)을 막는 메서드 이름을 쓰시오.",
                    "preventDefault",
                    "event.preventDefault()는 이벤트의 기본 동작을 취소합니다. 예를 들어 폼의 submit 이벤트에서 호출하면 페이지 새로고침을 방지하고, 링크 클릭 이벤트에서 호출하면 페이지 이동을 방지합니다."),
            mc("addEventListener의 세 번째 인자로 true를 전달하면?",
                    "이벤트를 한 번만 실행한다",
                    "캡처링 단계에서 이벤트를 처리한다",
                    "이벤트 버블링을 중단한다",
                    "비동기로 이벤트를 처리한다",
                    1,
                    "세 번째 인자에 true(또는 {capture: true})를 전달하면 이벤트 캡처링 단계에서 핸들러가 실행됩니다. 기본값은 false로, 버블링 단계에서 처리합니다.")
    );

    // ── 5. React / 리액트 ──
    private static final List<Map<String, Object>> WEB_REACT = List.of(
            mc("React에서 컴포넌트의 상태(state)를 관리하기 위해 사용하는 Hook은?",
                    "useEffect",
                    "useRef",
                    "useState",
                    "useMemo",
                    2,
                    "useState는 함수형 컴포넌트에서 상태(state)를 선언하고 관리하는 Hook입니다. [상태값, 상태변경함수] 형태의 배열을 반환하며, 상태가 변경되면 컴포넌트가 리렌더링됩니다."),
            mc("React에서 props에 대한 설명으로 옳은 것은?",
                    "자식 컴포넌트에서 직접 수정할 수 있다",
                    "부모가 자식에게 전달하는 읽기 전용 데이터이다",
                    "컴포넌트 내부에서만 사용하는 상태이다",
                    "브라우저의 로컬 스토리지에 저장된다",
                    1,
                    "props는 부모 컴포넌트가 자식 컴포넌트에게 전달하는 읽기 전용(read-only) 데이터입니다. 자식은 props를 수정할 수 없으며, 단방향 데이터 흐름의 핵심 원리입니다."),
            mc("useEffect Hook의 의존성 배열이 빈 배열([])일 때의 동작은?",
                    "매 렌더링마다 실행된다",
                    "컴포넌트 마운트 시 한 번만 실행된다",
                    "실행되지 않는다",
                    "상태가 변경될 때만 실행된다",
                    1,
                    "useEffect의 의존성 배열이 빈 배열([])이면 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다. 클래스 컴포넌트의 componentDidMount와 유사한 역할을 합니다."),
            sa("React가 효율적인 UI 업데이트를 위해 사용하는 메모리 내 DOM 표현을 무엇이라 하는가?",
                    "Virtual DOM",
                    "Virtual DOM(가상 DOM)은 실제 DOM의 가벼운 복사본으로, 상태 변경 시 새로운 Virtual DOM과 이전 Virtual DOM을 비교(diffing)하여 변경된 부분만 실제 DOM에 반영합니다. 이를 통해 DOM 조작을 최소화하여 성능을 향상시킵니다."),
            mc("React에서 리스트를 렌더링할 때 각 요소에 key를 부여하는 이유는?",
                    "CSS 스타일을 적용하기 위해",
                    "React가 요소를 효율적으로 식별하고 업데이트하기 위해",
                    "이벤트 핸들러를 연결하기 위해",
                    "서버에 데이터를 전송하기 위해",
                    1,
                    "key는 React가 리스트의 각 요소를 고유하게 식별하여, 변경/추가/삭제된 항목을 효율적으로 판단하고 최소한의 DOM 업데이트만 수행할 수 있게 합니다. 고유한 값(id 등)을 사용해야 합니다.")
    );

    // ====================================================================
    //  Database / CS 문제 은행
    // ====================================================================

    // ── 1. SQL / 데이터베이스 ──
    private static final List<Map<String, Object>> DB_SQL = List.of(
            mc("SQL에서 두 테이블을 결합할 때 양쪽 테이블에 모두 존재하는 행만 반환하는 JOIN은?",
                    "LEFT JOIN",
                    "RIGHT JOIN",
                    "INNER JOIN",
                    "FULL OUTER JOIN",
                    2,
                    "INNER JOIN은 두 테이블에서 조인 조건을 만족하는(양쪽 모두 존재하는) 행만 반환합니다. LEFT JOIN은 왼쪽 테이블의 모든 행을, RIGHT JOIN은 오른쪽 테이블의 모든 행을 포함합니다."),
            mc("PRIMARY KEY의 특징으로 올바른 것은?",
                    "NULL 값을 허용한다",
                    "중복 값을 허용한다",
                    "NULL을 허용하지 않고 값이 유일해야 한다",
                    "한 테이블에 여러 개 정의할 수 있다",
                    2,
                    "PRIMARY KEY(기본키)는 각 행을 고유하게 식별하는 컬럼으로, NOT NULL이면서 UNIQUE 제약 조건을 동시에 만족해야 합니다. 한 테이블에 하나만 정의할 수 있습니다."),
            mc("INDEX(인덱스)를 사용하는 주된 이유는?",
                    "데이터 삽입 속도를 높이기 위해",
                    "데이터 조회(SELECT) 속도를 높이기 위해",
                    "데이터 무결성을 보장하기 위해",
                    "저장 공간을 절약하기 위해",
                    1,
                    "인덱스는 테이블의 데이터를 빠르게 검색하기 위한 자료구조입니다. 조회 성능을 크게 향상시키지만, 추가 저장 공간이 필요하고 INSERT/UPDATE/DELETE 시 인덱스도 갱신해야 하므로 쓰기 성능은 약간 저하될 수 있습니다."),
            sa("SQL에서 특정 컬럼 기준으로 그룹화한 후 조건을 적용할 때 사용하는 키워드를 쓰시오. (WHERE가 아님)",
                    "HAVING",
                    "HAVING은 GROUP BY로 그룹화한 결과에 조건을 적용하는 키워드입니다. WHERE는 그룹화 전 개별 행에 조건을 적용하고, HAVING은 그룹화 후 집계 결과에 조건을 적용합니다."),
            mc("데이터베이스 정규화(Normalization)의 주된 목적은?",
                    "조회 성능을 최적화하기 위해",
                    "데이터 중복을 최소화하고 무결성을 보장하기 위해",
                    "테이블 수를 줄이기 위해",
                    "인덱스를 자동 생성하기 위해",
                    1,
                    "정규화는 데이터 중복을 최소화하고 데이터 무결성(삽입/갱신/삭제 이상 방지)을 보장하기 위해 테이블을 분리하는 과정입니다. 1NF, 2NF, 3NF, BCNF 등의 단계가 있습니다.")
    );

    // ── 2. 자료구조 ──
    private static final List<Map<String, Object>> CS_DATA_STRUCTURE = List.of(
            mc("배열(Array)과 연결 리스트(Linked List)의 차이로 올바른 것은?",
                    "배열은 삽입이 O(1), 연결 리스트는 접근이 O(1)",
                    "배열은 인덱스 접근이 O(1), 연결 리스트는 중간 삽입/삭제가 O(1)",
                    "배열은 크기 변경이 자유롭다",
                    "연결 리스트는 메모리를 연속적으로 사용한다",
                    1,
                    "배열은 인덱스로 직접 접근하므로 O(1)이지만 중간 삽입/삭제는 O(n)입니다. 연결 리스트는 노드의 포인터만 변경하면 되므로 중간 삽입/삭제가 O(1)이지만 접근은 O(n)입니다."),
            mc("스택(Stack)의 데이터 처리 방식은?",
                    "FIFO (First In, First Out)",
                    "LIFO (Last In, First Out)",
                    "Priority (우선순위 기반)",
                    "Random Access (임의 접근)",
                    1,
                    "스택은 LIFO(Last In, First Out) 구조로, 마지막에 삽입된 데이터가 가장 먼저 꺼내집니다. push(삽입)와 pop(삭제) 연산을 사용하며, 함수 호출 스택, 되돌리기(undo) 등에 활용됩니다."),
            mc("큐(Queue)에서 데이터를 꺼내는 위치는?",
                    "가장 마지막에 들어온 위치(rear)",
                    "가장 먼저 들어온 위치(front)",
                    "중간 위치",
                    "임의의 위치",
                    1,
                    "큐는 FIFO(First In, First Out) 구조로, 가장 먼저 삽입된 데이터가 가장 먼저 꺼내집니다. rear에서 삽입(enqueue)하고 front에서 삭제(dequeue)합니다. 대기열, BFS 등에 활용됩니다."),
            sa("이진 트리를 '루트 → 왼쪽 → 오른쪽' 순서로 순회하는 방식의 이름을 쓰시오.",
                    "전위 순회",
                    "전위 순회(Preorder Traversal)는 루트 → 왼쪽 서브트리 → 오른쪽 서브트리 순서로 방문합니다. 중위(Inorder)는 왼쪽→루트→오른쪽, 후위(Postorder)는 왼쪽→오른쪽→루트 순서입니다."),
            mc("해시 테이블(Hash Table)에서 서로 다른 키가 같은 해시값을 가지는 현상을 무엇이라 하는가?",
                    "오버플로우(Overflow)",
                    "해시 충돌(Hash Collision)",
                    "데드락(Deadlock)",
                    "스택 오버플로우(Stack Overflow)",
                    1,
                    "해시 충돌(Hash Collision)은 서로 다른 키가 해시 함수에 의해 같은 인덱스로 매핑되는 현상입니다. 체이닝(Chaining)이나 개방 주소법(Open Addressing)으로 해결할 수 있습니다.")
    );

    // ── 3. 알고리즘 ──
    private static final List<Map<String, Object>> CS_ALGORITHM = List.of(
            mc("시간 복잡도 O(n)이 의미하는 것은?",
                    "실행 시간이 상수이다",
                    "입력 크기에 비례하여 실행 시간이 증가한다",
                    "입력 크기의 제곱에 비례한다",
                    "입력 크기의 로그에 비례한다",
                    1,
                    "O(n)은 입력 크기 n에 선형적으로 비례하여 실행 시간이 증가함을 의미합니다. 예를 들어 배열의 모든 요소를 한 번씩 방문하는 알고리즘은 O(n)입니다."),
            mc("다음 정렬 알고리즘 중 평균 시간 복잡도가 ��장 좋은 것은?",
                    "버블 정렬 O(n^2)",
                    "선택 정렬 O(n^2)",
                    "삽입 정렬 O(n^2)",
                    "퀵 정렬 O(n log n)",
                    3,
                    "퀵 정렬의 평균 시간 복잡도는 O(n log n)으로, O(n^2)인 버블/선택/삽입 정렬보다 효율적입니다. 단, 최악의 경우 O(n^2)가 될 수 있으나 실제로는 가장 빠른 정렬 중 하나입니다."),
            mc("이진 탐색(Binary Search)의 전제 조건은?",
                    "데이터가 연결 리스트에 저장되어야 한다",
                    "데이터가 정렬되어 있어야 한다",
                    "데이터의 크기가 2의 제곱이어야 한다",
                    "해시 테이블을 사용해야 한다",
                    1,
                    "이진 탐색은 정렬된 배열에서 중간값과 비교하며 탐색 범위를 절반씩 줄여나가는 알고리즘입니다. O(log n)의 시간 복잡도를 가지며, 반드시 데이터가 정렬되어 있어야 합니다."),
            sa("함수가 자기 자신을 다시 호출하는 프로그래밍 기법을 무엇이라 하는가?",
                    "재귀",
                    "재귀(Recursion)는 함수가 자기 자신을 호출하여 문제를 더 작은 하위 문제로 분할하여 해결하는 기법입니다. 반드시 종료 조건(Base Case)이 있어야 무한 호출을 방지할 수 있습니다."),
            mc("다음 중 시간 복잡도가 가장 빠른 것에서 느린 순서로 올바르게 나열한 것은?",
                    "O(1) → O(n) → O(log n) → O(n^2)",
                    "O(1) → O(log n) → O(n) → O(n log n) → O(n^2)",
                    "O(n) → O(1) → O(n^2) → O(log n)",
                    "O(log n) → O(1) → O(n) → O(n^2)",
                    1,
                    "시간 복잡도 순서: O(1) 상수 → O(log n) 로그 → O(n) 선형 → O(n log n) 선형로그 → O(n^2) 이차 → O(2^n) 지수입니다. 입력이 커질수록 차이가 극적으로 벌어집니다.")
    );
}
