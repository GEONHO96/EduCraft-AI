/**
 * ChatBot - 우측 하단 AI 챗봇 위젯
 * 귀여운 로봇 아이콘을 클릭하면 채팅 창이 열리며,
 * 백엔드 AI 응답이 불가능할 경우 오프라인 키워드 응답으로 자동 전환된다.
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import apiClient from '../api/client'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  time: string
}

// ====== 오프라인 응답 시스템 (점수 기반 매칭) ======
const OFFLINE_RESPONSES: { keywords: string[]; reply: string; score?: number }[] = [
  // ─── 인사/소개 ───
  { keywords: ['안녕', '하이', 'hello', 'hi', '반가'],
    reply: '안녕하세요! 저는 에듀봇이에요 🤖✨ EduCraft AI의 학습 도우미랍니다!\n\n무엇이 궁금하신가요?\n• 플랫폼 사용법\n• 공부 방법/질문\n• 강의·퀴즈 관련\n\n편하게 물어봐주세요!' },
  { keywords: ['이름', '누구', '뭐야', '소개', '에듀봇'],
    reply: '저는 에듀봇이에요! EduCraft AI의 AI 학습 도우미입니다 🎓\n\n저한테 물어볼 수 있는 것들:\n📚 국어, 영어, 수학 등 학습 질문\n🎯 플랫폼 기능 사용법 안내\n📝 공부 방법, 시험 준비 팁\n💬 기타 학습 관련 궁금증\n\n뭐든 편하게 물어봐주세요~' },

  // ─── 교강사 전용: AI 자료 생성 ───
  { keywords: ['교육자료', '자료 만들', '자료 생성', '학습자료', '교안', '수업자료'],
    reply: 'AI 교육자료 만드는 방법을 안내해드릴게요! 📝\n\n1️⃣ 먼저 "내 강의"에서 강의를 생성하세요\n2️⃣ 강의 안에 커리큘럼(주차)을 추가하세요\n3️⃣ 각 커리큘럼에 학습자료를 추가할 때 "AI 생성" 버튼을 누르면 AI가 자동으로 교육 내용을 만들어줍니다\n4️⃣ 생성된 자료를 검토하고 수정하면 완성!\n\n💡 과목과 학년 수준을 설정하면 더 정확한 자료가 생성돼요.' },
  { keywords: ['ai 생성', 'ai 만들', 'ai로', '자동 생성', '자동으로'],
    reply: 'EduCraft AI의 AI 자동 생성 기능을 안내해드릴게요! 🤖\n\n📝 학습자료 AI 생성: 강의 > 커리큘럼 > "AI 생성" 버튼\n🎯 퀴즈 AI 생성: 학습자료 페이지 > "AI 퀴즈 생성" 버튼\n\n과목, 학년, 난이도를 설정하면 AI가 맞춤 콘텐츠를 만들어줍니다. 생성 후 직접 수정도 가능해요!' },

  // ─── 강의 관련 ───
  { keywords: ['강의 만들', '강의 생성', '강의 등록', '강의 개설'],
    reply: '강의를 만드는 방법이에요! 📚\n\n1️⃣ 대시보드 > "새 강의 만들기" 클릭\n2️⃣ 강의 제목, 과목, 설명 입력\n3️⃣ 생성 후 커리큘럼(주차별 수업) 추가\n4️⃣ 각 주차에 학습자료 추가\n5️⃣ 학습자료에 퀴즈 연결\n\n💡 교강사 계정으로 로그인해야 강의를 만들 수 있어요!' },
  { keywords: ['수강', '신청', '등록', '듣고 싶', '강의 찾'],
    reply: '강의 수강 방법이에요! 🎒\n\n1️⃣ "강의 탐색" 메뉴에서 원하는 강의 검색\n2️⃣ 과목별로 필터링하거나 키워드로 검색\n3️⃣ 마음에 드는 강의 클릭 > "수강 신청" 버튼\n4️⃣ "내 강의" 메뉴에서 수강 중인 강의 확인\n\n수강 신청하면 바로 학습을 시작할 수 있어요! 📖' },
  { keywords: ['강의', '추천', '영상', '유튜브', '동영상'],
    reply: '강의 추천 기능을 안내해드릴게요! 🎬\n\n"강의 추천" 메뉴에서 학년별 맞춤 유튜브 교육 영상을 볼 수 있어요.\n\n지원 과목: 국어, 영어, 수학, 과학, 코딩\n지원 학년: 초등~고등\n\n검증된 교육 채널의 영상만 추천해드려요! ✨' },

  // ─── 커리큘럼/학습자료 ───
  { keywords: ['커리큘럼', '주차', '수업 추가', '수업 만들'],
    reply: '커리큘럼 추가 방법이에요! 📋\n\n1️⃣ 내 강의 > 강의 선택 > "커리큘럼 관리"\n2️⃣ "새 커리큘럼 추가" 클릭\n3️⃣ 주차 제목과 설명 입력\n4️⃣ 커리큘럼 안에 학습자료를 추가\n\n커리큘럼은 주차별 수업 단위예요. 순서대로 학습할 수 있도록 구성해보세요! 📖' },

  // ─── 퀴즈 ───
  { keywords: ['퀴즈', '문제', '시험', '테스트', '채점', '점수'],
    reply: 'EduCraft AI의 퀴즈 기능을 안내해드릴게요! 🎯\n\n👨‍🏫 교강사: 학습자료에서 "AI 퀴즈 생성" → 과목·난이도·문항 수 설정 → AI가 자동 생성\n👨‍🎓 학생: 강의 수강 중 퀴즈 풀기 → 즉시 채점 → 오답 해설 확인\n\n정기적으로 퀴즈를 풀면 학습 효과가 훨씬 좋아요! 💪' },
  { keywords: ['오답', '해설', '틀린', '풀이', '정답'],
    reply: '퀴즈 오답 확인 방법이에요! ✏️\n\n퀴즈를 제출하면 바로 채점 결과가 나와요.\n✅ 맞은 문제: 정답 표시\n❌ 틀린 문제: 정답 + 해설 함께 제공\n\n틀린 문제를 다시 복습하면 실력이 쑥쑥 올라요! 📈' },

  // ─── 대시보드/통계 ───
  { keywords: ['대시보드', '통계', '현황', '진도', '성적'],
    reply: '대시보드에서 학습 현황을 확인할 수 있어요! 📊\n\n👨‍🏫 교강사 대시보드:\n• 내 강의 수, 총 수강생 수\n• AI 사용량, 퀴즈 평균 점수\n\n👨‍🎓 학생 대시보드:\n• 수강 중인 강의 목록\n• 퀴즈 점수, 학습 진도\n\n왼쪽 메뉴에서 "대시보드"를 클릭해보세요!' },

  // ─── 학습 과목 ───
  { keywords: ['수학', '덧셈', '뺄셈', '곱셈', '나눗셈', '방정식', '함수', '미분', '적분', '확률', '기하'],
    reply: '수학 관련 도움이 필요하시군요! 📐\n\n구체적으로 어떤 게 궁금하신가요?\n• 특정 공식이나 개념 설명\n• 문제 풀이 방법\n• 수학 공부법 추천\n\nEduCraft AI의 "AI 퀴즈"에서 수학 문제를 풀어볼 수도 있고, "강의 추천"에서 수학 강의를 찾아볼 수도 있어요! 💪' },
  { keywords: ['영어', 'english', '단어', '문법', '독해', '영단어', '회화', '듣기', '리스닝'],
    reply: '영어 학습을 도와드릴게요! 📚\n\n효과적인 영어 공부 순서:\n1. 📝 기본 단어 암기 (하루 10~20개)\n2. 📖 문법 기초 다지기\n3. 📰 짧은 글 독해 연습\n4. 🎧 듣기 연습\n\nAI 퀴즈에서 영어 문제도 풀어보고, 강의 추천에서 영어 강의도 확인해보세요! ✨' },
  { keywords: ['국어', '맞춤법', '문학', '비문학', '독서', '글쓰기', '작문', '논술'],
    reply: '국어 학습을 도와드릴게요! 📖\n\n국어 실력 향상 팁:\n1. 📚 다양한 장르의 글 읽기\n2. ✍️ 핵심 내용 요약 연습\n3. 📝 맞춤법/문법 기초 다지기\n4. 💭 주제와 의도 파악 훈련\n\n"강의 추천"에서 국어 강의, AI 퀴즈에서 국어 문제를 풀어보세요!' },
  { keywords: ['과학', '물리', '화학', '생물', '지구과학', '실험'],
    reply: '과학 학습을 도와드릴게요! 🔬\n\n과학 공부 팁:\n• 개념 이해 → 예시/실험 확인 → 문제 풀이\n• 교과서 그림과 도표 꼼꼼히 보기\n• 실험 과정과 결과를 정리하는 습관\n\n"강의 추천"에서 과학 강의 영상도 확인해보세요! 🧪' },
  { keywords: ['코딩', '프로그래밍', '파이썬', '자바', '알고리즘', '개발'],
    reply: '코딩 학습을 도와드릴게요! 💻\n\n코딩 공부 순서 추천:\n1. 🐍 Python으로 기초 시작 (변수, 조건문, 반복문)\n2. 📊 간단한 프로젝트 만들기\n3. 🧩 알고리즘 기초 학습\n4. 🚀 원하는 분야로 확장\n\n"강의 추천" 메뉴에서 코딩 강의 영상도 있어요! ✨' },

  // ─── 공부법/동기부여 ───
  { keywords: ['공부', '학습', '방법', '어떻게', '잘하', '못하', '성적', '올리', '계획'],
    reply: '효과적인 공부법을 알려드릴게요! 📝\n\n1. 📅 매일 정해진 시간에 공부하기\n2. 🔄 배운 내용 그날 복습하기 (에빙하우스 망각곡선!)\n3. ❌ 틀린 문제 오답노트 만들기\n4. ⏰ 50분 공부 + 10분 휴식 (포모도로 기법)\n5. 🎯 작은 목표부터 달성하기\n\nEduCraft AI에서 퀴즈를 풀면서 복습하면 더 효과적이에요! 💪' },
  { keywords: ['집중', '못 해', '졸려', '지루', '힘들', '어려', '싫어', '포기'],
    reply: '공부가 힘들 때는 누구나 있어요 🥺\n\n지금 당장 할 수 있는 것들:\n1. 🧘 2분 스트레칭\n2. 💧 물 한 잔 마시기\n3. 🎵 좋아하는 음악 한 곡 듣기\n4. ✏️ 가장 쉬운 과목부터 시작\n\n10분만 집중해보세요! 짧은 시간이라도 집중해서 하면 긴 시간 대충 하는 것보다 훨씬 효과적이에요. 화이팅! 🔥' },
  { keywords: ['고마워', '감사', '고마', '좋아', '최고', '짱', '대박', '잘했'],
    reply: '감사합니다! 🥰 도움이 되었다니 기쁘네요!\n\n더 궁금한 게 있으면 언제든 물어봐주세요. 항상 응원하고 있을게요! 💖🔥' },

  // ─── 커뮤니티 ───
  { keywords: ['커뮤니티', '게시글', '글쓰기', '피드', '팔로우', '팔로잉', '좋아요', '댓글'],
    reply: '커뮤니티 기능을 안내해드릴게요! 💬\n\n📝 글쓰기: 학습 일지, 질문, 정보 공유 가능\n📷 이미지: 사진 첨부 가능\n❤️ 좋아요: 유용한 글에 좋아요 누르기\n💬 댓글: 다른 사용자 글에 댓글 달기\n👥 팔로우: 관심 있는 사용자 팔로우\n\n"커뮤니티" 메뉴에서 시작해보세요!' },

  // ─── 계정/설정 ───
  { keywords: ['회원가입', '가입'],
    reply: '회원가입 방법이에요! 🔐\n\n1️⃣ 로그인 화면 > "회원가입" 클릭\n2️⃣ 이름, 이메일, 비밀번호 입력\n3️⃣ 역할 선택 (교강사/학생)\n4️⃣ 학생은 학년도 선택\n\n또는 Google, Kakao, Naver 소셜 로그인으로 간편하게 가입할 수도 있어요! ✨' },
  { keywords: ['로그인', '비밀번호', '아이디', '계정', '잠겨', '접속'],
    reply: '계정 관련 도움이에요! 🔑\n\n🔓 로그인: 이메일 + 비밀번호 또는 소셜 로그인(Google/Kakao/Naver)\n🔑 비밀번호 분실: 로그인 화면 > "비밀번호 찾기" > 이메일 입력 > 임시 비밀번호 발급\n⚙️ 비밀번호 변경: 설정 > 비밀번호 변경\n\n소셜 로그인 계정은 해당 소셜 서비스로만 로그인 가능해요!' },
  { keywords: ['설정', '프로필', '닉네임', '이미지', '사진'],
    reply: '프로필 설정 방법이에요! ⚙️\n\n왼쪽 메뉴 > "설정" 에서:\n• 📸 프로필 이미지 변경\n• ✏️ 닉네임 변경\n• 🔒 비밀번호 변경\n• 🗑️ 계정 탈퇴\n\n를 할 수 있어요!' },
  { keywords: ['탈퇴', '삭제', '계정 지우', '떠나'],
    reply: '계정 탈퇴 방법이에요 😢\n\n설정 > "계정 탈퇴" > 비밀번호 입력 > 탈퇴 확인\n\n⚠️ 탈퇴하면 모든 데이터(강의, 퀴즈 기록, 게시글 등)가 삭제되고 복구할 수 없어요. 신중하게 결정해주세요!' },

  // ─── 기능 안내 ───
  { keywords: ['기능', '뭘 할 수', '할 수 있', '사용법', '도움', '도와', '메뉴', '어디'],
    reply: 'EduCraft AI의 주요 기능이에요! 🌟\n\n📚 강의 탐색 - 다양한 강의 검색·수강\n🎯 AI 퀴즈 - AI가 만든 맞춤 퀴즈 풀기\n🎬 강의 추천 - 학년별 유튜브 교육 영상\n💬 커뮤니티 - 학습 정보 공유·소통\n📊 대시보드 - 학습 현황·통계\n🤖 AI 생성 (교강사) - AI로 교육자료·퀴즈 자동 생성\n\n어떤 기능이 궁금하신가요?' },
  { keywords: ['초등', '중학', '고등', '학년', '몇 학년'],
    reply: '학년별 맞춤 콘텐츠가 준비되어 있어요! 🏫\n\n지원 학년: 초등 1~6학년, 중등 1~3학년, 고등 1~3학년\n\n• AI 퀴즈: 학년 수준에 맞는 문제 생성\n• 강의 추천: 학년별 맞춤 영상\n• 강의: 각 수준에 맞는 강의 수강\n\n설정에서 학년을 변경할 수도 있어요! 📖' },

  // ─── 만드는 법 / 하는 법 (일반) ───
  { keywords: ['만드는 법', '만드는 방법', '하는 법', '하는 방법', '어떻게 해', '어떻게 만'],
    reply: '무엇을 만들거나 하는 방법이 궁금하시군요! 🤔\n\nEduCraft AI에서 할 수 있는 것들:\n• 📚 강의 만들기 (교강사)\n• 📝 AI 교육자료 생성 (교강사)\n• 🎯 AI 퀴즈 생성 (교강사)\n• 💬 커뮤니티 글 작성\n• 📊 학습 관리\n\n좀 더 구체적으로 어떤 것이 궁금한지 알려주시면 자세히 안내해드릴게요!' },
]

const DEFAULT_REPLY = '궁금한 점이 있으시군요! 🤔\n\n제가 도와드릴 수 있는 분야예요:\n• 📚 학습 질문 (국어, 영어, 수학, 과학, 코딩)\n• 🎯 EduCraft AI 사용법 (강의, 퀴즈, 커뮤니티 등)\n• 📝 공부 방법, 시험 준비 팁\n\n좀 더 구체적으로 질문해주시면 정확한 답변을 드릴 수 있어요! 예: "AI로 퀴즈 만드는 법", "수학 공부 방법" 등'

function getOfflineReply(message: string): string {
  const lower = message.toLowerCase().replace(/\s+/g, ' ')

  // 점수 기반 매칭: 가장 많은 키워드가 매칭되는 응답 선택
  let bestMatch = { reply: DEFAULT_REPLY, score: 0 }

  for (const item of OFFLINE_RESPONSES) {
    let matchCount = 0
    for (const k of item.keywords) {
      if (lower.includes(k.toLowerCase())) matchCount++
    }
    if (matchCount > 0 && matchCount > bestMatch.score) {
      bestMatch = { reply: item.reply, score: matchCount }
    }
  }

  return bestMatch.reply
}

function getCurrentTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

// ====== 귀여운 로봇 SVG ======
function RobotIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 안테나 */}
      <line x1="50" y1="12" x2="50" y2="24" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="9" r="5" fill="#a78bfa" stroke="#6366f1" strokeWidth="2">
        <animate attributeName="fill" values="#a78bfa;#fbbf24;#a78bfa" dur="2s" repeatCount="indefinite"/>
      </circle>
      {/* 머리 */}
      <rect x="22" y="24" width="56" height="44" rx="14" fill="#6366f1"/>
      <rect x="26" y="28" width="48" height="36" rx="10" fill="#818cf8"/>
      {/* 눈 */}
      <ellipse cx="38" cy="44" rx="7" ry="8" fill="white"/>
      <ellipse cx="62" cy="44" rx="7" ry="8" fill="white"/>
      <ellipse cx="39" cy="45" rx="4" ry="4.5" fill="#1e1b4b">
        <animate attributeName="cy" values="45;43;45" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="63" cy="45" rx="4" ry="4.5" fill="#1e1b4b">
        <animate attributeName="cy" values="45;43;45" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      {/* 눈 하이라이트 */}
      <circle cx="41" cy="42" r="1.5" fill="white"/>
      <circle cx="65" cy="42" r="1.5" fill="white"/>
      {/* 볼 터치 */}
      <ellipse cx="30" cy="52" rx="5" ry="3" fill="#f9a8d4" opacity="0.6"/>
      <ellipse cx="70" cy="52" rx="5" ry="3" fill="#f9a8d4" opacity="0.6"/>
      {/* 입 - 미소 */}
      <path d="M42 55 Q50 62 58 55" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* 귀 */}
      <rect x="12" y="38" width="10" height="16" rx="5" fill="#6366f1"/>
      <rect x="78" y="38" width="10" height="16" rx="5" fill="#6366f1"/>
      {/* 몸통 */}
      <rect x="30" y="70" width="40" height="22" rx="8" fill="#6366f1"/>
      <rect x="34" y="74" width="32" height="14" rx="5" fill="#818cf8"/>
      {/* 하트 (가슴) */}
      <path d="M50 78 C50 76, 46 73, 44 76 C42 79, 50 84, 50 84 C50 84, 58 79, 56 76 C54 73, 50 76, 50 78Z" fill="#f472b6">
        <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite"/>
      </path>
    </svg>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: '안녕하세요! 저는 에듀봇이에요 🤖\n공부하다 궁금한 거 있으면 뭐든 물어봐주세요!', time: getCurrentTime() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(1)

  // 스크롤 하단 고정
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  /** localStorage에서 유저 정보 추출 */
  const getUserContext = () => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return undefined
      const user = JSON.parse(raw)
      return {
        name: user.displayName || user.nickname || user.name || undefined,
        role: user.role || undefined,
        grade: user.grade || undefined,
      }
    } catch { return undefined }
  }

  /** 이전 대화 기록을 API 전송 형식으로 변환 (초기 인사 제외, 최근 20개) */
  const buildHistory = (msgs: Message[]) => {
    return msgs
      .filter(m => m.id !== 0) // 초기 인사 메시지 제외
      .slice(-20)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'bot', text: m.text }))
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg: Message = { id: idRef.current++, role: 'user', text, time: getCurrentTime() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    let botReply = ''

    try {
      const res = await apiClient.post('/chat', {
        message: text,
        history: buildHistory([...messages]),
        userContext: getUserContext(),
      })
      const data = res.data.data
      if (data.offline) {
        botReply = getOfflineReply(text)
      } else {
        botReply = data.reply
      }
    } catch {
      botReply = getOfflineReply(text)
    }

    // 타이핑 효과를 위한 딜레이
    await new Promise(r => setTimeout(r, 300 + Math.random() * 500))

    const botMsg: Message = { id: idRef.current++, role: 'bot', text: botReply, time: getCurrentTime() }
    setMessages(prev => [...prev, botMsg])
    setIsTyping(false)

    if (!isOpen) setHasUnread(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // 빠른 질문 전송
  const sendQuick = (text: string) => {
    if (isTyping) return
    const userMsg: Message = { id: idRef.current++, role: 'user', text, time: getCurrentTime() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    ;(async () => {
      let botReply = ''
      try {
        const res = await apiClient.post('/chat', {
          message: text,
          history: buildHistory([...messages]),
          userContext: getUserContext(),
        })
        const data = res.data.data
        botReply = data.offline ? getOfflineReply(text) : data.reply
      } catch {
        botReply = getOfflineReply(text)
      }
      await new Promise(r => setTimeout(r, 300 + Math.random() * 500))
      setMessages(prev => [...prev, { id: idRef.current++, role: 'bot', text: botReply, time: getCurrentTime() }])
      setIsTyping(false)
    })()
  }

  const quickQuestions = [
    '공부 잘하는 방법 알려줘',
    '퀴즈 풀고 싶어',
    '어떤 기능이 있어?',
  ]

  return (
    <>
      {/* ====== 채팅 창 ====== */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-in">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <RobotIcon size={28} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">에듀봇</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                  <span className="text-white/80 text-[11px]">온라인</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 min-h-0" style={{ maxHeight: '340px' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 flex-shrink-0 mr-2 mt-1">
                    <RobotIcon size={28} />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-gray-400 mt-0.5 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex-shrink-0">
                  <RobotIcon size={28} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 질문 */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 flex-wrap flex-shrink-0">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => sendQuick(q)}
                  className="text-xs bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition whitespace-nowrap">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="px-3 py-2.5 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                disabled={isTyping}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">에듀봇은 학습 도우미이며, 답변이 정확하지 않을 수 있어요</p>
          </div>
        </div>
      )}

      {/* ====== 플로팅 버튼 ====== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 group transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* 그림자 & 펄스 효과 */}
        <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110">
          <RobotIcon size={38} />
          {/* 읽지 않은 메시지 배지 */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              !
            </span>
          )}
        </div>
        {/* 말풍선 툴팁 */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            에듀봇에게 물어보세요! 💬
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </button>
    </>
  )
}
