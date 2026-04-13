/**
 * GradeQuizPage - 학년별 AI 퀴즈 페이지 (리뉴얼)
 * 난이도 선택 + 영어 독해 지문 지원 + 대폭 확장된 문제 은행
 */
import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { aiApi } from '../../api/ai'
import toast from 'react-hot-toast'
import {
  type Question, type Difficulty,
  getQuestions, shuffle,
  DIFFICULTY_LABEL, DIFFICULTY_COLOR,
} from '../../data/gradeQuizBank'

type Phase = 'setup' | 'loading' | 'quiz' | 'result'
type DifficultyFilter = Difficulty | 'all'

const GRADE_OPTIONS = [
  { group: '초등학교', items: [
    { value: 'ELEMENTARY_1', label: '1학년' }, { value: 'ELEMENTARY_2', label: '2학년' },
    { value: 'ELEMENTARY_3', label: '3학년' }, { value: 'ELEMENTARY_4', label: '4학년' },
    { value: 'ELEMENTARY_5', label: '5학년' }, { value: 'ELEMENTARY_6', label: '6학년' },
  ]},
  { group: '중학교', items: [
    { value: 'MIDDLE_1', label: '1학년' }, { value: 'MIDDLE_2', label: '2학년' },
    { value: 'MIDDLE_3', label: '3학년' },
  ]},
  { group: '고등학교', items: [
    { value: 'HIGH_1', label: '1학년' }, { value: 'HIGH_2', label: '2학년' },
    { value: 'HIGH_3', label: '3학년' },
  ]},
]

const SUBJECTS = ['국어', '영어', '수학', '코딩']

const GRADE_LABEL: Record<string, string> = {
  ELEMENTARY_1: '초등 1학년', ELEMENTARY_2: '초등 2학년', ELEMENTARY_3: '초등 3학년',
  ELEMENTARY_4: '초등 4학년', ELEMENTARY_5: '초등 5학년', ELEMENTARY_6: '초등 6학년',
  MIDDLE_1: '중학 1학년', MIDDLE_2: '중학 2학년', MIDDLE_3: '중학 3학년',
  HIGH_1: '고등 1학년', HIGH_2: '고등 2학년', HIGH_3: '고등 3학년',
}

// ================================================================
export default function GradeQuizPage() {
  const { user } = useAuthStore()

  const [grade, setGrade] = useState(user?.grade || '')
  const [subject, setSubject] = useState('수학')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [questionCount, setQuestionCount] = useState(5)
  const [phase, setPhase] = useState<Phase>('setup')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [score, setScore] = useState(0)

  // 타이머 & 제출
  const handleSubmit = useCallback(() => {
    let correct = 0
    questions.forEach((q, idx) => {
      const myAnswer = answers[idx]
      if (myAnswer === undefined) return
      if (q.type === 'MULTIPLE_CHOICE') {
        if (Number(myAnswer) === Number(q.answer)) correct++
      } else {
        if (String(myAnswer).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) correct++
      }
    })
    setScore(correct)
    setPhase('result')
    aiApi.submitGradeQuiz({ grade, subject, score: correct, totalQuestions: questions.length }).catch(() => {})
  }, [questions, answers, grade, subject])

  useEffect(() => {
    if (phase !== 'quiz' || remainingSeconds <= 0) return
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) { handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, remainingSeconds, handleSubmit])

  // 퀴즈 생성
  const handleGenerate = () => {
    if (!grade) { toast.error('학년을 선택해주세요'); return }
    setPhase('loading')
    setTimeout(() => {
      const pool = getQuestions(grade, subject, difficulty === 'all' ? undefined : difficulty)
      if (pool.length === 0) {
        toast.error('해당 조건의 문제가 없습니다')
        setPhase('setup')
        return
      }
      const selected = shuffle(pool).slice(0, Math.min(questionCount, pool.length))
        .map((q, i) => ({ ...q, number: i + 1 }))
      setQuestions(selected)
      setAnswers({})
      setRemainingSeconds(selected.length * (difficulty === 'hard' ? 180 : 120))
      setPhase('quiz')
      toast.success(`${selected.length}문제가 생성되었습니다!`)
    }, 1500)
  }

  const handleReset = () => { setQuestions([]); setAnswers({}); setScore(0); setPhase('setup') }
  const formatTime = (sec: number) => `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`
  const answeredCount = Object.keys(answers).length
  const percent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // ====== 설정 화면 ======
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">AI 학년별 퀴즈</h1>
          <p className="text-sm text-gray-500 mt-1">학년, 과목, 난이도를 선택하면 맞춤 퀴즈를 만들어줍니다</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* 학년 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">학년 선택</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm ${!grade ? 'text-gray-400' : 'text-gray-900'}`}>
              <option value="">학년을 선택하세요</option>
              {GRADE_OPTIONS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((item) => (
                    <option key={item.value} value={item.value}>{g.group} {item.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 과목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">과목</label>
            <div className="flex gap-3">
              {SUBJECTS.map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition border ${
                    subject === s
                      ? s === '국어' ? 'bg-red-50 text-red-600 border-red-300'
                        : s === '영어' ? 'bg-green-50 text-green-600 border-green-300'
                        : s === '코딩' ? 'bg-purple-50 text-purple-600 border-purple-300'
                        : 'bg-blue-50 text-blue-600 border-blue-300'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {/* 난이도 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">난이도</label>
            <div className="grid grid-cols-4 gap-2">
              {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition border ${
                    difficulty === d
                      ? d === 'easy' ? 'bg-green-50 text-green-600 border-green-300'
                        : d === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-300'
                        : d === 'hard' ? 'bg-red-50 text-red-600 border-red-300'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-300'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {d === 'all' ? '전체' : d === 'easy' ? '기본' : d === 'medium' ? '보통' : '심화'}
                </button>
              ))}
            </div>
          </div>

          {/* 문제 수 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              문제 수: <span className="text-primary-600">{questionCount}문제</span>
            </label>
            <input type="range" min={3} max={15} value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-primary-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3문제</span><span>15문제</span>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!grade}
            className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm">
            퀴즈 시작하기
          </button>
        </div>
      </div>
    )
  }

  // ====== 로딩 ======
  if (phase === 'loading') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">퀴즈를 만들고 있어요...</h2>
        <p className="text-gray-500 text-sm">
          {GRADE_LABEL[grade]} {subject}
          {difficulty !== 'all' && ` · ${DIFFICULTY_LABEL[difficulty]}`}
          {' · '}{questionCount}문제
        </p>
      </div>
    )
  }

  // ====== 결과 ======
  if (phase === 'result') {
    const emoji = percent >= 80 ? '🎉' : percent >= 60 ? '👏' : '💪'
    const message = percent >= 80 ? '훌륭합니다!' : percent >= 60 ? '잘 했어요!' : '다시 도전해보세요!'
    const color = percent >= 80 ? 'text-green-600' : percent >= 60 ? 'text-yellow-600' : 'text-red-500'

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{message}</h2>
          <p className="text-sm text-gray-500 mb-4">{GRADE_LABEL[grade]} {subject} 퀴즈 결과</p>
          <div className={`text-5xl font-extrabold ${color} mb-2`}>{percent}점</div>
          <p className="text-gray-500">{questions.length}문제 중 {score}문제 정답</p>
        </div>

        {/* 문제별 결과 */}
        <div className="space-y-4 mb-6">
          {questions.map((q, idx) => {
            const myAnswer = answers[idx]
            const isCorrect = q.type === 'MULTIPLE_CHOICE'
              ? Number(myAnswer) === Number(q.answer)
              : String(myAnswer || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()
            return (
              <div key={idx} className={`bg-white rounded-xl p-5 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-400'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                    {isCorrect ? 'O' : 'X'}
                  </span>
                  <div className="flex-1">
                    {/* 난이도 뱃지 */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[q.difficulty]}`}>
                        {DIFFICULTY_LABEL[q.difficulty]}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        q.type === 'MULTIPLE_CHOICE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>{q.type === 'MULTIPLE_CHOICE' ? '객관식' : '주관식'}</span>
                    </div>

                    {/* 독해 지문 */}
                    {q.passage && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-700 leading-relaxed italic">
                        {q.passage}
                      </div>
                    )}

                    <p className="font-medium text-gray-800 mb-2">Q{q.number}. {q.question}</p>
                    {q.type === 'MULTIPLE_CHOICE' && q.options && (
                      <div className="space-y-1 mb-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`text-sm px-3 py-1.5 rounded-lg ${
                            oi === Number(q.answer) ? 'bg-green-50 text-green-700 font-medium' :
                            oi === Number(myAnswer) && !isCorrect ? 'bg-red-50 text-red-600 line-through' : 'text-gray-500'
                          }`}>{String.fromCharCode(9312 + oi)} {opt}</div>
                        ))}
                      </div>
                    )}
                    {q.type === 'SHORT_ANSWER' && (
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">내 답: </span>
                        <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-500 line-through'}>{String(myAnswer || '미답변')}</span>
                        {!isCorrect && <span className="text-green-600 font-medium ml-2">정답: {String(q.answer)}</span>}
                      </div>
                    )}
                    <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg">💡 {q.explanation}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition text-sm">새 퀴즈 만들기</button>
          <button onClick={handleGenerate} className="flex-1 py-3 bg-white text-gray-700 border rounded-xl font-semibold hover:bg-gray-50 transition text-sm">같은 설정으로 다시</button>
        </div>
      </div>
    )
  }

  // ====== 퀴즈 풀기 ======
  return (
    <div className="max-w-2xl mx-auto">
      {/* 상단 바 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between sticky top-20 z-10">
        <div>
          <p className="text-sm font-semibold text-gray-800">{GRADE_LABEL[grade]} · {subject}</p>
          <p className="text-xs text-gray-400">{answeredCount}/{questions.length} 문제 응답 완료</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>
          <div className={`text-lg font-mono font-bold px-3 py-1 rounded-lg ${
            remainingSeconds <= 60 ? 'bg-red-100 text-red-600 animate-pulse' :
            remainingSeconds <= 300 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
          }`}>{formatTime(remainingSeconds)}</div>
        </div>
      </div>

      {/* 문제 목록 */}
      <div className="space-y-4 mb-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                answers[idx] !== undefined ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
              }`}>{q.number}</span>
              <div className="flex-1">
                {/* 뱃지 */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[q.difficulty]}`}>
                    {DIFFICULTY_LABEL[q.difficulty]}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    q.type === 'MULTIPLE_CHOICE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>{q.type === 'MULTIPLE_CHOICE' ? '객관식' : '주관식'}</span>
                </div>

                {/* 독해 지문 */}
                {q.passage && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-700 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      지문 읽기
                    </div>
                    <p className="italic">{q.passage}</p>
                  </div>
                )}

                <p className="font-medium text-gray-800 mt-1">{q.question}</p>
              </div>
            </div>

            {/* 객관식 */}
            {q.type === 'MULTIPLE_CHOICE' && q.options && (
              <div className="space-y-2 ml-11">
                {q.options.map((opt, oi) => (
                  <label key={oi} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition border ${
                    Number(answers[idx]) === oi ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'
                  }`}>
                    <input type="radio" name={`q-${idx}`} checked={Number(answers[idx]) === oi}
                      onChange={() => setAnswers({ ...answers, [idx]: oi })} className="accent-primary-600" />
                    <span className="text-sm">{String.fromCharCode(9312 + oi)} {opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* 주관식 */}
            {q.type === 'SHORT_ANSWER' && (
              <div className="ml-11">
                <input type="text" placeholder="답을 입력하세요" value={String(answers[idx] || '')}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit}
        className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition text-sm">
        제출하기 ({answeredCount}/{questions.length} 응답 완료)
      </button>
    </div>
  )
}
