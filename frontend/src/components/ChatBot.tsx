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

// ====== 오프라인 응답 시스템 ======
const OFFLINE_RESPONSES: { keywords: string[]; reply: string }[] = [
  { keywords: ['안녕', '하이', 'hello', 'hi', '반가'],
    reply: '안녕하세요! 저는 에듀봇이에요 🤖✨ 공부하다 궁금한 거 있으면 뭐든 물어봐주세요!' },
  { keywords: ['이름', '누구', '뭐야', '소개'],
    reply: '저는 에듀봇이에요! EduCraft AI의 학습 도우미랍니다 🎓 국어, 영어, 수학 질문이나 공부 방법 궁금한 건 다 물어봐주세요~' },
  { keywords: ['수학', '덧셈', '뺄셈', '곱셈', '나눗셈', '방정식', '함수', '미분', '적분', '확률'],
    reply: '수학 질문이시군요! 📐 어떤 부분이 어려우신가요? 공식이나 풀이 방법이 궁금하시면 구체적으로 알려주세요! 수학은 단계별로 차근차근 풀면 꼭 풀 수 있어요 💪' },
  { keywords: ['영어', 'english', '단어', '문법', '독해', '영단어', '회화'],
    reply: '영어 공부 중이시군요! 📚 영어는 매일 조금씩 하는 게 최고예요! 단어 암기 → 문법 → 독해 순서로 공부해보세요. AI 퀴즈에서 영어 문제도 풀어볼 수 있어요 ✨' },
  { keywords: ['국어', '맞춤법', '문학', '비문학', '독서', '글쓰기', '작문'],
    reply: '국어 관련 질문이시네요! 📖 국어는 많이 읽는 게 중요해요. 문학 작품을 읽을 때 주제와 핵심 메시지를 파악하는 연습을 해보세요! AI 퀴즈에서 국어 문제도 풀어볼 수 있답니다 ✏️' },
  { keywords: ['퀴즈', '문제', '시험', '테스트'],
    reply: '퀴즈를 풀어보고 싶으시군요! 🎯 메뉴의 "AI 퀴즈"에서 학년과 과목을 선택하면 맞춤 퀴즈를 바로 풀 수 있어요. 틀린 문제는 해설도 확인할 수 있답니다!' },
  { keywords: ['강의', '추천', '영상', '유튜브', '동영상'],
    reply: '강의 추천이요? 🎬 메뉴의 "강의 추천"에서 학년별 맞춤 유튜브 교육 영상을 확인할 수 있어요! 초등~고등까지 검증된 교육 채널 영상이랍니다 ✨' },
  { keywords: ['공부', '학습', '방법', '어떻게', '잘하', '못하', '성적', '올리'],
    reply: '공부 방법이 궁금하시군요! 📝 효과적인 공부법을 알려드릴게요:\n1. 📅 매일 정해진 시간에 공부하기\n2. 🔄 배운 내용 그날 복습하기\n3. ❌ 틀린 문제 오답노트 만들기\n4. ⏰ 50분 공부 + 10분 휴식\n꾸준히 하면 반드시 성적이 올라요! 💪' },
  { keywords: ['집중', '못 해', '졸려', '지루', '힘들', '어려'],
    reply: '공부하기 힘드시죠? 그 마음 충분히 이해해요 🥺💕 잠깐 스트레칭하고 물 한 잔 마시고 오세요! 짧은 시간이라도 집중해서 하면 긴 시간 대충 하는 것보다 훨씬 효과적이에요. 화이팅! 🔥' },
  { keywords: ['고마워', '감사', '고마', '좋아', '최고', '짱'],
    reply: '헤헤 감사합니다! 🥰 저도 여러분과 대화할 수 있어서 행복해요! 앞으로도 공부하다 궁금한 거 있으면 편하게 물어봐주세요~ 항상 응원하고 있을게요! 💖' },
  { keywords: ['커뮤니티', '게시글', '글쓰기', '피드', '팔로우'],
    reply: '커뮤니티에서 다른 학생들과 소통해보세요! 💬 "커뮤니티" 메뉴에서 공부 팁을 공유하거나, Q&A에서 질문할 수 있어요. 좋은 글에 좋아요도 눌러주세요! ❤️' },
  { keywords: ['회원가입', '가입', '로그인', '비밀번호', '아이디', '계정'],
    reply: '계정 관련 도움이 필요하시군요! 🔐\n- 회원가입: 이메일, 비밀번호, 이름 입력 + 학년 선택\n- 소셜 로그인: Google, Kakao, Naver 지원\n- 비밀번호 찾기: 로그인 화면에서 "비밀번호 찾기" 클릭!' },
  { keywords: ['기능', '뭘 할 수', '할 수 있', '사용법', '도움', '도와'],
    reply: 'EduCraft AI에서 할 수 있는 것들이에요! 🌟\n🎯 AI 퀴즈 - 학년별 맞춤 퀴즈 풀기\n🎬 강의 추천 - 유튜브 교육 영상 추천\n📚 강의 탐색 - 다양한 강의 수강\n💬 커뮤니티 - 학습 정보 공유\n무엇을 해볼까요?' },
  { keywords: ['초등', '중학', '고등', '학년'],
    reply: '학년별 맞춤 콘텐츠가 준비되어 있어요! 🏫\n초등 1학년~고등 3학년까지 모두 지원합니다. AI 퀴즈와 강의 추천에서 학년을 선택하면 딱 맞는 수준의 문제와 영상을 볼 수 있어요! 📖' },
]

const DEFAULT_REPLY = '음... 잘 모르겠는 질문이에요 🤔 저는 국어, 영어, 수학 공부나 EduCraft AI 사용법에 대해 도와드릴 수 있어요! 궁금한 게 있으면 편하게 물어봐주세요~ 💬'

function getOfflineReply(message: string): string {
  const lower = message.toLowerCase()
  for (const item of OFFLINE_RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply
    }
  }
  return DEFAULT_REPLY
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

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg: Message = { id: idRef.current++, role: 'user', text, time: getCurrentTime() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    let botReply = ''

    try {
      const res = await apiClient.post('/chat', { message: text })
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
    await new Promise(r => setTimeout(r, 500 + Math.random() * 1000))

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
        const res = await apiClient.post('/chat', { message: text })
        const data = res.data.data
        botReply = data.offline ? getOfflineReply(text) : data.reply
      } catch {
        botReply = getOfflineReply(text)
      }
      await new Promise(r => setTimeout(r, 500 + Math.random() * 1000))
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
