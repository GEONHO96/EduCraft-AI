# EduCraft AI

> **AI 수업 자료 생성 & 커리큘럼 설계 도우미**
>
> 교강사의 수업 준비 시간을 획기적으로 줄여주는 AI 기반 차세대 교육 솔루션

<br/>

## 프로젝트 소개

교육 현장에서 교강사는 강의안 작성, 문제 출제, 커리큘럼 설계 등 **수업 준비에 과도한 시간**을 소모합니다.

**EduCraft AI**는 이 문제를 해결합니다.

- 과목과 주제만 입력하면 **AI가 주차별 커리큘럼을 자동 설계**합니다
- 커리큘럼 기반으로 **강의 자료와 실습 자료를 자동 생성**합니다
- 학습 목표에 맞는 **퀴즈를 자동 출제**하고 **자동 채점**합니다
- 학생의 오답을 분석하여 **맞춤형 보충 학습 자료**를 제공합니다
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

### 학생

| 기능 | 설명 |
|------|------|
| **수업 자료 열람** | 교강사가 생성한 강의자료/실습자료 확인 |
| **온라인 퀴즈** | 퀴즈 응시 → 자동 채점 → 해설 확인 |
| **AI 보충 학습** | 틀린 문제 기반 맞춤형 보충 설명 + 추가 연습 문제 |
| **학습 현황** | 수강 강의, 퀴즈 점수, 평균 성적 확인 |

<br/>

## 기술 스택

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 17 | 언어 |
| Spring Boot | 3.2.5 | 웹 프레임워크 |
| Spring Security | 6.x | 인증/인가 (JWT) |
| Spring Data JPA | 3.x | ORM |
| QueryDSL | 5.1.0 | 타입 안전 쿼리 |
| MySQL | 8.0 | 데이터베이스 |
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

### Infra
| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 오케스트레이션 |
| Nginx | 프론트엔드 서빙 & 리버스 프록시 |

### AI
| 기술 | 용도 |
|------|------|
| Claude API (Anthropic) | 커리큘럼/자료/퀴즈/보충학습 생성 |

<br/>

## 아키텍처

```
┌──────────────┐      ┌───────────────────┐      ┌──────────┐
│    React     │─────▶│  Spring Boot API  │─────▶│  MySQL   │
│  (Vite)      │◀─────│  Spring Security  │◀─────│          │
│  Port: 5173  │      │  Port: 8080       │      │ Port:3306│
└──────────────┘      └────────┬──────────┘      └──────────┘
                               │
                      ┌────────┴──────────┐
                      │      Redis        │
                      │    Port: 6379     │
                      └────────┬──────────┘
                               │
                      ┌────────┴──────────┐
                      │   Claude API      │
                      │   (Anthropic)     │
                      └───────────────────┘
```

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
│       │   ├── user/           # 회원 (회원가입, 로그인, JWT)
│       │   ├── course/         # 강의 (생성, 수강신청)
│       │   ├── curriculum/     # 커리큘럼 (CRUD)
│       │   ├── material/       # 수업 자료
│       │   ├── quiz/           # 퀴즈 (출제, 응시, 채점)
│       │   ├── ai/             # AI 생성 (커리큘럼/자료/퀴즈)
│       │   └── dashboard/      # 대시보드 (통계)
│       ├── global/
│       │   ├── common/         # 공통 응답 (ApiResponse)
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
        ├── stores/             # Zustand 상태 관리
        ├── components/         # 공통 컴포넌트
        └── pages/
            ├── auth/           # 로그인, 회원가입
            ├── dashboard/      # 교강사/학생 대시보드
            ├── course/         # 강의 목록, 상세
            ├── curriculum/     # AI 커리큘럼 생성
            ├── material/       # AI 자료 생성
            └── quiz/           # AI 퀴즈 생성, 퀴즈 풀기
```

<br/>

## 실행 방법

### 사전 요구사항

- Java 17+
- Node.js 18+
- Docker & Docker Compose (배포 시)
- Anthropic API Key ([발급받기](https://console.anthropic.com/))

### 로컬 개발 환경

```bash
# 1. 저장소 클론
git clone https://github.com/GEONHO96/EduCraft-AI.git
cd EduCraft-AI

# 2. 백엔드 실행 (H2 인메모리 DB 사용)
cd backend
export AI_API_KEY=your-anthropic-api-key
./gradlew bootRun

# 3. 프론트엔드 실행 (새 터미널)
cd frontend
npm install
npm run dev
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console

### Docker 배포

```bash
# 환경변수 설정
export AI_API_KEY=your-anthropic-api-key

# Docker Compose 실행
docker-compose up --build
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8080

<br/>

## API 명세

### 인증
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/auth/register` | 회원가입 | - |
| POST | `/api/auth/login` | 로그인 (JWT 발급) | - |
| GET | `/api/auth/me` | 내 정보 조회 | 로그인 |

### 강의
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/courses` | 강의 생성 | 교강사 |
| GET | `/api/courses` | 내 강의 목록 | 로그인 |
| GET | `/api/courses/{id}` | 강의 상세 | 로그인 |
| POST | `/api/courses/{id}/enroll` | 수강 신청 | 학생 |

### AI 생성
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/ai/curriculum/generate` | AI 커리큘럼 생성 | 교강사 |
| POST | `/api/ai/material/generate` | AI 수업 자료 생성 | 교강사 |
| POST | `/api/ai/quiz/generate` | AI 퀴즈 생성 | 교강사 |
| POST | `/api/ai/supplement/generate` | AI 보충학습 생성 | 로그인 |

### 퀴즈
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/quizzes/{id}` | 퀴즈 조회 | 로그인 |
| POST | `/api/quizzes/{id}/submit` | 퀴즈 제출 | 학생 |
| GET | `/api/quizzes/{id}/results` | 퀴즈 결과 (전체) | 교강사 |
| GET | `/api/quizzes/{id}/my-result` | 내 퀴즈 결과 | 학생 |

### 대시보드
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/dashboard/teacher` | 교강사 대시보드 | 교강사 |
| GET | `/api/dashboard/student` | 학생 대시보드 | 학생 |
| GET | `/api/dashboard/time-saved` | 시간 절약 통계 | 교강사 |

<br/>

## 화면 구성

| 페이지 | 설명 |
|--------|------|
| **로그인/회원가입** | 교강사/학생 역할 선택 후 가입 |
| **교강사 대시보드** | 강의 수, 수강생 수, AI 생성 횟수, 절약 시간 통계 |
| **학생 대시보드** | 수강 강의, 퀴즈 성적, 평균 점수 |
| **강의 관리** | 강의 CRUD, 커리큘럼 목록 확인 |
| **AI 커리큘럼 생성** | 과목/주제/주차/수준 입력 → AI 자동 설계 |
| **AI 자료 생성** | 강의/실습 자료 AI 자동 생성 (난이도 조절) |
| **AI 퀴즈 출제** | 문제 수/난이도/유형 설정 → AI 자동 출제 |
| **퀴즈 풀기** | 학생 퀴즈 응시, 자동 채점, 해설 확인 |

<br/>

## 차별점

| 항목 | 기존 LMS | EduCraft AI |
|------|----------|-------------|
| 수업 준비 | 교강사가 직접 작성 | AI가 자동 생성, 교강사가 검수/수정 |
| 문제 출제 | 수동 출제 | AI 자동 출제 + 자동 채점 + 해설 |
| 커리큘럼 설계 | 경험 기반 수동 설계 | AI가 체계적 설계, 난이도 자동 조절 |
| 보충 학습 | 없음 또는 일괄 제공 | 학생별 오답 기반 맞춤형 보충 자료 |
| 효과 측정 | 불가능 | **절약 시간을 정량적으로 측정** |

<br/>

## 팀 정보

| 이름 | 역할 |
|------|------|
| GEONHO96 | 기획 / 개발 |
