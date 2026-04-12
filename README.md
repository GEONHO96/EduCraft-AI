# EduCraft AI

> **AI 기반 맞춤형 교육 플랫폼**
>
> 교강사의 수업 준비 시간을 획기적으로 줄이고, 학생에게 학년별 맞춤 학습을 제공하는 AI 차세대 교육 솔루션

<br/>

## 프로젝트 소개

교육 현장에서 교강사는 강의안 작성, 문제 출제, 커리큘럼 설계 등 **수업 준비에 과도한 시간**을 소모하고,
학생은 자신의 수준에 맞는 학습 자료와 연습 문제를 찾기 어렵습니다.

**EduCraft AI**는 이 문제를 해결합니다.

- 과목과 주제만 입력하면 **AI가 주차별 커리큘럼을 자동 설계**합니다
- 커리큘럼 기반으로 **강의 자료와 실습 자료를 자동 생성**합니다
- 학습 목표에 맞는 **퀴즈를 자동 출제**하고 **자동 채점**합니다
- 학생의 **학년과 과목에 맞는 맞춤 퀴즈**를 즉시 풀 수 있습니다
- **학년별 맞춤 유튜브 강의를 추천**하여 자기주도 학습을 지원합니다
- 학생의 오답을 분석하여 **맞춤형 보충 학습 자료**를 제공합니다
- **AI 챗봇 '에듀봇'**이 학습 관련 질문에 실시간으로 답변합니다
- **구독 요금제 시스템**으로 Community / Pro / Max 플랜을 제공합니다
- 모든 과정에서 **절약된 시간을 정량적으로 측정**하여 보여줍니다

<br/>

## 핵심 기능

### 교강사

| 기능 | 설명 |
|------|------|
| **AI 커리큘럼 설계** | 과목/주제/주차 수/대상 수준 입력 → 주차별 커리큘럼 자동 생성 |
| **AI 수업 자료 생성** | 커리큘럼 기반 강의자료/실습자료 자동 생성 (난이도 조절 가능) |
| **AI 퀴즈 출제** | 객관식/주관식 문제 자동 생성, 해설 포함 |
| **학생 성취도 대시보드** | 반 전체 & 개별 학생 성적 분석, 시간 절약 통계 |
| **배치 통계 집계** | 일일 학습 통계, AI 사용 통계, 비활성 수강생 자동 감지 |

### 학생

| 기능 | 설명 |
|------|------|
| **학년별 AI 퀴즈** | 초등~고등 12개 학년 × 국어/영어/수학 3과목 맞춤 퀴즈 (210+ 문제 내장) |
| **맞춤 강의 추천** | 학년에 맞는 검증된 유튜브 교육 영상을 과목별로 추천 |
| **수업 자료 열람** | 교강사가 생성한 강의자료/실습자료 확인 |
| **온라인 퀴즈** | 퀴즈 응시 → 자동 채점 → 해설 확인 |
| **AI 보충 학습** | 틀린 문제 기반 맞춤형 보충 설명 + 추가 연습 문제 |
| **학습 현황 대시보드** | 수강 강의, 퀴즈 점수(강의+학년별 통합), 평균 성적 확인 |

### 공통

| 기능 | 설명 |
|------|------|
| **소셜 로그인** | Google, Kakao, Naver 소셜 계정으로 간편 로그인 (백엔드 프록시 토큰 교환) |
| **학년 등록** | 회원가입 시 학년 선택 (초등 1학년 ~ 고등 3학년), 맞춤 콘텐츠 자동 제공 |
| **아이디 찾기** | 이름으로 가입된 이메일 검색 (마스킹 처리) |
| **비밀번호 재설정** | 임시 비밀번호 발급 → 새 비밀번호 설정 (3단계) |
| **AI 챗봇 (에듀봇)** | 우측 하단 플로팅 위젯, 학습 질문 실시간 답변, 오프라인 키워드 응답 지원 |
| **구독 요금제** | Community(무료) / Pro(₩9,900) / Max(₩19,900) 플랜, 신용카드·토스페이·카카오페이·PayPal 결제 |
| **커뮤니티 피드** | 게시글 작성/조회, 카테고리 필터, 팔로잉 피드 |
| **좋아요 & 댓글** | 게시글 좋아요 토글, 댓글 작성/삭제, 실시간 반영 |
| **팔로우 시스템** | 사용자 간 팔로우/언팔로우, 팔로워/팔로잉 수 표시 |
| **프로필 페이지** | 프로필 정보, 게시글 수, 팔로워/팔로잉 통계 |

<br/>

## 학년별 AI 퀴즈 시스템

한국 교육과정에 맞춘 **오프라인 문제은행 기반 퀴즈 시스템**입니다. API 키 없이도 즉시 동작합니다.

| 항목 | 내용 |
|------|------|
| **지원 학년** | 초등 1~6학년, 중학 1~3학년, 고등 1~3학년 (12개 학년) |
| **지원 과목** | 국어, 영어, 수학 |
| **문제 유형** | 객관식 + 주관식 혼합 |
| **내장 문제** | 210+ 문제 (7개 대표 학년 × 3과목 × 10문제, 인접 학년 자동 매칭) |
| **출제 방식** | Fisher-Yates 셔플 알고리즘으로 매번 다른 순서 출제 |
| **타이머** | 문항당 2분, 시간 초과 시 자동 제출 |
| **결과 분석** | O/X 표시, 정답 하이라이트, 문항별 해설 제공 |
| **대시보드 연동** | 퀴즈 결과가 학생 대시보드에 자동 반영 (강의 퀴즈와 통합 집계) |

<br/>

## 맞춤 강의 추천

학생의 학년에 맞는 **검증된 유튜브 교육 영상**을 추천합니다.

| 학교급 | 추천 채널 |
|--------|----------|
| **초등** | onschool 공식 교육 포털 |
| **중등** | 나무아카데미(국어), 영어의비법(영어), 수악중독(수학) |
| **고등** | 메가스터디(현우진/박석준/조정식), 영어의비법, 나무아카데미 |

> 학생 로그인 시 등록된 학년이 자동 선택되어 바로 맞춤 영상을 확인할 수 있습니다.

<br/>

## AI 챗봇 — 에듀봇

우측 하단에 상주하는 **귀여운 로봇 캐릭터 챗봇**으로, 학습 관련 질문에 실시간으로 답변합니다.

| 항목 | 내용 |
|------|------|
| **위치** | 모든 페이지 우측 하단 플로팅 위젯 |
| **캐릭터** | 애니메이션 안테나, 깜빡이는 눈, 핑크 볼, 하트 펄스 로봇 |
| **온라인 모드** | Claude API를 활용한 교육 전문 AI 답변 |
| **오프라인 모드** | API 키 없이도 키워드 기반 14개 카테고리 자동 응답 |
| **빠른 질문** | "수학 공부법", "영어 단어 암기", "집중력 높이기" 등 원클릭 질문 |
| **UI** | 타이핑 인디케이터, 읽지 않은 메시지 배지, 슬라이드 애니메이션 |

**오프라인 응답 카테고리**: 인사, 자기소개, 수학, 영어, 국어, 퀴즈, 강의, 공부법, 집중/동기부여, 감사, 커뮤니티, 계정, 플랫폼 기능, 학년별 안내

<br/>

## 구독 요금제 & 결제 시스템

| 플랜 | 월 요금 | 주요 기능 |
|------|---------|----------|
| **Community** (무료) | ₩0 | 기본 강의 열람, 학년별 AI 퀴즈, 커뮤니티 참여, 에듀봇 기본 응답 |
| **Pro** | ₩9,900 | AI 커리큘럼 무제한 생성, AI 자료 생성, 고급 퀴즈 분석, 에듀봇 고급 응답 |
| **Max** | ₩19,900 | Pro 전체 + 우선 AI 처리, 맞춤 보충학습, 학습 리포트, 1:1 AI 튜터링 |

### 결제 수단

| 결제 방식 | 설명 |
|----------|------|
| **신용카드** | 카드번호 자동 포맷팅 (4자리 그룹), 유효기간 MM/YY |
| **토스페이** | Toss Pay 간편결제 |
| **카카오페이** | Kakao Pay 간편결제 |
| **PayPal** | 해외 결제 지원 |

### 결제 플로우

```
결제 수단 선택 → 결제 처리 (PG 시뮬레이션) → 완료 확인 → 구독 활성화
```

- UUID 기반 고유 주문번호 생성
- 결제 내역 조회 및 구독 취소/다운그레이드 지원
- 플랜 비교표 (11개 항목 비교)

<br/>

## 기술 스택

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 17 | 언어 |
| Spring Boot | 3.2.5 | 웹 프레임워크 |
| Spring Security | 6.x | 인증/인가 (JWT) |
| Spring Data JPA | 3.x | ORM |
| Spring Batch | 5.x | 배치 작업 (통계 집계, 비활성 감지) |
| Spring Mail | 3.x | 이메일 발송 (Gmail SMTP) |
| QueryDSL | 5.1.0 | 타입 안전 쿼리 |
| H2 Database | - | 개발용 인메모리 DB (샘플 데이터 자동 생성) |
| MySQL | 8.0 | 운영 데이터베이스 |
| Redis | 7 | 캐싱 |

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18 | UI 라이브러리 |
| TypeScript | 5.5 | 타입 안전성 |
| Vite | 5.3 | 빌드 도구 |
| React Router | 6 | 라우팅 |
| TanStack Query | 5 | 서버 상태 관리 |
| Zustand | 4 | 클라이언트 상태 관리 |
| Tailwind CSS | 3.4 | 스타일링 |
| react-hot-toast | - | 토스트 알림 |

### AI & External
| 기술 | 용도 |
|------|------|
| Claude API (Anthropic) | 커리큘럼/자료/퀴즈/보충학습 AI 생성, 에듀봇 챗봇 |
| 오프라인 문제은행 | 학년별 AI 퀴즈 (API 키 없이 동작) |
| 오프라인 챗봇 엔진 | 14개 카테고리 키워드 매칭 응답 (API 키 없이 동작) |
| YouTube Embed API | 학년별 맞춤 강의 영상 추천 |
| PG 결제 시뮬레이션 | 신용카드/토스페이/카카오페이/PayPal 결제 처리 |

### Infra
| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 오케스트레이션 |
| Nginx | 프론트엔드 서빙 & 리버스 프록시 |

<br/>

## 아키텍처

<div align="center">

<table>
<tr>
<td align="center" colspan="5">
<h3>🏗️ System Architecture</h3>
</td>
</tr>
<tr>
<td align="center" width="200">
<h4>📱 Frontend</h4>
<p>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/><br/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/><br/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/><br/>
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/><br/>
<img src="https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand"/>
</p>
<code>:5173</code>
</td>
<td align="center" width="60">
<h2>⟷</h2>
<sub>REST API</sub><br/>
<sub>JSON</sub>
</td>
<td align="center" width="200">
<h4>⚙️ Backend</h4>
<p>
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/><br/>
<img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security"/><br/>
<img src="https://img.shields.io/badge/Spring_Batch-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Batch"/><br/>
<img src="https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/><br/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
</p>
<code>:8080</code>
</td>
<td align="center" width="60">
<h2>⟷</h2>
<sub>JPA</sub><br/>
<sub>Query</sub>
</td>
<td align="center" width="200">
<h4>🗄️ Database</h4>
<p>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/><br/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/><br/>
<img src="https://img.shields.io/badge/H2_(Dev)-0000BB?style=for-the-badge&logoColor=white" alt="H2"/>
</p>
<code>:3306 / :6379</code>
</td>
</tr>
<tr>
<td align="center" colspan="5">
<br/>
<h2>⬇️</h2>
</td>
</tr>
<tr>
<td align="center" colspan="2">
<h4>🤖 AI Engine</h4>
<p>
<img src="https://img.shields.io/badge/Claude_API-191919?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude API"/><br/>
<img src="https://img.shields.io/badge/Anthropic-D4A574?style=for-the-badge&logo=anthropic&logoColor=black" alt="Anthropic"/><br/>
<img src="https://img.shields.io/badge/오프라인_문제은행-FF6B6B?style=for-the-badge&logoColor=white" alt="Offline Quiz"/>
</p>
<sub>커리큘럼 · 자료 · 퀴즈 · 보충학습 생성</sub><br/>
<sub>에듀봇 챗봇 · 학년별 AI 퀴즈 (210+ 내장 문제)</sub>
</td>
<td align="center">
<h4>🔐 OAuth 2.0</h4>
<p>
<img src="https://img.shields.io/badge/Google-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google"/><br/>
<img src="https://img.shields.io/badge/Kakao-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=black" alt="Kakao"/><br/>
<img src="https://img.shields.io/badge/Naver-03C75A?style=for-the-badge&logo=naver&logoColor=white" alt="Naver"/>
</p>
<sub>소셜 로그인</sub>
</td>
<td align="center" colspan="2">
<h4>🚀 Infra & External</h4>
<p>
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/><br/>
<img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/><br/>
<img src="https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube"/>
</p>
<sub>컨테이너 배포 · 맞춤 강의 추천 · PG 결제</sub>
</td>
</tr>
</table>

<br/>

> **Data Flow**: `Client` → `Nginx` → `Spring Boot API` → `MySQL / Redis` ↔ `Claude AI`

</div>

<br/>

## 프로젝트 구조

```
EduCraft-AI/
├── docker-compose.yml
│
├── backend/
│   ├── build.gradle
│   ├── Dockerfile
│   └── src/main/java/com/educraftai/
│       ├── domain/
│       │   ├── user/           # 회원 (회원가입, 로그인, 소셜로그인, 학년 등록)
│       │   ├── course/         # 강의 (생성, 수강신청, 탐색)
│       │   ├── curriculum/     # 커리큘럼 (CRUD)
│       │   ├── material/       # 수업 자료
│       │   ├── quiz/           # 퀴즈 (출제, 응시, 채점, 학년별 퀴즈 결과)
│       │   ├── sns/            # SNS (게시글, 좋아요, 댓글, 팔로우)
│       │   ├── ai/             # AI 생성 (커리큘럼/자료/퀴즈/학년별 퀴즈 저장/챗봇)
│       │   ├── subscription/   # 구독 & 결제 (플랜 관리, PG 결제, 결제 내역)
│       │   ├── batch/          # Spring Batch (통계 집계, 비활성 감지)
│       │   └── dashboard/      # 대시보드 (강의+학년별 퀴즈 통합 통계)
│       ├── global/
│       │   ├── common/         # 공통 응답 (ApiResponse), 이메일 발송 (EmailService)
│       │   ├── config/         # DataInitializer (샘플 데이터 자동 생성)
│       │   ├── exception/      # 예외 처리
│       │   └── security/       # JWT, Security 설정
│       └── infra/
│           └── ai/             # Claude API 클라이언트
│
└── frontend/
    ├── package.json
    ├── Dockerfile
    └── src/
        ├── api/                # API 클라이언트 (axios, ApiResponse<T> 공통 타입)
        ├── types/              # 공통 타입 정의 (ApiResponse)
        ├── stores/             # Zustand 상태 관리 (인증 상태)
        ├── hooks/              # 커스텀 훅 (useDebouncedValue)
        ├── utils/              # 유틸리티 (timeAgo, getErrorMessage)
        ├── constants/          # 상수 (카테고리, 과목, 학년 라벨/색상)
        ├── components/         # 공통 컴포넌트 (Layout, 네비게이션, ChatBot)
        └── pages/
            ├── auth/           # 로그인, 회원가입(학년 선택), 소셜로그인, 계정찾기
            ├── dashboard/      # 교강사/학생 대시보드
            ├── course/         # 강의 목록, 탐색, 상세
            ├── curriculum/     # AI 커리큘럼 생성
            ├── material/       # AI 자료 생성
            ├── quiz/           # AI 퀴즈 생성, 퀴즈 풀기, 학년별 AI 퀴즈
            ├── recommend/      # 학년별 유튜브 강의 추천
            ├── subscription/   # 구독 요금제 & 결제
            └── sns/            # 커뮤니티 피드, 프로필
```

<br/>

## 실행 방법

### 사전 요구사항

- Java 17+
- Node.js 18+
- Docker & Docker Compose (배포 시)
- Anthropic API Key (선택 — 학년별 퀴즈/강의 추천/챗봇은 API 키 없이 동작)
- Google Cloud OAuth Client ID (소셜 로그인 시)
- Gmail 앱 비밀번호 (임시 비밀번호 이메일 발송 시)

### 로컬 개발 환경

```bash
# 1. 저장소 클론
git clone https://github.com/GEONHO96/EduCraft-AI.git
cd EduCraft-AI

# 2. 백엔드 실행 (H2 인메모리 DB, 샘플 데이터 자동 생성)
cd backend
./gradlew bootRun
# AI 생성 + 이메일 발송 기능 사용 시:
# AI_API_KEY=your-key MAIL_USERNAME=your@gmail.com MAIL_PASSWORD=your-app-password ./gradlew bootRun

# 3. 프론트엔드 환경변수 설정 (새 터미널)
cd frontend
cp .env.example .env
# .env 파일에 소셜 로그인 Client ID 입력

# 4. 프론트엔드 실행
npm install
npm run dev
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console

### 샘플 계정

서버 시작 시 `DataInitializer`가 자동으로 샘플 데이터를 생성합니다.

| 역할 | 이메일 | 비밀번호 | 비고 |
|------|--------|----------|------|
| 교강사 | teacher1@edu.com | password | 수학/영어 강의 담당 |
| 교강사 | teacher2@edu.com | password | 프로그래밍 강의 담당 |
| 학생 | student1@edu.com | password | 중학 1학년 (홍길동) |
| 학생 | student2@edu.com | password | 고등 2학년 (김영희) |
| 학생 | student3@edu.com | password | 초등 5학년 (이철수) |

> 총 5명의 교강사, 18개의 강의, 3명의 학생, 수강 등록 데이터가 자동 생성됩니다.

### 환경변수 설정

#### 프론트엔드 (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_KAKAO_CLIENT_ID=your-kakao-client-id
VITE_NAVER_CLIENT_ID=your-naver-client-id
```

> Naver/Kakao Client Secret은 보안상 프론트엔드에 노출하지 않고, **백엔드 `application.yml`에서만 관리**합니다.

#### 백엔드 (`application.yml` 소셜 로그인 설정)

```yaml
social:
  naver:
    client-id: your-naver-client-id
    client-secret: your-naver-client-secret
  kakao:
    client-id: your-kakao-client-id
```

#### 백엔드 (환경변수)

| 변수 | 용도 | 필수 |
|------|------|------|
| `AI_API_KEY` | Anthropic Claude API 키 | 선택 (AI 생성/챗봇 온라인 모드) |
| `MAIL_USERNAME` | Gmail 계정 (이메일 발송용) | 선택 (임시 비밀번호 이메일 발송) |
| `MAIL_PASSWORD` | Gmail 앱 비밀번호 | 선택 (임시 비밀번호 이메일 발송) |

#### Google OAuth 설정 방법

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** → **사용자 인증 정보** → **OAuth 클라이언트 ID** 생성
3. 승인된 JavaScript 원본: `http://localhost:5173`
4. 승인된 리디렉션 URI: `http://localhost:5173/auth/google/callback`
5. 발급된 Client ID를 `frontend/.env`의 `VITE_GOOGLE_CLIENT_ID`에 입력

#### Kakao OAuth 설정 방법

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. **내 애플리케이션** → **앱 생성** → **카카오 로그인** 활성화
3. **Redirect URI**: `http://localhost:5173/auth/kakao/callback`
4. 앱 키(REST API 키)를 `frontend/.env`의 `VITE_KAKAO_CLIENT_ID`에 입력
5. 동일 앱 키를 `backend/application.yml`의 `social.kakao.client-id`에 입력

#### Naver OAuth 설정 방법

1. [NAVER Developers](https://developers.naver.com/) 접속
2. **Application** → **애플리케이션 등록** → 사용 API: **네이버 로그인**
3. 서비스 환경: **PC 웹** 추가
4. 서비스 URL: `http://localhost:5173`
5. Callback URL: `http://localhost:5173/auth/naver/callback`
6. 발급된 Client ID를 `frontend/.env`의 `VITE_NAVER_CLIENT_ID`에 입력
7. Client ID/Secret을 `backend/application.yml`의 `social.naver.*`에 입력

> **CORS 참고**: Naver/Kakao 토큰 교환 API는 브라우저 CORS를 차단하므로, 프론트엔드가 authorization code를 백엔드로 전달하고 백엔드에서 서버 간 통신으로 토큰을 교환합니다.

### Docker 배포

```bash
# 환경변수 설정 (선택)
export AI_API_KEY=your-anthropic-api-key
export MAIL_USERNAME=your@gmail.com
export MAIL_PASSWORD=your-gmail-app-password

# Docker Compose 실행
docker-compose up --build
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8080

<br/>

## API 명세

> 총 **47개** 엔드포인트 | 공통 응답 형식: `{ "success": true, "data": {...} }` 또는 `{ "success": false, "error": {"code": "...", "message": "..."} }`  
> 인증: `Authorization: Bearer <JWT_TOKEN>` 헤더 필요 (공개 API 제외)

---

### 1. 인증 (`/api/auth`)

#### `POST /api/auth/register` — 회원가입
> 권한: 공개

**Request**
```json
{
  "email": "student1@edu.com",
  "password": "password123",
  "name": "홍길동",
  "role": "STUDENT",
  "grade": "MIDDLE_1"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | String | O | 이메일 (중복 불가) |
| password | String | O | 비밀번호 |
| name | String | O | 이름 |
| role | Enum | O | `TEACHER` 또는 `STUDENT` |
| grade | String | X | 학년 코드 (학생만, `ELEMENTARY_1` ~ `HIGH_3`) |

**Response**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJI...",
    "user": {
      "id": 1,
      "email": "student1@edu.com",
      "name": "홍길동",
      "role": "STUDENT",
      "grade": "MIDDLE_1",
      "profileImage": null,
      "socialProvider": null
    }
  }
}
```

---

#### `POST /api/auth/login` — 로그인
> 권한: 공개

**Request**
```json
{
  "email": "student1@edu.com",
  "password": "password123"
}
```

**Response** — 회원가입과 동일한 Token 형식

---

#### `POST /api/auth/social-login` — 소셜 로그인 (access token 방식)
> 권한: 공개 | Google에서 사용 (implicit flow)

**Request**
```json
{
  "accessToken": "소셜 플랫폼에서 받은 액세스 토큰",
  "provider": "GOOGLE",
  "role": "TEACHER"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| accessToken | String | O | 소셜 플랫폼 액세스 토큰 |
| provider | Enum | O | `GOOGLE`, `KAKAO`, `NAVER` |
| role | Enum | X | 최초 가입 시 역할 (기본: `STUDENT`) |

**Response** — Token 형식 (profileImage, socialProvider 포함)

---

#### `POST /api/auth/social-login/code` — 소셜 로그인 (authorization code 방식)
> 권한: 공개 | Kakao, Naver에서 사용 (CORS 우회, 백엔드 토큰 교환)

**Request**
```json
{
  "code": "OAuth 인증 후 받은 authorization code",
  "state": "CSRF 방지용 상태값 (Naver만 필수)",
  "provider": "NAVER",
  "role": "STUDENT",
  "redirectUri": "http://localhost:5173/auth/naver/callback"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| code | String | O | OAuth authorization code |
| state | String | X | CSRF 방지 상태값 (Naver 필수) |
| provider | Enum | O | `KAKAO`, `NAVER` |
| role | Enum | X | 최초 가입 시 역할 (기본: `STUDENT`) |
| redirectUri | String | O | OAuth 콜백 URL |

**Response** — Token 형식 (profileImage, socialProvider 포함)

> 백엔드가 authorization code를 access token으로 교환한 뒤, 소셜 플랫폼 사용자 정보를 조회하여 로그인/가입 처리

---

#### `GET /api/auth/me` — 내 정보 조회
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student1@edu.com",
    "name": "홍길동",
    "role": "STUDENT",
    "grade": "MIDDLE_1",
    "profileImage": null,
    "socialProvider": null
  }
}
```

---

#### `POST /api/auth/find-email` — 아이디(이메일) 찾기
> 권한: 공개

**Request**
```json
{ "name": "홍길동" }
```

**Response**
```json
{
  "success": true,
  "data": ["stu***@edu.com"]
}
```
> 보안을 위해 이메일 일부가 마스킹 처리됩니다.

---

#### `POST /api/auth/reset-password` — 임시 비밀번호 발급
> 권한: 공개

**Request**
```json
{
  "email": "student1@edu.com",
  "name": "홍길동"
}
```

**Response**
```json
{
  "success": true,
  "data": { "tempPassword": "aB3xK9mP" }
}
```

---

#### `POST /api/auth/change-password` — 비밀번호 변경
> 권한: 공개

**Request**
```json
{
  "email": "student1@edu.com",
  "tempPassword": "aB3xK9mP",
  "newPassword": "newPassword123"
}
```

**Response**
```json
{ "success": true, "data": null }
```

---

### 2. 강의 (`/api/courses`)

#### `POST /api/courses` — 강의 생성
> 권한: 교강사

**Request**
```json
{
  "title": "웹 프로그래밍 기초",
  "subject": "컴퓨터공학",
  "description": "HTML, CSS, JavaScript를 활용한 웹 개발 입문 과정"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "웹 프로그래밍 기초",
    "subject": "컴퓨터공학",
    "description": "HTML, CSS, JavaScript를 활용한 웹 개발 입문 과정",
    "teacherName": "김교수",
    "createdAt": "2026-04-11T10:30:00"
  }
}
```

---

#### `GET /api/courses` — 내 강의 목록
> 권한: 로그인 필요 | 교강사: 내가 만든 강의 / 학생: 수강 중인 강의

---

#### `GET /api/courses/browse` — 전체 강의 탐색
> 권한: 로그인 필요 | 모든 강의 목록 (수강 신청용)

---

#### `GET /api/courses/{courseId}` — 강의 상세
> 권한: 로그인 필요

---

#### `POST /api/courses/{courseId}/enroll` — 수강 신청
> 권한: 학생

---

### 3. 커리큘럼 (`/api`)

#### `GET /api/courses/{courseId}/curriculums` — 커리큘럼 목록
> 권한: 로그인 필요

---

#### `PUT /api/curriculums/{curriculumId}` — 커리큘럼 수정
> 권한: 교강사

---

#### `DELETE /api/curriculums/{curriculumId}` — 커리큘럼 삭제
> 권한: 교강사

---

### 4. AI 생성 (`/api/ai`)

#### `POST /api/ai/curriculum/generate` — AI 커리큘럼 생성
> 권한: 교강사

**Request**
```json
{
  "courseId": 1,
  "subject": "컴퓨터공학",
  "topic": "웹 프로그래밍",
  "totalWeeks": 15,
  "targetLevel": "초급",
  "additionalRequirements": "실습 위주로 구성해주세요"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "courseId": 1,
    "weeks": [
      {
        "weekNumber": 1,
        "topic": "HTML 기초",
        "objectives": "HTML 태그 구조 이해, 기본 페이지 제작",
        "content": "상세 강의 내용..."
      }
    ],
    "timeSavedSeconds": 3600
  }
}
```

---

#### `POST /api/ai/material/generate` — AI 수업 자료 생성
> 권한: 교강사

**Request**
```json
{
  "curriculumId": 1,
  "type": "LECTURE",
  "difficulty": 3,
  "additionalRequirements": "예제 코드를 많이 포함해주세요"
}
```

---

#### `POST /api/ai/quiz/generate` — AI 퀴즈 생성
> 권한: 교강사

**Request**
```json
{
  "curriculumId": 1,
  "questionCount": 10,
  "difficulty": 3,
  "questionTypes": "MULTIPLE_CHOICE,SHORT_ANSWER"
}
```

---

#### `POST /api/ai/quiz/grade-quiz` — 학년별 AI 퀴즈 생성
> 권한: 로그인 필요

**Request**
```json
{
  "grade": "MIDDLE_1",
  "subject": "수학",
  "questionCount": 5,
  "difficulty": 3
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "questionsJson": "[{...}]",
    "questionCount": 5,
    "grade": "MIDDLE_1",
    "subject": "수학"
  }
}
```

---

#### `POST /api/ai/quiz/grade-quiz/submit` — 학년별 퀴즈 결과 저장
> 권한: 로그인 필요

**Request**
```json
{
  "grade": "MIDDLE_1",
  "subject": "수학",
  "score": 4,
  "totalQuestions": 5
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "grade": "MIDDLE_1",
    "subject": "수학",
    "score": 4,
    "totalQuestions": 5,
    "submittedAt": "2026-04-12T15:30:00"
  }
}
```

---

#### `POST /api/ai/supplement/generate` — AI 보충학습 생성
> 권한: 로그인 필요

**Request**
```json
{
  "quizSubmissionId": 1,
  "additionalRequirements": "쉬운 예제부터 단계적으로"
}
```

---

### 5. 퀴즈 (`/api/quizzes`)

#### `GET /api/quizzes/{quizId}` — 퀴즈 조회
> 권한: 로그인 필요

---

#### `POST /api/quizzes/{quizId}/submit` — 퀴즈 제출
> 권한: 학생

**Request**
```json
{
  "answersJson": "[{\"questionIndex\": 0, \"answer\": \"A\"}, {\"questionIndex\": 1, \"answer\": \"B\"}]"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "quizId": 1,
    "score": 8,
    "totalQuestions": 10,
    "submittedAt": "2026-04-11T11:30:00"
  }
}
```

---

#### `GET /api/quizzes/{quizId}/results` — 퀴즈 결과 (전체)
> 권한: 교강사

---

#### `GET /api/quizzes/{quizId}/my-result` — 내 퀴즈 결과
> 권한: 학생

---

### 6. 대시보드 (`/api/dashboard`)

#### `GET /api/dashboard/teacher` — 교강사 대시보드
> 권한: 교강사

**Response**
```json
{
  "success": true,
  "data": {
    "totalCourses": 3,
    "totalStudents": 45,
    "totalMaterials": 12,
    "totalQuizzes": 8,
    "timeSaved": {
      "totalSeconds": 18000,
      "generationCount": 23,
      "formatted": "5시간 0분"
    },
    "recentActivities": [...]
  }
}
```

---

#### `GET /api/dashboard/student` — 학생 대시보드
> 권한: 학생 | 강의 퀴즈 + 학년별 AI 퀴즈 **통합 집계**

**Response**
```json
{
  "success": true,
  "data": {
    "enrolledCourses": 2,
    "completedQuizzes": 5,
    "averageScore": 85.5,
    "recentQuizResults": [
      {
        "quizTitle": "중학 1학년 수학 퀴즈",
        "score": 4,
        "totalQuestions": 5,
        "submittedAt": "2026-04-12T15:30:00"
      },
      {
        "quizTitle": "HTML 기초 퀴즈",
        "score": 9,
        "totalQuestions": 10,
        "submittedAt": "2026-04-11T11:30:00"
      }
    ]
  }
}
```

---

#### `GET /api/dashboard/time-saved` — 시간 절약 통계
> 권한: 교강사

---

### 7. 배치 (`/api/batch`)

#### `POST /api/batch/run/{jobName}` — 배치 수동 실행
> 권한: 교강사

| jobName | 설명 | 자동 스케줄 |
|---------|------|------------|
| `learning-stats` | 일일 학습 통계 집계 | 매일 자정 |
| `ai-usage-stats` | 일일 AI 사용 통계 집계 | 매일 새벽 1시 |
| `inactive-students` | 비활성 수강생 감지 (7일) | 매주 월요일 오전 9시 |

---

### 8. SNS 커뮤니티 (`/api/sns`)

#### `POST /api/sns/posts` — 게시글 작성
> 권한: 로그인 필요

**Request**
```json
{
  "content": "오늘 수업에서 배운 HTML 기초 정리합니다!",
  "imageUrl": "https://example.com/image.jpg",
  "category": "CLASS_SHARE"
}
```
| 카테고리 | 설명 |
|----------|------|
| `FREE` | 자유 (기본) |
| `STUDY_TIP` | 공부 팁 |
| `CLASS_SHARE` | 수업 공유 |
| `QNA` | 질문 & 답변 |
| `RESOURCE` | 자료 공유 |

---

#### `GET /api/sns/posts` — 전체 피드
> 권한: 로그인 필요 | 페이징: `?page=0&size=10`

---

#### `GET /api/sns/posts/following` — 팔로잉 피드
> 권한: 로그인 필요 | 팔로우한 사용자 + 내 게시글

---

#### `GET /api/sns/posts/category/{category}` — 카테고리별 조회
> 권한: 로그인 필요

---

#### `GET /api/sns/posts/{postId}` — 게시글 상세 (댓글 포함)
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "author": { "id": 1, "name": "김교수", "profileImage": null, "role": "TEACHER" },
    "content": "오늘 수업에서 배운 HTML 기초 정리합니다!",
    "imageUrl": "https://example.com/image.jpg",
    "category": "CLASS_SHARE",
    "likeCount": 5,
    "commentCount": 2,
    "liked": true,
    "comments": [
      { "id": 1, "author": { "id": 2, "name": "홍길동", "role": "STUDENT" }, "content": "좋은 정리 감사합니다!", "createdAt": "2026-04-11T15:00:00" }
    ],
    "createdAt": "2026-04-11T14:30:00"
  }
}
```

---

#### `DELETE /api/sns/posts/{postId}` — 게시글 삭제
> 권한: 작성자만

---

#### `POST /api/sns/posts/{postId}/like` — 좋아요 토글
> 권한: 로그인 필요

**Response**
```json
{ "success": true, "data": { "liked": true, "likeCount": 6 } }
```

---

#### `POST /api/sns/posts/{postId}/comments` — 댓글 작성
> 권한: 로그인 필요

**Request**
```json
{ "content": "좋은 글이네요!" }
```

---

#### `DELETE /api/sns/comments/{commentId}` — 댓글 삭제
> 권한: 작성자만

---

#### `POST /api/sns/users/{userId}/follow` — 팔로우 토글
> 권한: 로그인 필요

**Response**
```json
{ "success": true, "data": { "following": true, "followerCount": 12 } }
```

---

#### `GET /api/sns/users/{userId}/profile` — 프로필 조회
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1, "name": "김교수", "profileImage": null, "role": "TEACHER",
    "postCount": 15, "followerCount": 42, "followingCount": 8, "isFollowing": false
  }
}
```

---

### 9. AI 챗봇 (`/api/chat`)

#### `POST /api/chat` — 에듀봇 대화
> 권한: 로그인 필요

**Request**
```json
{ "message": "수학 공부 어떻게 하면 좋을까?" }
```

**Response**
```json
{
  "success": true,
  "data": {
    "reply": "수학은 개념 이해가 가장 중요해요! ...",
    "offline": false
  }
}
```
> `offline: true`인 경우 오프라인 키워드 응답, `false`인 경우 Claude AI 응답

---

### 10. 구독 & 결제 (`/api/subscription`)

#### `GET /api/subscription/me` — 현재 구독 상태 조회
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": {
    "plan": "PRO",
    "status": "ACTIVE",
    "startedAt": "2026-04-12T10:00:00",
    "nextBillingAt": "2026-05-12T10:00:00",
    "cancelledAt": null
  }
}
```

---

#### `GET /api/subscription/payments` — 결제 내역 조회
> 권한: 로그인 필요

---

#### `POST /api/subscription/subscribe` — 구독 신청 (결제)
> 권한: 로그인 필요

**Request**
```json
{
  "plan": "PRO",
  "paymentMethod": "CREDIT_CARD",
  "cardNumber": "1234-5678-9012-3456",
  "cardExpiry": "12/28"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "plan": "PRO",
    "status": "ACTIVE",
    "orderId": "ORD-xxxxxxxx",
    "amount": 9900,
    "paymentMethod": "CREDIT_CARD",
    "nextBillingAt": "2026-05-12T10:00:00"
  }
}
```

---

#### `POST /api/subscription/cancel` — 구독 취소
> 권한: 로그인 필요

---

#### `POST /api/subscription/downgrade` — 무료 플랜으로 변경
> 권한: 로그인 필요

---

### API 요약

| 카테고리 | 엔드포인트 수 | 권한 |
|----------|-------------|------|
| 인증 | 8개 | 공개 7 / 로그인 1 |
| 강의 | 5개 | 교강사 1 / 학생 1 / 로그인 3 |
| 커리큘럼 | 3개 | 교강사 2 / 로그인 1 |
| AI 생성 | 6개 | 교강사 3 / 로그인 3 |
| 퀴즈 | 4개 | 교강사 1 / 학생 2 / 로그인 1 |
| 대시보드 | 3개 | 교강사 2 / 학생 1 |
| 배치 | 1개 | 교강사 1 |
| SNS 커뮤니티 | 11개 | 로그인 9 / 작성자 2 |
| AI 챗봇 | 1개 | 로그인 1 |
| 구독 & 결제 | 5개 | 로그인 5 |
| **합계** | **47개** | |

<br/>

## 화면 구성

| 페이지 | 경로 | 설명 |
|--------|------|------|
| **로그인** | `/login` | 이메일 로그인 + 소셜 로그인(Google/Kakao/Naver) 버튼, 아이디/비밀번호 찾기 링크 |
| **회원가입** | `/register` | 이메일/비밀번호/이름 입력, 교강사/학생 역할 선택, 학생은 학년 선택(초등~고등) |
| **소셜 로그인 콜백** | `/auth/:provider/callback` | OAuth 인증 후 역할 선택(신규 가입 시), 자동 로그인 처리 |
| **아이디/비밀번호 찾기** | `/find-account` | 탭 기반 UI — 이름으로 이메일 찾기 / 임시 비밀번호 발급 → 새 비밀번호 설정 (3단계) |
| **교강사 대시보드** | `/` | 강의 수, 수강생 수, AI 생성 횟수, 절약 시간 통계, 로딩 스켈레톤, 에러 재시도 |
| **학생 대시보드** | `/` | 수강 강의, 퀴즈 성적(강의+학년별 통합), 평균 점수, 바로가기 버튼 |
| **강의 관리** | `/courses` | 강의 CRUD, 검색 필터, 카드 호버 효과, 로딩 스켈레톤, 빈 상태 표시 |
| **강의 탐색** | `/courses/browse` | 전체 강의 목록, 수강 신청 |
| **강의 상세** | `/courses/:courseId` | 커리큘럼, 자료, 퀴즈 관리 |
| **AI 커리큘럼 생성** | `/courses/:courseId/generate-curriculum` | 과목/주제/주차/수준 입력 → AI 자동 설계 |
| **AI 자료 생성** | `/curriculum/:curriculumId/generate-material` | 강의/실습 자료 AI 자동 생성 (난이도 조절) |
| **AI 퀴즈 출제** | `/curriculum/:curriculumId/generate-quiz` | 문제 수/난이도/유형 설정 → AI 자동 출제 |
| **퀴즈 풀기** | `/quiz/:quizId` | 카운트다운 타이머, 진행률 바, 자동 제출, 정답/오답 시각적 표시, 해설 |
| **학년별 AI 퀴즈** | `/grade-quiz` | 학년/과목 선택 → 오프라인 퀴즈 생성 → 풀기 → 결과 & 해설 확인 |
| **맞춤 강의 추천** | `/recommend` | 학년별 검증된 유튜브 교육 영상 추천, 과목별 탭 |
| **요금제** | `/pricing` | Community/Pro/Max 플랜 비교, 결제 모달(3단계), 결제 내역, 구독 관리 |
| **커뮤니티 피드** | `/sns/feed` | 전체/팔로잉 피드 전환, 카테고리 필터, 글쓰기 모달, 좋아요, 댓글 |
| **프로필** | `/sns/profile/:userId` | 사용자 프로필 카드, 팔로워/팔로잉 수, 게시글 목록, 팔로우/언팔로우 |
| **에듀봇 챗봇** | 전체 페이지 (우측 하단) | 플로팅 챗봇 위젯, 빠른 질문 버튼, 온/오프라인 AI 응답 |

<br/>

## UI/UX 특징

| 항목 | 설명 |
|------|------|
| **반응형 레이아웃** | 모바일 햄버거 메뉴, 데스크톱 네비게이션 바 |
| **로딩 스켈레톤** | 데이터 로딩 시 콘텐츠 형태의 스켈레톤 UI 표시 |
| **에러 바운더리** | 컴포넌트 오류 시 전체 앱 크래시 방지, 재시도 버튼 제공 |
| **실시간 유효성 검사** | 비밀번호 불일치 시 즉시 빨간 테두리 + 메시지 표시 |
| **토스트 알림** | 성공/실패 액션에 대한 즉각적인 피드백 (react-hot-toast) |
| **로그아웃 확인** | 실수 방지를 위한 모달 확인 다이얼로그 |
| **퀴즈 타이머** | 남은 시간 카운트다운 + 색상 변화 + 시간 초과 시 자동 제출 |
| **학년 자동 선택** | 학생 로그인 시 등록된 학년으로 퀴즈/추천 자동 설정 |
| **점수 색상 구분** | 80점+ 초록, 60점+ 노랑, 60점 미만 빨강 시각적 표시 |
| **AI 챗봇 위젯** | 귀여운 로봇 캐릭터, 슬라이드 애니메이션, 타이핑 인디케이터, 읽지 않은 메시지 배지 |
| **결제 모달** | 3단계 프로세스 (결제 수단 → 처리 중 → 완료), 카드번호 자동 포맷팅 |
| **접근성** | 시맨틱 HTML, 키보드 네비게이션, 포커스 링 표시 |

<br/>

## 차별점

| 항목 | 기존 LMS | EduCraft AI |
|------|----------|-------------|
| 수업 준비 | 교강사가 직접 작성 | AI가 자동 생성, 교강사가 검수/수정 |
| 문제 출제 | 수동 출제 | AI 자동 출제 + 자동 채점 + 해설 |
| 커리큘럼 설계 | 경험 기반 수동 설계 | AI가 체계적 설계, 난이도 자동 조절 |
| 학생 자습 | 자료 없음 | **학년별 맞춤 퀴즈 + 유튜브 강의 추천** |
| 보충 학습 | 없음 또는 일괄 제공 | 학생별 오답 기반 맞춤형 보충 자료 |
| AI 학습 도우미 | 없음 | **에듀봇 챗봇 — 실시간 학습 질문 답변 (온/오프라인)** |
| 요금제 | 없거나 단순 | **3단계 플랜 + 4종 결제 수단 (국내+해외)** |
| 효과 측정 | 불가능 | **절약 시간을 정량적으로 측정** |
| 오프라인 지원 | 불가능 | **API 키 없이도 퀴즈/추천/챗봇 기능 동작** |

<br/>

## 팀 정보

| 이름 | 역할 |
|------|------|
| GEONHO96 | 기획 / 개발 |
