/**
 * QuizTakePage - 퀴즈 풀기 페이지
 * 퀴즈 데이터를 불러와 객관식/주관식 문제를 표시하고,
 * 타이머(제한 시간), 진행률 바, 자동 제출, 채점 결과 + 해설을 제공한다.
 */
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../../api/client'
import toast from 'react-hot-toast'

// ====== 타입 정의 ======
interface QuizInfo {
  id: number
  materialId: number
  questionsJson: string
  timeLimit: number
}

interface Question {
  number: number
  type: string
  question: string
  options?: string[]
  answer?: number
  explanation?: string
}

export default function QuizTakePage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; totalQuestions: number } | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)

  // 퀴즈 데이터 조회
  const { data: quiz, isLoading, isError } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: QuizInfo }>(`/quizzes/${quizId}`)
      return res.data.data
    },
  })

  // 타이머 초기화
  useEffect(() => {
    if (quiz?.timeLimit && quiz.timeLimit > 0 && !submitted) {
      setRemainingSeconds(quiz.timeLimit)
    }
  }, [quiz?.timeLimit, submitted])

  // 타이머 카운트다운
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0 || submitted) return
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [remainingSeconds, submitted])

  // 퀴즈 답안 제출 뮤테이션
  const submitMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/quizzes/${quizId}/submit`, {
        answersJson: JSON.stringify(Object.values(answers)),
      }),
    onSuccess: (res: { data: { success: boolean; data: { score: number; totalQuestions: number } } }) => {
      if (res.data.success) {
        setResult(res.data.data)
        setSubmitted(true)
        toast.success('퀴즈를 제출했습니다!')
      }
    },
    onError: () => toast.error('제출에 실패했습니다.'),
  })

  // 타이머 만료 시 자동 제출 처리
  const handleAutoSubmit = useCallback(() => {
    if (!submitted && !submitMutation.isPending) {
      toast('시간이 초과되어 자동 제출됩니다.', { icon: '⏰' })
      submitMutation.mutate()
    }
  }, [submitted, submitMutation])

  useEffect(() => {
    if (remainingSeconds === 0) handleAutoSubmit()
  }, [remainingSeconds, handleAutoSubmit])

  // 초를 MM:SS 포맷으로 변환
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">퀴즈를 불러오는 중...</p>
      </div>
    )
  }

  if (isError || !quiz) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">퀴즈를 불러올 수 없습니다</h3>
        <p className="text-sm text-gray-500 mb-4">퀴즈가 존재하지 않거나 권한이 없습니다</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm">
          돌아가기
        </button>
      </div>
    )
  }

  let questions: Question[] = []
  try {
    const parsed = JSON.parse(quiz.questionsJson)
    questions = parsed.questions || []
  } catch {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">퀴즈 데이터 형식이 올바르지 않습니다.</p>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const totalCount = questions.length
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0

  return (
    <div>
      {/* 상단 헤더 - 타이머 & 진행률 */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b py-3 px-4 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">퀴즈 풀기</h1>
            <span className="text-sm text-gray-500">{answeredCount}/{totalCount} 문제 응답 완료</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* 진행률 바 */}
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">{progressPercent}%</span>
            </div>

            {/* 타이머 */}
            {remainingSeconds !== null && !submitted && (
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold ${
                remainingSeconds <= 60
                  ? 'bg-red-100 text-red-700 animate-pulse'
                  : remainingSeconds <= 300
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(remainingSeconds)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 결과 배너 */}
      {submitted && result && (
        <div className={`rounded-xl p-5 mb-6 ${
          result.score / result.totalQuestions >= 0.8
            ? 'bg-green-50 border border-green-200'
            : result.score / result.totalQuestions >= 0.6
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">
                {result.score / result.totalQuestions >= 0.8 ? '훌륭합니다!' : result.score / result.totalQuestions >= 0.6 ? '잘 했어요!' : '다시 도전해보세요!'}
              </div>
              <div className="text-sm mt-1 opacity-80">
                {result.totalQuestions}문제 중 {result.score}문제 정답
              </div>
            </div>
            <div className="text-3xl font-bold">
              {Math.round((result.score / result.totalQuestions) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* 문제 목록 */}
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                submitted
                  ? answers[i] === q.answer
                    ? 'bg-green-100 text-green-700'
                    : answers[i] !== undefined
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-500'
                  : answers[i] !== undefined
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {q.number}
              </span>
              <p className="font-medium text-gray-800 pt-1">{q.question}</p>
            </div>

            {q.type === 'MULTIPLE_CHOICE' && q.options ? (
              <div className="space-y-2 ml-11">
                {q.options.map((opt, j) => {
                  const isSelected = answers[i] === j
                  const isCorrect = j === q.answer
                  let optStyle = 'border-gray-200 hover:bg-gray-50'
                  if (submitted) {
                    if (isCorrect) optStyle = 'border-green-400 bg-green-50'
                    else if (isSelected && !isCorrect) optStyle = 'border-red-400 bg-red-50'
                    else optStyle = 'border-gray-200 opacity-60'
                  } else if (isSelected) {
                    optStyle = 'border-primary-500 bg-primary-50'
                  }

                  return (
                    <label
                      key={j}
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition ${optStyle} ${submitted ? 'pointer-events-none' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        checked={isSelected}
                        onChange={() => setAnswers({ ...answers, [i]: j })}
                        disabled={submitted}
                        className="sr-only"
                      />
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        submitted
                          ? isCorrect
                            ? 'border-green-500 bg-green-500'
                            : isSelected
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-300'
                          : isSelected
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                      }`}>
                        {((submitted && isCorrect) || (!submitted && isSelected)) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm">{opt}</span>
                      {submitted && isCorrect && (
                        <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">정답</span>
                      )}
                    </label>
                  )
                })}
              </div>
            ) : (
              <div className="ml-11">
                <input
                  type="text"
                  value={answers[i] || ''}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                  disabled={submitted}
                  className="w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="답을 입력하세요"
                />
              </div>
            )}

            {submitted && q.explanation && (
              <div className="mt-4 ml-11 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-xs font-semibold text-blue-700">해설</span>
                    <p className="text-sm text-blue-800 mt-0.5">{q.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 제출 버튼 */}
      {!submitted && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {answeredCount < totalCount
                ? `${totalCount - answeredCount}문제가 아직 미응답입니다`
                : '모든 문제에 응답했습니다'}
            </span>
            <button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition text-sm font-medium"
            >
              {submitMutation.isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>제출 중...</span>
                </>
              ) : (
                <span>퀴즈 제출하기</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 제출 후 하단 */}
      {submitted && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            돌아가기
          </button>
        </div>
      )}
    </div>
  )
}
