# EduCraft AI

> **AI 기반 맞춤형 교육 플랫폼**
>
> 교강사의 수업 준비 시간을 줄이고, 학생에게 학년별 맞춤 학습을 제공하는 차세대 교육 솔루션

<br/>

## 프로젝트 소개

교육 현장에서 교강사는 강의안 작성, 문제 출제, 커리큘럼 설계 등 **수업 준비에 과도한 시간**을 소모하고,
학생은 자신의 수준에 맞는 학습 자료를 찾기 어렵습니다.

**EduCraft AI**는 이 문제를 해결합니다.

- 과목과 주제만 입력하면 **AI가 주차별 커리큘럼을 자동 설계**합니다
- 커리큘럼 기반으로 **강의 자료와 실습 자료를 자동 생성**합니다
- 학습 목표에 맞는 **퀴즈를 자동 출제**하고 **자동 채점**합니다
- 학생의 **학년과 과목에 맞는 AI 퀴즈**를 즉시 풀 수 있습니다
- **학년별 맞춤 유튜브 강의를 추천**하여 자기주도 학습을 지원합니다
- 학생의 오답을 분석하여 **맞춤형 보충 학습 자료**를 제공합니다
- 모든 과정에서 **절약된 시간을 정량적으로 측정**하여 보여줍니다

<br/>

## 핵심 기능

### 교강사 기능

| 기능 | 설명 |
|------|------|
| **AI 커리큘럼 설계** | 과목/주제/주차 수/대상 수준 입력 → 주차별 커리큘럼 자동 생성 |
| **AI 수업 자료 생성** | 커리큘럼 기반 강의자료/실습자료 자동 생성 (난이도 조절 가능) |
| **AI 퀴즈 출제** | 객관식/주관식 문제 자동 생성, 해설 포함 |
| **학생 성취도 대시보드** | 강의 수, 수강생 수, AI 사용 통계, 시간 절약 현황 |
| **배치 통계 집계** | 일일 학습 통계, AI 사용 통계, 비활성 수강생 자동 감지 |

### 학생 기능

| 기능 | 설명 |
|------|------|
| **학년별 AI 퀴즈** | 초등~고등 12개 학년, 국어/영어/수학 3과목 맞춤 퀴즈 (210+ 문제 내장) |
| **맞춤 강의 추천** | 학년에 맞는 유튜브 교육 영상을 과목별로 추천 (검증된 교육 채널) |
| **온라인 퀴즈** | 강의 퀴즈 응시 → 자동 채점 → 해설 확인 |
| **학습 현황 대시보드** | 수강 강의 수, 완료한 퀴즈 수, 평균 점수, 최근 퀴즈 결과 |
| **수업 자료 열람** | 교강사가 생성한 강의자료/실습자료 확인 |
| **AI 보충 학습** | 틀린 문제 기반 맞춤형 보충 설명 + 추가 연습 문제 |

### 공통 기능

| 기능 | 설명 |
|------|------|
| **소셜 로그인** | Google, Kakao, Naver 소셜 계정으로 간편 로그인 |
| **학년 등록** | 회원가입 시 학년 선택 (초등 1학년 ~ 고등 3학년), 맞춤 콘텐츠 제공 |
| **아이디/비밀번호 찾기** | 이름으로 이메일 검색 (마스킹 처리) / 임시 비밀번호 발급 → 재설정 |
| **커뮤니티 피드** | 게시글 작성/조회, 카테고리 필터, 팔로잉 피드 |
| **좋아요 & 댓글** | 게시글 좋아요 토글, 댓글 작성/삭제, 실시간 반영 |
| **팔로우 시스템** | 사용자 간 팔로우/언팔로우, 팔로워/팔로잉 수 표시 |
| **프로필 페이지** | 프로필 정보, 게시글 수, 팔로워/팔로잉 통계 |

<br/>

## 학년별 AI 퀴즈 시스템

한국 교육과정에 맞춘 **오프라인 문제은행 기반 퀴즈 시스템**입니다.

- **지원 학년**: 초등 1~6학년, 중학 1~3학년, 고등 1~3학년 (12개 학년)
- **지원 과목**: 국어, 영어, 수학
- **문제 유형**: 객관식 + 주관식 (과목별 혼합)
- **내장 문제**: 210+ 문제 (7개 대표 학년 x 3과목 x 10문제, 인접 학년 자동 매칭)
- **Fisher-Yates 셔플**: 매번 다른 순서로 출제
- **타이머**: 문항당 2분, 시간 초과 시 자동 제출
- **결과 분석**: O/X 표시, 정답 하이라이트, 문항별 해설 제공
- **대시보드 연동**: 퀴즈 결과가 학생 대시보드에 자동 반영

<br/>

## 맞춤 강의 추천

학생의 학년에 맞는 **검증된 유튜브 교육 영상**을 추천합니다.

- **초등**: onschool 공식 교육 포털 영상
- **중등**: 나무아카데미(국어), 영어의비법(영어), 수악중독(수학)
- **고등**: 메가스터디 인강 (현우진/박석준/조정식), 영어의비법, 나무아카데미
- 학생 로그인 시 학년이 자동 선택되어 바로 맞춤 추천

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
| QueryDSL | 5.1.0 | 타입 안전 쿼리 |
| H2 Database | - | 개발용 인메모리 DB |
| MySQL | 8.0 | 운영 데이터베이스 |

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
| Claude API (Anthropic) | 커리큘럼/자료/퀴즈/보충학습 AI 생성 |
| 오프라인 문제은행 | 학년별 퀴즈 (API 키 없이 동작) |
| YouTube Embed | 학년별 맞춤 강의 추천 |

### Infra
| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 오케스트레이션 |
| Nginx | 프론트엔드 서빙 & 리버스 프록시 |

<br/>

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
└─────────────┬───────────────────────────────┬───────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐   ┌───────────────────────────┐
│    Frontend (:5173)      │   │   YouTube Embed API       │
│  React + TypeScript      │   │   (맞춤 강의 추천)          │
│  Vite + Tailwind CSS     │   └───────────────────────────┘
│  Zustand + TanStack Query│
│  오프라인 문제은행 (210+)   │
└─────────────┬────────────┘
              │ REST API (JSON)
              ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│    Backend (:8080)       │────▶│   Claude API (Anthropic) │
│  Spring Boot 3.2.5       │     │   AI 커리큘럼/자료/퀴즈    │
│  Spring Security (JWT)   │     └─────────────────────────┘
│  Spring Batch            │
│  Spring Data JPA         │     ┌─────────────────────────┐
│                          │────▶│   OAuth 2.0 Providers    │
└─────────────┬────────────┘     │   Google / Kakao / Naver │
              │ JPA              └─────────────────────────┘
              ▼
┌─────────────────────────┐
│   Database               │
│   H2 (개발) / MySQL (운영) │
│   + DataInitializer       │
│   (샘플 데이터 자동 생성)    │
└──────────────────────────┘
```

> **Data Flow**: `Client` → `Spring Boot API` → `H2/MySQL` ↔ `Claude AI`

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
│       │   ├── ai/             # AI 생성 (커리큘럼/자료/퀴즈/학년별 퀴즈 저장)
│       │   ├── batch/          # Spring Batch (통계 집계, 비활성 감지)
│       │   └── dashboard/      # 대시보드 (강의+학년별 퀴즈 통합 통계)
│       ├── global/
│       │   ├── common/         # 공통 응답 (ApiResponse)
│       │   ├── config/         # DataInitializer (샘플 데이터)
│       │   ├── exception/      # 예외 처리
│       │   └── security/       # JWT, Security 설정
│       └── infra/
│           └── ai/             # Claude API 클라이언트
│
└── frontend/
    ├── package.json
    ├── Dockerfile
    └── src/
        ├── api/                # API 클라이언트 (axios)
        ├── stores/             # Zustand 상태 관리 (인증 상태)
        ├── components/         # 공통 컴포넌트 (Layout, 네비게이션)
        └── pages/
            ├── auth/           # 로그인, 회원가입, 소셜로그인, 계정찾기
            ├── dashboard/      # 교강사/학생 대시보드
            ├── course/         # 강의 목록, 탐색, 상세
            ├── curriculum/     # AI 커리큘럼 생성
            ├── material/       # AI 자료 생성
            ├── quiz/           # AI 퀴즈 생성, 퀴즈 풀기, 학년별 AI 퀴즈
            ├── recommend/      # 학년별 유튜브 강의 추천
            └── sns/            # 커뮤니티 피드, 프로필
```

<br/>

## 실행 방법

### 사전 요구사항

- Java 17+
- Node.js 18+
- Docker & Docker Compose (배포 시)
- Anthropic API Key (선택 - AI 생성 기능에 필요, 학년별 퀴즈/강의 추천은 API 키 없이 동작)

### 로컬 개발 환경

```bash
# 1. 저장소 클론
git clone https://github.com/GEONHO96/EduCraft-AI.git
cd EduCraft-AI

# 2. 백엔드 실행 (H2 인메모리 DB - 샘플 데이터 자동 생성)
cd backend
./gradlew bootRun
# AI 생성 기능 사용 시: AI_API_KEY=your-key ./gradlew bootRun

# 3. 프론트엔드 실행 (새 터미널)
cd frontend
npm install
npm run dev
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console

### 샘플 계정

서버 시작 시 DataInitializer가 자동으로 샘플 데이터를 생성합니다.

| 역할 | 이메일 | 비밀번호 | 비고 |
|------|--------|----------|------|
| 교강사 | teacher1@edu.com | password | 수학/영어 강의 담당 |
| 교강사 | teacher2@edu.com | password | 프로그래밍 강의 담당 |
| 학생 | student1@edu.com | password | 중학 1학년 (홍길동) |
| 학생 | student2@edu.com | password | 고등 2학년 (김영희) |
| 학생 | student3@edu.com | password | 초등 5학년 (이철수) |

> 총 5명의 교강사, 18개의 강의, 3명의 학생, 수강 등록 데이터가 자동 생성됩니다.

### Docker 배포

```bash
# 환경변수 설정 (선택)
export AI_API_KEY=your-anthropic-api-key

# Docker Compose 실행
docker-compose up --build
```

<br/>

## API 명세

> 총 **39개** 엔드포인트 | 공통 응답: `{ "success": true, "data": {...} }` 또는 `{ "success": false, "error": {"code": "...", "message": "..."} }`
> 인증: `Authorization: Bearer <JWT_TOKEN>` 헤더 필요 (공개 API 제외)

### 1. 인증 (`/api/auth`) - 7개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| POST | `/api/auth/register` | 공개 | 회원가입 (학년 정보 포함) |
| POST | `/api/auth/login` | 공개 | 로그인 (JWT 발급) |
| POST | `/api/auth/social-login` | 공개 | 소셜 로그인 (Google/Kakao/Naver) |
| GET | `/api/auth/me` | 로그인 | 내 정보 조회 |
| POST | `/api/auth/find-email` | 공개 | 이메일 찾기 (이름 기반, 마스킹) |
| POST | `/api/auth/reset-password` | 공개 | 임시 비밀번호 발급 |
| POST | `/api/auth/change-password` | 공개 | 비밀번호 변경 |

### 2. 강의 (`/api/courses`) - 5개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| POST | `/api/courses` | 교강사 | 강의 생성 |
| GET | `/api/courses` | 로그인 | 내 강의 목록 |
| GET | `/api/courses/browse` | 로그인 | 전체 강의 탐색 |
| GET | `/api/courses/{courseId}` | 로그인 | 강의 상세 |
| POST | `/api/courses/{courseId}/enroll` | 학생 | 수강 신청 |

### 3. 커리큘럼 (`/api`) - 3개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| GET | `/api/courses/{courseId}/curriculums` | 로그인 | 커리큘럼 목록 |
| PUT | `/api/curriculums/{curriculumId}` | 교강사 | 커리큘럼 수정 |
| DELETE | `/api/curriculums/{curriculumId}` | 교강사 | 커리큘럼 삭제 |

### 4. AI 생성 (`/api/ai`) - 5개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| POST | `/api/ai/curriculum/generate` | 교강사 | AI 커리큘럼 생성 |
| POST | `/api/ai/material/generate` | 교강사 | AI 수업 자료 생성 |
| POST | `/api/ai/quiz/generate` | 교강사 | AI 퀴즈 출제 |
| POST | `/api/ai/quiz/grade-quiz` | 로그인 | 학년별 AI 퀴즈 생성 |
| POST | `/api/ai/quiz/grade-quiz/submit` | 로그인 | 학년별 퀴즈 결과 저장 |
| POST | `/api/ai/supplement/generate` | 로그인 | AI 보충학습 생성 |

### 5. 퀴즈 (`/api/quizzes`) - 4개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| GET | `/api/quizzes/{quizId}` | 로그인 | 퀴즈 조회 |
| POST | `/api/quizzes/{quizId}/submit` | 학생 | 퀴즈 제출 (자동 채점) |
| GET | `/api/quizzes/{quizId}/results` | 교강사 | 전체 학생 결과 |
| GET | `/api/quizzes/{quizId}/my-result` | 학생 | 내 퀴즈 결과 |

### 6. 대시보드 (`/api/dashboard`) - 3개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| GET | `/api/dashboard/teacher` | 교강사 | 교강사 대시보드 (강의/수강생/AI 통계) |
| GET | `/api/dashboard/student` | 학생 | 학생 대시보드 (강의+학년별 퀴즈 통합 통계) |
| GET | `/api/dashboard/time-saved` | 교강사 | 시간 절약 통계 |

### 7. 배치 (`/api/batch`) - 1개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| POST | `/api/batch/run/{jobName}` | 교강사 | 배치 수동 실행 |

| jobName | 설명 | 스케줄 |
|---------|------|--------|
| `learning-stats` | 일일 학습 통계 집계 | 매일 자정 |
| `ai-usage-stats` | 일일 AI 사용 통계 | 매일 새벽 1시 |
| `inactive-students` | 비활성 수강생 감지 (7일) | 매주 월요일 오전 9시 |

### 8. SNS 커뮤니티 (`/api/sns`) - 11개

| Method | Endpoint | 권한 | 설명 |
|--------|----------|------|------|
| POST | `/api/sns/posts` | 로그인 | 게시글 작성 |
| GET | `/api/sns/posts` | 로그인 | 전체 피드 (페이징) |
| GET | `/api/sns/posts/following` | 로그인 | 팔로잉 피드 |
| GET | `/api/sns/posts/category/{category}` | 로그인 | 카테고리별 조회 |
| GET | `/api/sns/posts/{postId}` | 로그인 | 게시글 상세 (댓글 포함) |
| DELETE | `/api/sns/posts/{postId}` | 작성자 | 게시글 삭제 |
| POST | `/api/sns/posts/{postId}/like` | 로그인 | 좋아요 토글 |
| POST | `/api/sns/posts/{postId}/comments` | 로그인 | 댓글 작성 |
| DELETE | `/api/sns/comments/{commentId}` | 작성자 | 댓글 삭제 |
| POST | `/api/sns/users/{userId}/follow` | 로그인 | 팔로우 토글 |
| GET | `/api/sns/users/{userId}/profile` | 로그인 | 프로필 조회 |

### API 요약

| 카테고리 | 엔드포인트 수 |
|----------|-------------|
| 인증 | 7개 |
| 강의 | 5개 |
| 커리큘럼 | 3개 |
| AI 생성 | 6개 |
| 퀴즈 | 4개 |
| 대시보드 | 3개 |
| 배치 | 1개 |
| SNS 커뮤니티 | 11개 |
| **합계** | **40개** |

<br/>

## 화면 구성

| 페이지 | 경로 | 설명 |
|--------|------|------|
| **로그인** | `/login` | 이메일 로그인 + 소셜 로그인(Google/Kakao/Naver) |
| **회원가입** | `/register` | 이메일/비밀번호/이름/역할 + 학생은 학년 선택 |
| **계정 찾기** | `/find-account` | 아이디 찾기 / 임시 비밀번호 → 재설정 (3단계) |
| **교강사 대시보드** | `/` | 강의/수강생/AI 사용 통계, 절약 시간 |
| **학생 대시보드** | `/` | 수강 강의, 퀴즈 성적 (강의+학년별 통합), 평균 점수, 바로가기 |
| **강의 관리** | `/courses` | 내 강의 목록, 검색, CRUD |
| **강의 탐색** | `/courses/browse` | 전체 강의 목록, 수강 신청 |
| **강의 상세** | `/courses/:id` | 커리큘럼, 자료, 퀴즈 관리 |
| **AI 커리큘럼 생성** | `/courses/:id/generate-curriculum` | 과목/주제/주차/수준 → AI 설계 |
| **AI 자료 생성** | `/curriculum/:id/generate-material` | 강의/실습 자료 AI 생성 |
| **AI 퀴즈 출제** | `/curriculum/:id/generate-quiz` | 문제 수/난이도/유형 → AI 출제 |
| **퀴즈 풀기** | `/quiz/:id` | 타이머, 진행률, 자동 채점, 해설 |
| **학년별 AI 퀴즈** | `/grade-quiz` | 학년/과목 선택 → 오프라인 퀴즈 → 결과/해설 |
| **맞춤 강의 추천** | `/recommend` | 학년별 유튜브 교육 영상 추천 |
| **커뮤니티 피드** | `/sns/feed` | 전체/팔로잉 피드, 카테고리 필터, 글쓰기 |
| **프로필** | `/sns/profile/:id` | 프로필 카드, 게시글, 팔로우 |

<br/>

## UI/UX 특징

| 항목 | 설명 |
|------|------|
| **반응형 레이아웃** | 모바일 햄버거 메뉴, 데스크톱 네비게이션 바 |
| **로딩 스켈레톤** | 데이터 로딩 시 콘텐츠 형태의 스켈레톤 UI |
| **에러 바운더리** | API 오류 시 재시도 버튼 제공 |
| **실시간 유효성 검사** | 입력 중 즉시 피드백 (비밀번호 불일치, 필수 항목 등) |
| **토스트 알림** | 성공/실패 액션에 대한 즉각적 피드백 (react-hot-toast) |
| **로그아웃 확인 모달** | 실수 방지를 위한 확인 다이얼로그 |
| **퀴즈 타이머** | 문항당 2분, 카운트다운 색상 변화, 시간 초과 자동 제출 |
| **학년 자동 선택** | 학생 로그인 시 등록된 학년으로 자동 설정 |
| **점수 색상 구분** | 80점+ 초록, 60점+ 노랑, 60점 미만 빨강 |

<br/>

## 차별점

| 항목 | 기존 LMS | EduCraft AI |
|------|----------|-------------|
| 수업 준비 | 교강사가 직접 작성 | AI가 자동 생성, 교강사가 검수/수정 |
| 문제 출제 | 수동 출제 | AI 자동 출제 + 자동 채점 + 해설 |
| 커리큘럼 설계 | 경험 기반 수동 설계 | AI가 체계적 설계, 난이도 자동 조절 |
| 학생 자습 | 자료 없음 | **학년별 맞춤 퀴즈 + 유튜브 강의 추천** |
| 보충 학습 | 없음 또는 일괄 제공 | 학생별 오답 기반 맞춤형 보충 자료 |
| 효과 측정 | 불가능 | **절약 시간을 정량적으로 측정** |
| 오프라인 지원 | 불가능 | **API 키 없이도 퀴즈/추천 기능 동작** |

<br/>

## 팀 정보

| 이름 | 역할 |
|------|------|
| GEONHO96 | 기획 / 개발 |
