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
| **배치 통계 집계** | 일일 학습 통계, AI 사용 통계, 비활성 수강생 자동 감지 |

### 학생

| 기능 | 설명 |
|------|------|
| **수업 자료 열람** | 교강사가 생성한 강의자료/실습자료 확인 |
| **온라인 퀴즈** | 퀴즈 응시 → 자동 채점 → 해설 확인 |
| **AI 보충 학습** | 틀린 문제 기반 맞춤형 보충 설명 + 추가 연습 문제 |
| **학습 현황** | 수강 강의, 퀴즈 점수, 평균 성적 확인 |

### 공통

| 기능 | 설명 |
|------|------|
| **소셜 로그인** | Google, Kakao, Naver 소셜 계정으로 간편 로그인 |
| **아이디 찾기** | 이름으로 가입된 이메일 검색 (마스킹 처리) |
| **비밀번호 재설정** | 임시 비밀번호 발급 → 새 비밀번호 설정 (3단계) |

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
<img src="https://img.shields.io/badge/Anthropic-D4A574?style=for-the-badge&logo=anthropic&logoColor=black" alt="Anthropic"/>
</p>
<sub>커리큘럼 · 자료 · 퀴즈 · 보충학습 생성</sub>
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
<h4>🚀 Infra</h4>
<p>
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/><br/>
<img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/><br/>
<img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose"/>
</p>
<sub>컨테이너 배포</sub>
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
│       │   ├── user/           # 회원 (회원가입, 로그인, 소셜로그인, 계정찾기)
│       │   ├── course/         # 강의 (생성, 수강신청)
│       │   ├── curriculum/     # 커리큘럼 (CRUD)
│       │   ├── material/       # 수업 자료
│       │   ├── quiz/           # 퀴즈 (출제, 응시, 채점)
│       │   ├── ai/             # AI 생성 (커리큘럼/자료/퀴즈)
│       │   ├── batch/          # Spring Batch (통계 집계, 비활성 감지)
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
            ├── auth/           # 로그인, 회원가입, 소셜로그인, 계정찾기
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

# 3. 프론트엔드 환경변수 설정 (새 터미널)
cd frontend
cp .env.example .env
# .env 파일에서 소셜 로그인 키 설정 (선택사항)
# VITE_GOOGLE_CLIENT_ID, VITE_KAKAO_CLIENT_ID, VITE_NAVER_CLIENT_ID 등

# 4. 프론트엔드 실행
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

> 총 **26개** 엔드포인트 | 공통 응답 형식: `{ "success": true, "data": {...} }` 또는 `{ "success": false, "error": {"code": "...", "message": "..."} }`  
> 인증: `Authorization: Bearer <JWT_TOKEN>` 헤더 필요 (공개 API 제외)

---

### 1. 인증 (`/api/auth`)

#### `POST /api/auth/register` — 회원가입
> 권한: 공개

**Request**
```json
{
  "email": "teacher@edu.com",
  "password": "password123",
  "name": "김교수",
  "role": "TEACHER"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | String | O | 이메일 (중복 불가) |
| password | String | O | 비밀번호 |
| name | String | O | 이름 |
| role | Enum | O | `TEACHER` 또는 `STUDENT` |

**Response**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJI...",
    "user": {
      "id": 1,
      "email": "teacher@edu.com",
      "name": "김교수",
      "role": "TEACHER",
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
  "email": "teacher@edu.com",
  "password": "password123"
}
```

**Response** — 회원가입과 동일한 Token 형식

---

#### `POST /api/auth/social-login` — 소셜 로그인
> 권한: 공개 | Google, Kakao, Naver 지원

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

#### `GET /api/auth/me` — 내 정보 조회
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "teacher@edu.com",
    "name": "김교수",
    "role": "TEACHER",
    "profileImage": "https://...",
    "socialProvider": "GOOGLE"
  }
}
```

---

#### `POST /api/auth/find-email` — 아이디(이메일) 찾기
> 권한: 공개

**Request**
```json
{
  "name": "김교수"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | String | O | 가입 시 입력한 이름 |

**Response**
```json
{
  "success": true,
  "data": ["tea***@edu.com"]
}
```
> 보안을 위해 이메일 일부가 마스킹 처리됩니다.

---

#### `POST /api/auth/reset-password` — 임시 비밀번호 발급
> 권한: 공개

**Request**
```json
{
  "email": "teacher@edu.com",
  "name": "김교수"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | String | O | 가입한 이메일 |
| name | String | O | 가입 시 입력한 이름 |

**Response**
```json
{
  "success": true,
  "data": {
    "tempPassword": "aB3xK9mP"
  }
}
```
> 이메일과 이름이 일치하는 경우에만 임시 비밀번호가 발급됩니다.

---

#### `POST /api/auth/change-password` — 비밀번호 변경 (임시 비밀번호 사용)
> 권한: 공개

**Request**
```json
{
  "email": "teacher@edu.com",
  "tempPassword": "aB3xK9mP",
  "newPassword": "newPassword123"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | String | O | 이메일 |
| tempPassword | String | O | 발급받은 임시 비밀번호 |
| newPassword | String | O | 새 비밀번호 (6자 이상) |

**Response**
```json
{
  "success": true,
  "data": null
}
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
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | String | O | 강의 제목 |
| subject | String | O | 과목명 |
| description | String | X | 강의 설명 |

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

**Response** — `List<CourseInfo>`

---

#### `GET /api/courses/{courseId}` — 강의 상세
> 권한: 로그인 필요

---

#### `POST /api/courses/{courseId}/enroll` — 수강 신청
> 권한: 학생

**Response**
```json
{
  "success": true,
  "data": null
}
```

---

### 3. 커리큘럼 (`/api`)

#### `GET /api/courses/{courseId}/curriculums` — 커리큘럼 목록
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "weekNumber": 1,
      "topic": "HTML 기초",
      "objectives": "HTML 태그 구조 이해, 기본 페이지 제작",
      "contentJson": "{...}",
      "aiGenerated": true,
      "createdAt": "2026-04-11T10:35:00"
    }
  ]
}
```

---

#### `PUT /api/curriculums/{curriculumId}` — 커리큘럼 수정
> 권한: 교강사

**Request**
```json
{
  "weekNumber": 1,
  "topic": "HTML 기초 (수정)",
  "objectives": "수정된 학습 목표",
  "contentJson": "{...}"
}
```

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
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| courseId | Long | O | 강의 ID |
| subject | String | O | 과목명 |
| topic | String | O | 주제 |
| totalWeeks | Integer | O | 총 주차 수 |
| targetLevel | String | O | 대상 수준 (초급/중급/고급) |
| additionalRequirements | String | X | 추가 요구사항 |

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
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| curriculumId | Long | O | 커리큘럼 ID |
| type | String | O | `LECTURE` (강의) 또는 `EXERCISE` (실습) |
| difficulty | Integer | O | 난이도 (1~5) |
| additionalRequirements | String | X | 추가 요구사항 |

**Response**
```json
{
  "success": true,
  "data": {
    "materialId": 1,
    "title": "HTML 기초 - 강의자료",
    "contentJson": "{...}",
    "timeSavedSeconds": 1800
  }
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
  "questionTypes": "MULTIPLE_CHOICE,SHORT_ANSWER",
  "additionalRequirements": "실전 활용 문제 위주로"
}
```
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| curriculumId | Long | O | 커리큘럼 ID |
| questionCount | Integer | O | 문제 수 |
| difficulty | Integer | O | 난이도 (1~5) |
| questionTypes | String | O | 문제 유형 (쉼표 구분) |
| additionalRequirements | String | X | 추가 요구사항 |

**Response**
```json
{
  "success": true,
  "data": {
    "quizId": 1,
    "materialId": 1,
    "questionsJson": "[{...}]",
    "questionCount": 10,
    "timeSavedSeconds": 2400
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

**Response**
```json
{
  "success": true,
  "data": {
    "explanationJson": "{오답 해설...}",
    "additionalQuestionsJson": "[{추가 연습문제...}]",
    "timeSavedSeconds": 1200
  }
}
```

---

### 5. 퀴즈 (`/api/quizzes`)

#### `GET /api/quizzes/{quizId}` — 퀴즈 조회
> 권한: 로그인 필요

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "materialId": 1,
    "questionsJson": "[{\"question\": \"HTML에서 제목 태그는?\", \"type\": \"MULTIPLE_CHOICE\", \"options\": [...]}]",
    "timeLimit": 1800,
    "createdAt": "2026-04-11T11:00:00"
  }
}
```

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
    "answersJson": "[{...채점 결과...}]",
    "submittedAt": "2026-04-11T11:30:00"
  }
}
```

---

#### `GET /api/quizzes/{quizId}/results` — 퀴즈 결과 (전체)
> 권한: 교강사

**Response** — `List<SubmissionResult>` (전체 학생 제출 결과)

---

#### `GET /api/quizzes/{quizId}/my-result` — 내 퀴즈 결과
> 권한: 학생

**Response** — `SubmissionResult` (본인 제출 결과)

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
    "recentActivities": [
      {
        "type": "QUIZ",
        "description": "웹 프로그래밍 1주차 퀴즈 생성",
        "createdAt": "2026-04-11T10:00:00"
      }
    ]
  }
}
```

---

#### `GET /api/dashboard/student` — 학생 대시보드
> 권한: 학생

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

**Response**
```json
{
  "success": true,
  "data": {
    "totalSeconds": 18000,
    "generationCount": 23,
    "formatted": "5시간 0분"
  }
}
```

---

### 7. 배치 (`/api/batch`)

#### `POST /api/batch/run/{jobName}` — 배치 수동 실행
> 권한: 교강사

| jobName | 설명 | 자동 스케줄 |
|---------|------|------------|
| `learning-stats` | 일일 학습 통계 집계 | 매일 자정 |
| `ai-usage-stats` | 일일 AI 사용 통계 집계 | 매일 새벽 1시 |
| `inactive-students` | 비활성 수강생 감지 (7일) | 매주 월요일 오전 9시 |

**Response**
```json
{
  "success": true,
  "data": {
    "job": "learning-stats",
    "status": "COMPLETED",
    "executedAt": "2026-04-11T12:00:00"
  }
}
```

---

### API 요약

| 카테고리 | 엔드포인트 수 | 권한 |
|----------|-------------|------|
| 인증 | 7개 | 공개 6 / 로그인 1 |
| 강의 | 4개 | 교강사 1 / 학생 1 / 로그인 2 |
| 커리큘럼 | 3개 | 교강사 2 / 로그인 1 |
| AI 생성 | 4개 | 교강사 3 / 로그인 1 |
| 퀴즈 | 4개 | 교강사 1 / 학생 2 / 로그인 1 |
| 대시보드 | 3개 | 교강사 2 / 학생 1 |
| 배치 | 1개 | 교강사 1 |
| **합계** | **26개** | |

<br/>

## 화면 구성

| 페이지 | 설명 |
|--------|------|
| **로그인** | 이메일 로그인 + 소셜 로그인(Google/Kakao/Naver) 버튼, 아이디/비밀번호 찾기 링크 |
| **회원가입** | 이메일/비밀번호/이름 입력, 교강사/학생 역할 선택 |
| **소셜 로그인 콜백** | OAuth 인증 후 역할 선택(신규 가입 시), 자동 로그인 처리 |
| **아이디/비밀번호 찾기** | 탭 기반 UI — 이름으로 이메일 찾기 / 임시 비밀번호 발급 → 새 비밀번호 설정 (3단계) |
| **교강사 대시보드** | 강의 수, 수강생 수, AI 생성 횟수, 절약 시간 통계, 로딩 스켈레톤, 에러 재시도 |
| **학생 대시보드** | 수강 강의, 퀴즈 성적, 평균 점수, 점수별 색상 구분, 진행률 바 |
| **강의 관리** | 강의 CRUD, 검색 필터, 카드 호버 효과, 로딩 스켈레톤, 빈 상태 표시 |
| **AI 커리큘럼 생성** | 과목/주제/주차/수준 입력 → AI 자동 설계 |
| **AI 자료 생성** | 강의/실습 자료 AI 자동 생성 (난이도 조절) |
| **AI 퀴즈 출제** | 문제 수/난이도/유형 설정 → AI 자동 출제 |
| **퀴즈 풀기** | 카운트다운 타이머, 진행률 바, 자동 제출, 정답/오답 시각적 표시, 결과 배너 |

<br/>

## UI/UX 특징

| 항목 | 설명 |
|------|------|
| **반응형 레이아웃** | 모바일 햄버거 메뉴, 데스크톱 사이드바 네비게이션 |
| **로딩 스켈레톤** | 데이터 로딩 시 콘텐츠 형태의 스켈레톤 UI 표시 |
| **에러 바운더리** | 컴포넌트 오류 시 전체 앱 크래시 방지, 재시도 버튼 제공 |
| **실시간 유효성 검사** | 비밀번호 불일치 시 즉시 빨간 테두리 + 메시지 표시 |
| **토스트 알림** | 성공/실패 액션에 대한 즉각적인 피드백 (react-hot-toast) |
| **로그아웃 확인** | 실수 방지를 위한 모달 확인 다이얼로그 |
| **퀴즈 타이머** | 남은 시간 카운트다운 + 시간 초과 시 자동 제출 |
| **접근성** | 시맨틱 HTML, 키보드 네비게이션, 포커스 링 표시 |

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
