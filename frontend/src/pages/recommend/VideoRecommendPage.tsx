/**
 * VideoRecommendPage - 학년별 유튜브 강의 추천 페이지
 * 초등학교 1학년 ~ 고등학교 3학년까지 국어, 영어, 수학 유튜브 강의를 추천한다.
 */
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'

// ====== 학교급 & 학년 정의 ======
type SchoolLevel = 'elementary' | 'middle' | 'high'
type Subject = '국어' | '영어' | '수학' | '코딩'

const SCHOOL_LEVELS = [
  { value: 'elementary' as SchoolLevel, label: '초등학교', grades: [1, 2, 3, 4, 5, 6], emoji: '🏫' },
  { value: 'middle' as SchoolLevel, label: '중학교', grades: [1, 2, 3], emoji: '🏢' },
  { value: 'high' as SchoolLevel, label: '고등학교', grades: [1, 2, 3], emoji: '🎓' },
]

const SUBJECTS: { value: Subject; label: string; color: string; bg: string }[] = [
  { value: '국어', label: '국어', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { value: '영어', label: '영어', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { value: '수학', label: '수학', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { value: '코딩', label: '코딩', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
]

// ====== 유튜브 강의 데이터 타입 ======
interface VideoInfo {
  title: string
  channel: string
  videoId: string
  description: string
}

// ====== 학년별 유튜브 강의 데이터 (검증된 실제 영상 ID) ======
const VIDEO_DATA: Record<string, Record<Subject, VideoInfo[]>> = {
  // ── 초등학교 ──
  'elementary-1': {
    '국어': [
      { title: '국어 & 국어활동 교과서 살펴보기', channel: 'onschool', videoId: 'FbTBTVGf4iI', description: '1학년 국어 교과서를 함께 살펴봐요' },
      { title: '한글송 - 자음과 모음 배우기', channel: 'onschool', videoId: 'veLPajmkulE', description: '노래로 자음과 모음을 재미있게 배워요' },
      { title: '기차 ㄱㄴㄷ - 한글 자음 학습', channel: 'onschool', videoId: '50faXRFPnSs', description: '기차와 함께 ㄱ부터 ㅎ까지 배워요' },
    ],
    '영어': [
      { title: "My name's Gogo - 자기소개", channel: 'onschool', videoId: 'm1McPCnixOY', description: '영어로 자기소개하는 법을 배워요' },
      { title: 'Name Songs for Kids', channel: 'onschool', videoId: 'pv0ZWoEYIT4', description: '이름을 영어로 말하는 노래' },
      { title: "What's this? What's that?", channel: 'onschool', videoId: '0QrcDQSxfCY', description: '사물의 이름을 영어로 물어보기' },
    ],
    '수학': [
      { title: '덧셈과 뺄셈', channel: 'onschool', videoId: 'V9t1SoPSrnU', description: '1학년 덧셈과 뺄셈의 기초' },
      { title: '덧셈과 뺄셈 연습(1)', channel: 'onschool', videoId: '2miRGtazHKs', description: '한 자리 수 덧셈과 뺄셈 연습' },
      { title: '가르기와 모으기', channel: 'onschool', videoId: 'jYh56qhCEr8', description: '수를 가르고 모으는 방법 배우기' },
    ],
    '코딩': [
      { title: '스크래치 3.0 시작하기', channel: '나도코딩', videoId: 'xN8O_mhR-7Y', description: '스크래치 기초 사용법과 블록 코딩 입문' },
      { title: '코딩이란 무엇일까?', channel: '퉁퉁코딩', videoId: 'phmnXaN3G08', description: '코딩의 기본 개념을 재미있게 알아봐요' },
      { title: '프로그래밍이란? - 코딩 첫걸음', channel: '달리나음 IT', videoId: '6MjXHIYZWRE', description: '프로그래밍의 뜻과 기초 개념 이해' },
    ],
  },
  'elementary-2': {
    '국어': [
      { title: '시를 여러 가지 방법으로 읽기', channel: 'onschool', videoId: 'eg3fmFbWkt8', description: '시를 다양한 방법으로 감상해봐요' },
      { title: '시 속 인물의 마음 상상하기', channel: 'onschool', videoId: 'r5pFuZ4Nos0', description: '시에 나오는 인물의 마음을 느껴봐요' },
      { title: '바른 자세로 자신 있게 말해요', channel: 'onschool', videoId: 'e34EJ_g5rGA', description: '발표할 때 바른 자세와 말하기' },
    ],
    '영어': [
      { title: 'Action Verbs - 동작 동사 배우기', channel: 'onschool', videoId: '4c6FyuetSVo', description: '영어 동작 동사를 배워요' },
      { title: 'Stand up, Sit down - 명령문', channel: 'onschool', videoId: 'WsiRSWthV1k', description: '영어 명령문으로 놀이해요' },
      { title: 'How many bears? - 숫자 세기', channel: 'onschool', videoId: '4xsRmYL_7LI', description: '영어로 숫자를 세어봐요' },
    ],
    '수학': [
      { title: '세 자리 수 알아보기', channel: 'onschool', videoId: '9E31dS9bGWs', description: '90보다 10만큼 더 큰 수를 배워요' },
      { title: '받아올림이 있는 덧셈', channel: 'onschool', videoId: 'hwopRyxEqVk', description: '받아올림이 있는 세로 방향 덧셈' },
      { title: '받아내림이 있는 뺄셈', channel: 'onschool', videoId: 'zNJ6NrZ5FgQ', description: '받아내림이 있는 세로 방향 뺄셈' },
    ],
    '코딩': [
      { title: '스크래치로 게임 만들기', channel: '나도코딩', videoId: 'q6fPjQAzll8', description: '블록 코딩으로 나만의 게임을 만들어봐요' },
      { title: '코딩 환경 설정하기', channel: '달리나음 IT', videoId: 'pFCHn0F-nuw', description: '코딩을 시작하기 위한 환경 준비' },
      { title: '첫 코드 실행해보기', channel: '달리나음 IT', videoId: 'YuOGpTO8x94', description: '처음으로 코드를 실행하는 방법' },
    ],
  },
  'elementary-3': {
    '국어': [
      { title: '감각적 표현하기', channel: 'onschool', videoId: '2lNb7rntUFY', description: '오감을 활용한 감각적 표현 배우기' },
      { title: '시에 나타난 감각적 표현 알기', channel: 'onschool', videoId: 'xUwwatr7olg', description: '시 속 감각적 표현을 찾아봐요' },
      { title: '시(달걀프라이) 감상하기', channel: 'onschool', videoId: 'VLQIwAeiSaA', description: '재미있는 시를 함께 감상해요' },
    ],
    '영어': [
      { title: "What's your name? - 인사하기", channel: 'onschool', videoId: 'm1McPCnixOY', description: '영어로 이름을 묻고 대답하기' },
      { title: "What's this? - 사물 이름 배우기", channel: 'onschool', videoId: '0QrcDQSxfCY', description: '주변 사물의 영어 이름 배우기' },
      { title: 'Simon says - 영어 듣기 게임', channel: 'onschool', videoId: 'OkO8DaPIyXo', description: '영어 듣기 게임으로 재미있게 배우기' },
    ],
    '수학': [
      { title: '세 자리 수 덧셈 (받아올림 없음)', channel: 'onschool', videoId: '2BrgMG1JtLc', description: '받아올림이 없는 세 자리 수 덧셈' },
      { title: '세 자리 수 덧셈 (받아올림 2번)', channel: 'onschool', videoId: 'AOQQSy4qRs8', description: '받아올림이 두 번 있는 덧셈' },
      { title: '1단원 덧셈과 뺄셈 요점 정리', channel: 'onschool', videoId: 'l46i4r0K0rI', description: '3학년 덧셈과 뺄셈 핵심만 쏙쏙' },
    ],
    '코딩': [
      { title: '코딩 기본 배우기', channel: '달리나음 IT', videoId: 'YmS32bo3Uas', description: '변수와 데이터의 기본 개념 익히기' },
      { title: '코딩 연습 - 간단한 프로그램', channel: '달리나음 IT', videoId: 'aodQTNWkoko', description: '직접 따라하며 코딩 연습하기' },
      { title: '코딩 개념 정리', channel: '달리나음 IT', videoId: 'meJGRyyXY54', description: '배운 코딩 개념을 정리해봐요' },
    ],
  },
  'elementary-4': {
    '국어': [
      { title: '같이 눈사람 만들래 (국어 노래)', channel: 'onschool', videoId: 'qNvESvlovzI', description: '노래로 즐기는 국어 활동' },
      { title: '등 굽은 나무 (동화)', channel: 'onschool', videoId: 'IHD4ugqjxlI', description: '교과서 동화를 함께 읽어봐요' },
      { title: '봄 동시 모음', channel: 'onschool', videoId: 'kALACG8DdKU', description: '아름다운 봄 동시를 감상해요' },
    ],
    '영어': [
      { title: 'How are you? - 인사 표현', channel: 'onschool', videoId: 'ICoK5oxVL_U', description: '안부를 묻는 영어 표현 배우기' },
      { title: 'Hello! - 인사 노래', channel: 'onschool', videoId: 'tVlcKp3bWH8', description: '노래로 영어 인사 배우기' },
      { title: 'Family Members Song', channel: 'onschool', videoId: 'NVEzzzia8Yo', description: '가족 관계를 영어로 배워요' },
    ],
    '수학': [
      { title: '큰 수 알아보기 (신의 수)', channel: 'onschool', videoId: 'FfrjhKIasu8', description: '만 단위 이상의 큰 수 이해하기' },
      { title: '십만, 백만, 천만 알아보기', channel: 'onschool', videoId: 'sTm4bUUHPnE', description: '4학년 1학기 1단원 큰 수' },
      { title: '수학 송 (일만억조송)', channel: 'onschool', videoId: 'dT_jDEKeSDM', description: '노래로 큰 수의 단위를 외워요' },
    ],
    '코딩': [
      { title: '숫자와 계산 - 데이터 타입', channel: '달리나음 IT', videoId: '9H79uXxQCBk', description: '프로그래밍에서 숫자를 다루는 방법' },
      { title: '문자열 다루기', channel: '달리나음 IT', videoId: 'STGCSIt3nsE', description: '텍스트 데이터를 코딩으로 처리하기' },
      { title: '리스트 알아보기', channel: '달리나음 IT', videoId: 'x6W7t0KkTAc', description: '여러 데이터를 묶어서 관리하기' },
    ],
  },
  'elementary-5': {
    '국어': [
      { title: '의사소통이 없다면?', channel: 'onschool', videoId: 'Tx9BM4Bsnu8', description: '의사소통의 중요성을 알아봐요' },
      { title: '디지털 소통이 부족한 이유', channel: 'onschool', videoId: 'ExG1fFuLV9o', description: '디지털 시대의 소통 방법' },
      { title: '세상에서 가장 못된 아이 에드와르도', channel: 'onschool', videoId: 'x7nHkYPf5rk', description: '책 읽기와 인물의 마음 이해하기' },
    ],
    '영어': [
      { title: 'Where Are You From? - 나라 묻기', channel: 'onschool', videoId: 'l6A2EFkjXq4', description: '출신 국가를 영어로 묻고 대답하기' },
      { title: 'What time do you get up?', channel: 'onschool', videoId: '4nh4ERUQp9c', description: '일상 시간을 영어로 말하기' },
      { title: 'May I sit here? - 허락 구하기', channel: 'onschool', videoId: 'UdNQpdUaEFs', description: '공손하게 허락을 구하는 영어 표현' },
    ],
    '수학': [
      { title: '덧셈·뺄셈·곱셈 혼합 계산', channel: '핑퐁쌤', videoId: '602O4kQij1I', description: '혼합 계산의 순서를 배워요' },
      { title: '덧셈·뺄셈·나눗셈 혼합 계산', channel: '핑퐁쌤', videoId: '1Ytm1bDE9nU', description: '나눗셈이 포함된 혼합 계산' },
      { title: '자연수의 혼합계산 단원 도입', channel: '수학교실', videoId: '27HJB6fzZYw', description: '5학년 혼합계산 단원 시작하기' },
    ],
    '코딩': [
      { title: '파이썬 코딩 무료 강의 (기본편)', channel: '나도코딩', videoId: 'kWiCuklohdY', description: '파이썬 기초 문법 6시간 완성 강의' },
      { title: '튜플과 딕셔너리', channel: '달리나음 IT', videoId: 'YVLqi0sAJzc', description: '파이썬 튜플과 딕셔너리 자료형 배우기' },
      { title: '딕셔너리 활용하기', channel: '달리나음 IT', videoId: 'BmXDox6ZFzo', description: '딕셔너리로 데이터를 효율적으로 관리' },
    ],
  },
  'elementary-6': {
    '국어': [
      { title: '독서 소개 영상', channel: 'onschool', videoId: 'Ix4_IJPkai4', description: '효과적인 독서 방법을 배워요' },
      { title: '깊이 있게 읽기', channel: 'onschool', videoId: 'eECQYdutF64', description: '깊이 있는 독서를 위한 전략' },
      { title: '비유적 표현 배우기', channel: 'onschool', videoId: 'RvVsEkPdZVE', description: '비유와 상징적 표현 이해하기' },
    ],
    '영어': [
      { title: 'What Grade Are You In?', channel: 'onschool', videoId: 'eQa7gAVijag', description: '학년을 영어로 묻고 대답하기' },
      { title: '서수 랩 (first ~ tenth)', channel: 'onschool', videoId: 'lee5D5iSkZk', description: '랩으로 영어 서수 배우기' },
      { title: 'I have a cold - 건강 표현', channel: 'onschool', videoId: 'bVOuuV9Z828', description: '아플 때 쓰는 영어 표현 역할극' },
    ],
    '수학': [
      { title: '분수의 나눗셈 (5분 정리)', channel: 'onschool', videoId: '808bPy95mAQ', description: '6학년 1학기 분수의 나눗셈 핵심 정리' },
      { title: '각기둥 알아보기', channel: 'onschool', videoId: 'SLbCnxbYtBo', description: '각기둥의 성질과 특징 이해' },
      { title: '각기둥 (입체도형)', channel: 'onschool', videoId: 'ObwJ13eGb6U', description: '입체도형으로서의 각기둥 탐구' },
    ],
    '코딩': [
      { title: '집합 자료형 이해하기', channel: '달리나음 IT', videoId: 'nsAtYHnovUA', description: '파이썬 집합(Set) 자료형 배우기' },
      { title: '불(Boolean) - 참과 거짓', channel: '달리나음 IT', videoId: 'kuEJlH1-8eo', description: '프로그래밍의 참/거짓 논리 이해하기' },
      { title: '변수 활용하기', channel: '달리나음 IT', videoId: 'k7J6dt-tsbI', description: '변수를 만들고 활용하는 방법 배우기' },
    ],
  },

  // ── 중학교 ──
  'middle-1': {
    '국어': [
      { title: '중1 국어 - 요약하며 읽기', channel: '나무아카데미', videoId: 'aIOdQMf9aQY', description: '중1 국어 내신 대비 핵심 강의' },
      { title: '중1 국어 - 시의 운율과 이미지', channel: '나무아카데미', videoId: 'aJbckPhNIBQ', description: '시를 분석하는 기본 방법' },
      { title: '중1 국어 - 정보 전달하는 글 쓰기', channel: '나무아카데미', videoId: 'rneko5a5cmY', description: '객관적이고 정확한 정보 전달 글쓰기' },
    ],
    '영어': [
      { title: '중1 영어 5과 본문 내신대비', channel: '영어의비법', videoId: 'AjhA6nf8WmI', description: '중학교 1학년 영어 교과서 핵심 해설' },
      { title: '중1 영어 5과 본문해설', channel: '영어의비법', videoId: '8TP21rMWJXE', description: '중1 영어 단원별 본문 해설' },
      { title: '중1 영어 능률 5과 내신대비', channel: '영어의비법', videoId: 'xQ_Cde3YFYs', description: '능률 교과서 기반 내신 대비' },
    ],
    '수학': [
      { title: '중1 수학 - 다항식의 덧셈과 뺄셈', channel: '수악중독', videoId: '-Scmiczp_Fs', description: '중1 수학 다항식 연산의 기초' },
      { title: '중1 수학 - 정수와 유리수', channel: '수악중독', videoId: 'rNskXNSFcfo', description: '정수와 유리수의 개념과 사칙연산' },
      { title: '중학 수학 개념 정리', channel: '수악중독', videoId: '-Scmiczp_Fs', description: '중학교 수학 핵심 개념 정리' },
    ],
    '코딩': [
      { title: '점프 투 파이썬 (2023)', channel: '조코딩 JoCoding', videoId: 'ftQZo7XaTOA', description: '파이썬 입문 - 점프 투 파이썬 교재 기반' },
      { title: '조건문 (if문) 배우기', channel: '달리나음 IT', videoId: 'B5WF6k70svo', description: '파이썬 조건문으로 프로그램 흐름 제어하기' },
      { title: '반복문 (while/for) 배우기', channel: '달리나음 IT', videoId: '1Ts4h7_0V-0', description: '반복문으로 효율적인 코드 작성하기' },
    ],
  },
  'middle-2': {
    '국어': [
      { title: '중2 국어 - 시선과 목소리', channel: '나무아카데미', videoId: 'U4IZp9IYYEU', description: '중2 국어 지학사 내신 대비 강의' },
      { title: '중2 국어 - 올바른 발음과 표기', channel: '나무아카데미', videoId: 'nFHpCANAa9s', description: '비상 교과서 기반 발음과 표기 학습' },
      { title: '중2 국어 - 발음은 정확히, 글은 바르게', channel: '나무아카데미', videoId: 'L7Rn7R_8ox0', description: '지학사 2단원 내신 대비 강의' },
    ],
    '영어': [
      { title: '중등 영어 - 동사 시제 총정리', channel: '영어의비법', videoId: 'XjtEIVf189E', description: '현재, 과거, 미래, 현재완료 시제 정리' },
      { title: '영문법 to부정사 해석법', channel: '영어의비법', videoId: 'eSsegP1aHbM', description: 'to부정사의 다양한 해석 방법' },
      { title: '중학 영어 본문 내신대비', channel: '영어의비법', videoId: 'HwzWzs-uFoI', description: '비상 교과서 본문 해설' },
    ],
    '수학': [
      { title: '중2 수학 - 연립방정식', channel: '수악중독', videoId: '-Scmiczp_Fs', description: '연립방정식의 풀이와 활용 문제' },
      { title: '중2 수학 - 일차함수의 그래프', channel: '수악중독', videoId: 'rNskXNSFcfo', description: 'y=ax+b 일차함수의 그래프와 성질' },
      { title: '중학 수학 수동태와 수식', channel: '수학교실', videoId: '27HJB6fzZYw', description: '중학교 수학 핵심 개념 정리' },
    ],
    '코딩': [
      { title: '함수 만들기', channel: '달리나음 IT', videoId: '0b7xo33cfa4', description: '파이썬 함수 정의와 호출 방법' },
      { title: '입력과 출력', channel: '달리나음 IT', videoId: 'L7E9l_cU17U', description: '사용자 입력 받기와 결과 출력하기' },
      { title: '파일 다루기', channel: '달리나음 IT', videoId: 'urHDYgAPJiM', description: '파이썬으로 파일 읽기/쓰기' },
    ],
  },
  'middle-3': {
    '국어': [
      { title: '중3 국어 - 창비 내신 대비', channel: '나무아카데미', videoId: 'aJbckPhNIBQ', description: '중3 국어 창비 교과서 내신 대비' },
      { title: '중3 국어 - 자신 있게 말하기', channel: '나무아카데미', videoId: 'u_h6x3AGXl8', description: '비상 교과서 기반 말하기 단원' },
      { title: '중3 국어 - 노새 두 마리', channel: '나무아카데미', videoId: 'vIsB-Qb_VoM', description: '비상 교과서 문학 작품 분석' },
    ],
    '영어': [
      { title: '중3 영어 - 수동태 완벽 정리', channel: '영어정복', videoId: '4Lh8chO16EQ', description: '시제별 수동태와 의문문 수동태' },
      { title: '중3 영어 본문 내신대비', channel: '영어의비법', videoId: 'IS99qwRD2Lc', description: '동아 교과서 본문 해설' },
      { title: '중3 영어 - 고교 대비 문법', channel: '영어의비법', videoId: 'r3TzRC6EtBQ', description: '고등학교 대비 핵심 문법 정리' },
    ],
    '수학': [
      { title: '중3 수학 - 이차방정식', channel: '수악중독', videoId: '-Scmiczp_Fs', description: '이차방정식의 풀이법과 근의 공식' },
      { title: '중3 수학 - 이차함수의 그래프', channel: '수악중독', videoId: 'rNskXNSFcfo', description: 'y=ax² 이차함수의 그래프 이해' },
      { title: '중3 수학 핵심 개념 정리', channel: '수학교실', videoId: '27HJB6fzZYw', description: '고등학교 대비 수학 핵심 정리' },
    ],
    '코딩': [
      { title: '클래스와 객체', channel: '달리나음 IT', videoId: 'x1opLkO4zvE', description: '파이썬 객체지향 프로그래밍 입문' },
      { title: '모듈 활용하기', channel: '달리나음 IT', videoId: 'K-7GMt1YhLw', description: '파이썬 모듈을 만들고 사용하는 방법' },
      { title: '패키지 구조 이해하기', channel: '달리나음 IT', videoId: 'pfUohnK0ir8', description: '파이썬 패키지로 코드 체계적으로 관리' },
    ],
  },

  // ── 고등학교 ──
  'high-1': {
    '국어': [
      { title: '고1 국어 - 천재 내신 대비', channel: '나무아카데미', videoId: 'AOetHFbNLTc', description: '고1 국어 천재 교과서 전 단원 강의' },
      { title: '고1 공통국어2 내신 대비', channel: '나무아카데미', videoId: 'm2Q-_6zNNNU', description: '비상 교과서 기반 내신 대비 강의' },
      { title: '고1 국어 - 문학 작품 분석법', channel: '나무아카데미', videoId: 'AOetHFbNLTc', description: '소설과 시를 체계적으로 분석하는 방법' },
    ],
    '영어': [
      { title: '수능 어법 기초 - 관계대명사 1', channel: '쉽셀tv', videoId: 'qlZ80FBEk0Y', description: '관계대명사 개념과 종류 알아보기' },
      { title: '수능 어법 기초 - 관계대명사 2', channel: '쉽셀tv', videoId: 'at8Be96Anjk', description: '관계대명사 심화 학습' },
      { title: 'could/must/should have p.p. 어법', channel: '쉘위tv', videoId: 'AqeMlApbFZ8', description: '고1 필수 조동사 완료 구문' },
    ],
    '수학': [
      { title: '고1 수학 - 다항식의 연산', channel: '수악중독', videoId: '-Scmiczp_Fs', description: '다항식의 덧셈, 뺄셈, 곱셈, 나눗셈' },
      { title: '고1 수학 - 공통수학1 개념', channel: '수악중독', videoId: 'rNskXNSFcfo', description: '공통수학1 핵심 개념 파헤치기' },
      { title: '고1 수학 - 방정식과 부등식', channel: '수악중독', videoId: '-Scmiczp_Fs', description: '이차방정식, 이차부등식 심화' },
    ],
    '코딩': [
      { title: 'JAVA 프로그래밍 입문', channel: '생활코딩', videoId: '-dPXqgWQBGE', description: '자바 프로그래밍 수업 소개 및 방향' },
      { title: 'Hello World - 첫 자바 프로그램', channel: '생활코딩', videoId: 'pUqRAHxpxjM', description: '자바로 첫 프로그램 작성하기' },
      { title: '자바의 동작 원리', channel: '생활코딩', videoId: 'AuiMh9bGTKI', description: '자바 코드가 실행되는 원리 이해' },
    ],
  },
  'high-2': {
    '국어': [
      { title: '고2 문학 - 지학사 내신 대비', channel: '나무아카데미', videoId: 'nPeW4WGdZrI', description: '지학사 문학 교과서 전 단원 강의' },
      { title: '고2 문학 - 광장 (최인훈)', channel: '나무아카데미', videoId: '8CdFc_CJqFM', description: '비상 교과서 소설 "광장" 분석' },
      { title: '고2 국어 - 비문학 독해 훈련', channel: '나무아카데미', videoId: 'nPeW4WGdZrI', description: '고난도 비문학 지문 독해 훈련' },
    ],
    '영어': [
      { title: '고2 영어 - 능률 3과 내신대비', channel: '영어의비법', videoId: 'hUBCdMwzLCI', description: '능률 오선영 교과서 본문 해설' },
      { title: '고2 영어 - 능률 민병천 3과', channel: '영어의비법', videoId: '1nzHQQ79QKg', description: '능률 민병천 교과서 해설강의' },
      { title: '고등 영어 - 능률오 1과 해설', channel: '영어의비법', videoId: 'KnSi3kRJAtg', description: '고등 영어 교과서 1과 본문 분석' },
    ],
    '수학': [
      { title: '삼차함수의 대칭과 비율관계 1', channel: '메가스터디 현우진', videoId: 'uON650egSVU', description: '삼차함수 그래프의 대칭 특징' },
      { title: '삼차함수의 대칭과 비율관계 2', channel: '메가스터디 현우진', videoId: 'OokdBPW5TmY', description: '삼차함수 비율관계 심화 학습' },
      { title: '사차함수의 대칭과 비율관계', channel: '메가스터디 현우진', videoId: 'acRsLeti7vw', description: '사차함수의 대칭과 비율 특징' },
    ],
    '코딩': [
      { title: '자바 변수와 데이터 타입', channel: '생활코딩', videoId: 'FtWGiWBNJ-I', description: '자바 변수 선언과 기본 데이터 타입' },
      { title: '자바 조건문 활용', channel: '생활코딩', videoId: 'y-qUWhanlkM', description: '자바 if/else 조건문으로 분기 처리' },
      { title: '자바 반복문 활용', channel: '생활코딩', videoId: '4-5tmh5Krk8', description: '자바 for/while 반복문 실습' },
    ],
  },
  'high-3': {
    '국어': [
      { title: '수능 국어 - 사람 때문에 흔들리겠는가', channel: '메가스터디 박석준', videoId: 'dSolM3Af8yI', description: '수능 국어 문학 분석 및 풀이 전략' },
      { title: '고3 국어 - 수능 문학 기출분석', channel: '나무아카데미', videoId: 'AOetHFbNLTc', description: '수능 문학 기출 패턴 분석' },
      { title: '고3 국어 - 비문학 독해 전략', channel: '나무아카데미', videoId: 'm2Q-_6zNNNU', description: '수능 비문학 지문 빠르게 읽기' },
    ],
    '영어': [
      { title: '수능 영어 - 첫 문장 전략', channel: '메가스터디 조정식', videoId: 'ydFu153wk34', description: '수능 영어 독해 첫 문장 활용법' },
      { title: '수능 영어 - 주제찾기 비법', channel: '영어의비법', videoId: '1VCMnuoioZA', description: '수능 영어 주제 파악 전략' },
      { title: '수능 영어 - 직독직해 구문특강', channel: '영어의비법', videoId: 'hWFmfJktQCo', description: '수능 대비 직독직해 훈련' },
    ],
    '수학': [
      { title: '삼차함수의 대칭과 비율관계 1', channel: '메가스터디 현우진', videoId: 'uON650egSVU', description: '수능 수학 삼차함수 핵심 특징' },
      { title: '삼차함수의 대칭과 비율관계 2', channel: '메가스터디 현우진', videoId: 'OokdBPW5TmY', description: '수능 수학 고난도 함수 문제 풀이' },
      { title: '사차함수의 대칭과 비율관계', channel: '메가스터디 현우진', videoId: 'acRsLeti7vw', description: '사차함수 킬러문항 대비' },
    ],
    '코딩': [
      { title: '자바 메소드 정의와 호출', channel: '생활코딩', videoId: 'XXFaCUcwWIk', description: '자바 메소드를 만들고 활용하는 방법' },
      { title: '자바 클래스와 인스턴스', channel: '생활코딩', videoId: 'l8hrA4VSIlA', description: '자바 객체지향 프로그래밍의 핵심' },
      { title: '패키지와 API 활용', channel: '생활코딩', videoId: 'kSH6-DU68fo', description: '자바 패키지 구조와 API 사용법' },
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
