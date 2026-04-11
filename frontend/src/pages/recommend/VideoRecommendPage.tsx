/**
 * VideoRecommendPage - 학년별 유튜브 강의 추천 페이지
 * 초등학교 1학년 ~ 고등학교 3학년까지 국어, 영어, 수학 유튜브 강의를 추천한다.
 */
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'

// ====== 학교급 & 학년 정의 ======
type SchoolLevel = 'elementary' | 'middle' | 'high'
type Subject = '국어' | '영어' | '수학'

const SCHOOL_LEVELS = [
  { value: 'elementary' as SchoolLevel, label: '초등학교', grades: [1, 2, 3, 4, 5, 6], emoji: '🏫' },
  { value: 'middle' as SchoolLevel, label: '중학교', grades: [1, 2, 3], emoji: '🏢' },
  { value: 'high' as SchoolLevel, label: '고등학교', grades: [1, 2, 3], emoji: '🎓' },
]

const SUBJECTS: { value: Subject; label: string; color: string; bg: string }[] = [
  { value: '국어', label: '국어', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { value: '영어', label: '영어', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { value: '수학', label: '수학', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
]

// ====== 유튜브 강의 데이터 타입 ======
interface VideoInfo {
  title: string
  channel: string
  videoId: string
  description: string
}

// ====== 학년별 유튜브 강의 데이터 ======
const VIDEO_DATA: Record<string, Record<Subject, VideoInfo[]>> = {
  // ── 초등학교 ──
  'elementary-1': {
    '국어': [
      { title: '한글 자음 모음 배우기', channel: '깨비키즈', videoId: 'KMl6BNSiBpE', description: '처음 한글을 배우는 친구들을 위한 자음과 모음 학습' },
      { title: '초1 받아쓰기 연습', channel: '스마트올', videoId: 'gQlMMPi_vAw', description: '초등 1학년 필수 받아쓰기 단어 연습' },
      { title: '동화 읽기 - 독해력 키우기', channel: 'EBS키즈', videoId: '4NwS3rMSoCQ', description: '재미있는 동화로 읽기 능력을 키워요' },
    ],
    '영어': [
      { title: 'ABC 알파벳 송', channel: '핑크퐁', videoId: 'Y88p4V_BCEU', description: '신나는 노래로 알파벳을 배워요' },
      { title: '파닉스 기초 - 알파벳 소리', channel: '잉글리시에그', videoId: 'hq3yfQnllfQ', description: '파닉스로 영어 읽기의 기초를 다져요' },
      { title: '기초 영어 단어 100개', channel: '미니특공대', videoId: 'RE3EBrqMqrA', description: '일상생활에서 자주 쓰는 영어 단어' },
    ],
    '수학': [
      { title: '1부터 100까지 수 세기', channel: '깨비키즈', videoId: 'Gj2Bbn6dACQ', description: '재미있게 숫자를 세어봐요' },
      { title: '덧셈과 뺄셈 기초', channel: 'EBS수학', videoId: '8jKm5LBpJV0', description: '한 자리 수 덧셈과 뺄셈 연습' },
      { title: '시계 보는 법 배우기', channel: '수학대왕', videoId: 'p3WGCP6S-8U', description: '시계를 보고 시간을 읽는 방법' },
    ],
  },
  'elementary-2': {
    '국어': [
      { title: '초2 국어 - 문장 만들기', channel: 'EBS초등', videoId: 'KjU8_K-L0FA', description: '주어와 서술어로 올바른 문장 만들기' },
      { title: '일기 쓰는 방법', channel: '스마트올', videoId: 'X5y-S1lF_Ek', description: '일기를 잘 쓰는 비법을 알려줘요' },
      { title: '동시와 동화 감상', channel: 'EBS키즈', videoId: 'vGsWOyVMNFI', description: '아름다운 동시를 함께 감상해요' },
    ],
    '영어': [
      { title: '기초 영어 인사말', channel: '주니토니', videoId: 'gghDRJVxFxU', description: 'Hello, How are you? 기본 인사 배우기' },
      { title: '영어 색깔과 숫자', channel: '핑크퐁', videoId: '4m2YT-PIkEs', description: '색깔과 숫자를 영어로 말해봐요' },
      { title: '영어 동요 모음', channel: '마더구스클럽', videoId: 'e_04ZrNroTo', description: '노래로 자연스럽게 영어와 친해지기' },
    ],
    '수학': [
      { title: '구구단 외우기', channel: '깨비키즈', videoId: 'kN2O6-0Gbuk', description: '구구단 2단부터 9단까지 노래로 외우기' },
      { title: '길이 재기 - cm와 m', channel: 'EBS수학', videoId: 'UTVBxPpjMOA', description: '자를 사용해서 길이를 재봐요' },
      { title: '두 자리 수 덧셈 뺄셈', channel: '수학대왕', videoId: 'nUqV0FQBXEE', description: '받아올림, 받아내림이 있는 계산' },
    ],
  },
  'elementary-3': {
    '국어': [
      { title: '초3 국어 - 문단의 구조', channel: 'EBS초등', videoId: '7xqRk9Y7lgQ', description: '중심 문장과 뒷받침 문장 이해하기' },
      { title: '독서 감상문 쓰기', channel: '스마트올', videoId: '3zWm5UjPwfI', description: '책을 읽고 감상문을 잘 쓰는 방법' },
      { title: '맞춤법 바로 알기', channel: 'EBS초등', videoId: 'sVRQbKPuYNQ', description: '헷갈리는 맞춤법 완벽 정리' },
    ],
    '영어': [
      { title: '기초 영어 문장 만들기', channel: '라이언킹영어', videoId: '9G7oDPGKfOw', description: 'I am, You are 기본 문장 배우기' },
      { title: '영어 요일과 달', channel: '잉글리시에그', videoId: 'LIQsyHoLudQ', description: 'Monday부터 Sunday, January부터 December' },
      { title: '초등 영어 단어 300', channel: '바른영어', videoId: 'JcqHBN9v1NM', description: '초등 필수 영단어 300개 총정리' },
    ],
    '수학': [
      { title: '분수의 기초', channel: '칸아카데미', videoId: 'SsRnCKwEMFU', description: '분수가 뭔지 쉽게 이해하기' },
      { title: '나눗셈 원리 이해', channel: 'EBS수학', videoId: 'Ul8lxpmhRsM', description: '나눗셈의 원리와 계산 방법' },
      { title: '원과 구의 이해', channel: '수학대왕', videoId: 'T_xmIXVF0Wg', description: '원의 성질과 지름, 반지름 알아보기' },
    ],
  },
  'elementary-4': {
    '국어': [
      { title: '초4 국어 - 요약하기', channel: 'EBS초등', videoId: 'C1AO2Q59eHM', description: '글의 핵심을 찾아 요약하는 방법' },
      { title: '설명하는 글 쓰기', channel: '스마트올', videoId: 'pyR1fZWM0gM', description: '대상을 체계적으로 설명하는 글 작성법' },
      { title: '사자성어와 속담', channel: 'EBS초등', videoId: 'gxKPzpRiWy4', description: '자주 쓰이는 사자성어와 속담 모음' },
    ],
    '영어': [
      { title: '초4 영어 - 현재시제', channel: '바른영어', videoId: 'U5LmYQwbd80', description: 'I play, She plays - 현재시제 배우기' },
      { title: '영어 읽기 연습', channel: '리딩게이트', videoId: 'MH33VkTPLkA', description: '짧은 영어 동화 읽기 연습' },
      { title: '초등 영어 회화 패턴', channel: '잉글리시에그', videoId: 'h47gMaJm_cI', description: 'Can I~, Do you~ 핵심 패턴 20개' },
    ],
    '수학': [
      { title: '큰 수의 이해', channel: '칸아카데미', videoId: 'f2THB-Kfwo4', description: '만, 십만, 백만, 천만 큰 수 읽기' },
      { title: '각도와 삼각형', channel: 'EBS수학', videoId: 'BjE9NdIEBLY', description: '각도 재기와 삼각형의 종류' },
      { title: '소수의 이해', channel: '수학대왕', videoId: 'tJy2EWUQ688', description: '소수(decimal)의 개념과 계산' },
    ],
  },
  'elementary-5': {
    '국어': [
      { title: '초5 국어 - 토론하기', channel: 'EBS초등', videoId: 'b_d2t8GCxMk', description: '주장과 근거를 갖추어 토론하는 방법' },
      { title: '뉴스 기사 읽기', channel: '스마트올', videoId: 'Ro2t1FLzL6c', description: '뉴스 기사의 구조와 사실과 의견 구별' },
      { title: '비유적 표현 이해', channel: 'EBS초등', videoId: 'jFSkrz_D64c', description: '비유, 상징, 반어법 등 비유적 표현 학습' },
    ],
    '영어': [
      { title: '초5 영어 - 과거시제', channel: '바른영어', videoId: 'CuZR-7GJHVE', description: 'I played, I went - 과거시제 마스터' },
      { title: '영어 리딩 레벨업', channel: '리딩게이트', videoId: 'dH9IdViKjXU', description: '조금 긴 영어 지문 읽기 연습' },
      { title: '영어 일기 쓰기', channel: '잉글리시에그', videoId: 'RRl1ai5KUTE', description: '간단한 영어 일기 쓰는 방법' },
    ],
    '수학': [
      { title: '약수와 배수', channel: '칸아카데미', videoId: 'laeUp0iFgPY', description: '약수, 배수, 최대공약수, 최소공배수' },
      { title: '직육면체와 정육면체', channel: 'EBS수학', videoId: 'a3NeOq0W5Wo', description: '입체도형의 성질과 전개도' },
      { title: '혼합 계산 순서', channel: '수학대왕', videoId: 'V3K-uX3hffk', description: '덧셈, 뺄셈, 곱셈, 나눗셈 혼합 계산' },
    ],
  },
  'elementary-6': {
    '국어': [
      { title: '초6 국어 - 논설문 쓰기', channel: 'EBS초등', videoId: 'GfM6Q3QMpvY', description: '주장하는 글의 구조와 작성법' },
      { title: '문학 감상과 비평', channel: '스마트올', videoId: 'JiG4lIiYXUg', description: '문학 작품을 깊이 있게 감상하는 방법' },
      { title: '중학교 국어 미리보기', channel: 'EBS초등', videoId: '9bLJl8dVt3E', description: '중학 국어 대비 선행 학습' },
    ],
    '영어': [
      { title: '초6 영어 총정리', channel: '바른영어', videoId: 'MhFhwZQXb5c', description: '초등 영어 핵심 문법 총정리' },
      { title: '영어 독해 연습', channel: '리딩게이트', videoId: 'MXP_-G1Yb6g', description: '중학 대비 영어 독해 연습' },
      { title: '영어 발표 연습', channel: '잉글리시에그', videoId: 'DPfSJG0BQLA', description: '영어로 자기소개와 발표하기' },
    ],
    '수학': [
      { title: '비와 비율', channel: '칸아카데미', videoId: 'St5t8FHOrBg', description: '비, 비율, 백분율의 개념 이해' },
      { title: '원의 넓이와 둘레', channel: 'EBS수학', videoId: '3w9MTSvNoSY', description: '원주율(π)과 원의 넓이 구하기' },
      { title: '중학 수학 선행', channel: '수악중독', videoId: 'nXTd0rJ_SYo', description: '중학교 1학년 수학 미리보기' },
    ],
  },

  // ── 중학교 ──
  'middle-1': {
    '국어': [
      { title: '중1 국어 - 소설의 요소', channel: 'EBS중학', videoId: 'qk7k8Ky8xno', description: '인물, 사건, 배경 - 소설의 3요소 이해' },
      { title: '시의 운율과 이미지', channel: '국어의기술', videoId: 'JJ5gBJwYbvA', description: '시를 분석하는 기본 방법' },
      { title: '정보 전달하는 글 쓰기', channel: 'EBS중학', videoId: 'f1Jj7GUb8Bo', description: '객관적이고 정확한 정보 전달 글쓰기' },
    ],
    '영어': [
      { title: '중1 영문법 총정리', channel: '영포자구출프로젝트', videoId: 'sM-bHPJAmYM', description: '중학교 1학년 영문법 완벽 정리' },
      { title: '영어 듣기 연습', channel: 'EBS영어', videoId: 'DMtmv23R0bI', description: '중1 수준 영어 듣기 평가 대비' },
      { title: '기초 영작문', channel: '바른영어', videoId: 'l6TpYMC0gy4', description: '간단한 영어 문장 작문 연습' },
    ],
    '수학': [
      { title: '정수와 유리수', channel: '수악중독', videoId: 'G3-rB67K8Ow', description: '음수, 양수, 유리수의 개념과 사칙연산' },
      { title: '일차방정식', channel: '칸아카데미', videoId: 'HR8YTcGn8E4', description: '일차방정식의 풀이와 활용' },
      { title: '좌표평면과 그래프', channel: 'EBS수학', videoId: '7qeB08JgnMQ', description: '좌표평면 위에 점 찍기와 그래프' },
    ],
  },
  'middle-2': {
    '국어': [
      { title: '중2 국어 - 설득 전략', channel: 'EBS중학', videoId: 'vJFSThX4jbk', description: '설득하는 글과 말하기의 전략' },
      { title: '현대시 감상법', channel: '국어의기술', videoId: 'O6Q0TiGfZhE', description: '현대시를 깊이 이해하고 감상하기' },
      { title: '매체 비판적 읽기', channel: 'EBS중학', videoId: 'F8rNp8h62CE', description: '뉴스, 광고를 비판적으로 분석하기' },
    ],
    '영어': [
      { title: '중2 핵심 문법 - 시제', channel: '영포자구출프로젝트', videoId: 'yZJnDv1vOZA', description: '현재, 과거, 미래, 현재완료 시제 정리' },
      { title: '영어 독해 전략', channel: 'EBS영어', videoId: '2vZOJA1N3jE', description: '지문의 주제와 요지를 빠르게 파악하기' },
      { title: '중2 영어 서술형 대비', channel: '바른영어', videoId: 'R4wWLYDnl7c', description: '서술형 시험 대비 영작문 연습' },
    ],
    '수학': [
      { title: '연립방정식', channel: '수악중독', videoId: 'wF2Okb_2xOk', description: '연립방정식의 풀이와 활용 문제' },
      { title: '일차함수', channel: '칸아카데미', videoId: '9SId-WT0bQ4', description: 'y=ax+b 일차함수의 그래프와 성질' },
      { title: '도형의 성질 - 삼각형', channel: 'EBS수학', videoId: 'pUkWFLmYVJU', description: '이등변삼각형, 직각삼각형의 성질' },
    ],
  },
  'middle-3': {
    '국어': [
      { title: '중3 국어 - 논증 방법', channel: 'EBS중학', videoId: 'uJq8qWRYnGk', description: '연역법, 귀납법 등 논증의 종류와 활용' },
      { title: '고전문학 입문', channel: '국어의기술', videoId: 'z5LhAr4_yXY', description: '향가, 고려가요, 시조 등 고전문학의 세계' },
      { title: '고등 국어 선행', channel: 'EBS중학', videoId: 'R0ldSv3cGEw', description: '고등학교 국어 대비 핵심 선행' },
    ],
    '영어': [
      { title: '중3 핵심 문법 총정리', channel: '영포자구출프로젝트', videoId: '8BzKrq4AmJo', description: '관계대명사, 분사구문 등 고교 대비 문법' },
      { title: '영어 독해 실전', channel: 'EBS영어', videoId: 'Y-EYrhO-8IM', description: '중등 영어 독해 실전 연습' },
      { title: '고교 영어 미리보기', channel: '바른영어', videoId: 'HzKLaODnzIQ', description: '고등학교 1학년 영어 선행 학습' },
    ],
    '수학': [
      { title: '이차방정식', channel: '수악중독', videoId: '5oWHjYLPGnI', description: '이차방정식의 풀이법과 근의 공식' },
      { title: '이차함수', channel: '칸아카데미', videoId: 'IvLc7K_aBjM', description: 'y=ax² 이차함수의 그래프와 최댓값·최솟값' },
      { title: '피타고라스 정리', channel: 'EBS수학', videoId: 'qJwecTgce6I', description: '피타고라스 정리의 이해와 활용' },
    ],
  },

  // ── 고등학교 ──
  'high-1': {
    '국어': [
      { title: '고1 국어 - 화법과 작문', channel: 'EBS고등', videoId: 'TGwDwkQhz9g', description: '화법의 원리와 효과적인 작문 기법' },
      { title: '문학 작품 분석법', channel: '국어의기술', videoId: 'eIMT0FT3wvY', description: '소설과 시를 체계적으로 분석하는 방법' },
      { title: '비문학 독해 전략', channel: '대성마이맥', videoId: 'YZ7D7lh5Rts', description: '비문학 지문 빠르게 읽고 정답 찾기' },
    ],
    '영어': [
      { title: '고1 영문법 핵심 정리', channel: '이충권영어', videoId: 'qPESSfWvn48', description: '고등 영문법 핵심 30가지 총정리' },
      { title: '수능 영어 독해 입문', channel: 'EBS영어', videoId: 'tLqGvqF-9uw', description: '수능 유형별 독해 전략 입문' },
      { title: '영어 어법·어휘', channel: '메가스터디', videoId: 'M2E0YgjmrD4', description: '자주 출제되는 어법 포인트 정리' },
    ],
    '수학': [
      { title: '다항식의 연산', channel: '수악중독', videoId: '3_v5lK3l-7U', description: '다항식의 덧셈, 뺄셈, 곱셈, 나눗셈' },
      { title: '방정식과 부등식', channel: '칸아카데미', videoId: 'rYG1Io_Hces', description: '이차방정식, 이차부등식 심화' },
      { title: '함수의 개념', channel: '1타강사', videoId: '8CluknpVR_8', description: '함수의 정의역, 공역, 치역 이해' },
    ],
  },
  'high-2': {
    '국어': [
      { title: '수능 국어 - 문학 기출분석', channel: '대성마이맥', videoId: 'k8l0QGnaCkU', description: '수능 문학 기출 패턴 분석과 풀이법' },
      { title: '수능 비문학 고난도', channel: '국어의기술', videoId: 'FHcpqbLaN68', description: '고난도 비문학 지문 독해 훈련' },
      { title: '고전소설과 고전시가', channel: 'EBS고등', videoId: 'TBQE22lYnBY', description: '수능 필수 고전문학 작품 분석' },
    ],
    '영어': [
      { title: '수능 영어 빈칸추론', channel: '이충권영어', videoId: 'FMdPv7qGXhI', description: '빈칸추론 유형 완벽 공략법' },
      { title: '수능 영어 독해 실전', channel: 'EBS영어', videoId: 'v7kV8eYYjzQ', description: '수능 독해 실전 문제 풀이' },
      { title: '영어 듣기 만점 전략', channel: '메가스터디', videoId: 'k4T2GRTHzIQ', description: '수능 영어 듣기 파트 만점 전략' },
    ],
    '수학': [
      { title: '미분법', channel: '수악중독', videoId: 'HXGwX7nvhHg', description: '미분의 개념과 도함수, 미분법 활용' },
      { title: '적분법', channel: '칸아카데미', videoId: 'B4rezGFm5Bk', description: '부정적분과 정적분의 이해' },
      { title: '확률과 통계', channel: '1타강사', videoId: 'F8zzT6GIe4c', description: '순열, 조합, 확률의 기본 성질' },
    ],
  },
  'high-3': {
    '국어': [
      { title: '수능 국어 실전 모의고사', channel: '대성마이맥', videoId: 'g4dGb-6TT_g', description: '수능 국어 실전 모의고사 풀이와 해설' },
      { title: '수능 국어 마무리 특강', channel: '국어의기술', videoId: 'nNSKUOk4HPA', description: '수능 직전 국어 핵심 정리 특강' },
      { title: 'EBS 연계 문학 총정리', channel: 'EBS고등', videoId: 'YKuP1u0rOh4', description: 'EBS 수능특강 연계 문학 작품 총정리' },
    ],
    '영어': [
      { title: '수능 영어 실전 모의고사', channel: '이충권영어', videoId: 'U0Fmo1Mu1dA', description: '수능 영어 실전 풀이 및 시간 배분 전략' },
      { title: '수능 영어 고난도 유형', channel: 'EBS영어', videoId: 'P2rMW1-V_e4', description: '순서배열, 문장삽입 고난도 유형 정복' },
      { title: '수능 영어 마무리', channel: '메가스터디', videoId: 'C5Fhx1pQ1hc', description: '수능 직전 영어 핵심 정리' },
    ],
    '수학': [
      { title: '수능 수학 킬러문항 공략', channel: '수악중독', videoId: 'X1wJHOMKq_M', description: '수능 수학 고난도 킬러문항 풀이 전략' },
      { title: '수능 수학 실전 모의고사', channel: '1타강사', videoId: 'DtSy9LPf_l0', description: '수능 수학 실전 모의고사 풀이' },
      { title: '수능 수학 마무리 정리', channel: 'EBS수학', videoId: 'wGLcxs-9bEo', description: '수능 직전 수학 공식·개념 총정리' },
    ],
  },
}

export default function VideoRecommendPage() {
  const { user } = useAuthStore()
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('elementary')
  const [grade, setGrade] = useState(1)
  const [subject, setSubject] = useState<Subject>('국어')

  // 로그인한 학생의 학년 정보로 자동 선택
  useEffect(() => {
    if (user?.grade) {
      const parts = user.grade.split('_') // e.g. "MIDDLE_2"
      const level = parts[0].toLowerCase() as SchoolLevel
      const g = parseInt(parts[1])
      if (['elementary', 'middle', 'high'].includes(level) && !isNaN(g)) {
        setSchoolLevel(level)
        setGrade(g)
      }
    }
  }, [user?.grade])

  const currentSchool = SCHOOL_LEVELS.find((s) => s.value === schoolLevel)!
  const key = `${schoolLevel}-${grade}`
  const videos = VIDEO_DATA[key]?.[subject] || []

  // 학교급 변경 시 학년 초기화
  const handleSchoolChange = (level: SchoolLevel) => {
    setSchoolLevel(level)
    setGrade(1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📺 유튜브 강의 추천</h1>
        <p className="text-gray-500 text-sm mt-1">학년별·과목별 엄선된 유튜브 강의를 만나보세요</p>
      </div>

      {/* 학교급 선택 */}
      <div className="flex gap-3 mb-4">
        {SCHOOL_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => handleSchoolChange(level.value)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition ${
              schoolLevel === level.value
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            <span className="text-lg">{level.emoji}</span>
            <span>{level.label}</span>
          </button>
        ))}
      </div>

      {/* 학년 선택 */}
      <div className="flex gap-2 mb-4">
        {currentSchool.grades.map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              grade === g
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {g}학년
          </button>
        ))}
      </div>

      {/* 과목 선택 */}
      <div className="flex gap-2 mb-6">
        {SUBJECTS.map((sub) => (
          <button
            key={sub.value}
            onClick={() => setSubject(sub.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
              subject === sub.value
                ? `${sub.bg} ${sub.color} border-current`
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* 현재 선택 정보 */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">{currentSchool.emoji}</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {currentSchool.label} {grade}학년 · {subject}
          </p>
          <p className="text-xs text-gray-500">추천 강의 {videos.length}개</p>
        </div>
      </div>

      {/* 영상 카드 목록 */}
      <div className="space-y-4">
        {videos.map((video, idx) => (
          <a
            key={idx}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
          >
            <div className="flex flex-col sm:flex-row">
              {/* 썸네일 */}
              <div className="relative sm:w-72 flex-shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-40 sm:h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* 재생 버튼 오버레이 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 정보 */}
              <div className="p-4 flex-1">
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-primary-600 transition">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{video.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full font-medium">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                    </svg>
                    YouTube
                  </span>
                  <span className="text-xs text-gray-400">{video.channel}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
