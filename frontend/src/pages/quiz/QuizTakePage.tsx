import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../../api/client'
import toast from 'react-hot-toast'

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
  answer?: any
  explanation?: string
}

export default function QuizTakePage() {
  const { quizId } = useParams<{ quizId: string }>()
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<any>(null)

  const { data: quiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: QuizInfo }>(`/quizzes/${quizId}`)
      return res.data.data
    },
  })

  const submitMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/quizzes/${quizId}/submit`, {
        answersJson: JSON.stringify(Object.values(answers)),
      }),
    onSuccess: (res: any) => {
      if (res.data.success) {
        setResult(res.data.data)
        setSubmitted(true)
        toast.success('퀴즈를 제출했습니다!')
      }
    },
    onError: () => toast.error('제출에 실패했습니다.'),
  })

  if (!quiz) return <div className="text-center py-12 text-gray-500">로딩 중...</div>

  let questions: Question[] = []
  try {
    const parsed = JSON.parse(quiz.questionsJson)
    questions = parsed.questions || []
  } catch {
    return <div>퀴즈 데이터를 불러올 수 없습니다.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">퀴즈 풀기</h1>

      {submitted && result && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="font-semibold text-blue-800">
            결과: {result.score}/{result.totalQuestions}문제 정답 (
            {Math.round((result.score / result.totalQuestions) * 100)}%)
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <p className="font-medium text-gray-800 mb-3">
              Q{q.number}. {q.question}
            </p>
            {q.type === 'MULTIPLE_CHOICE' && q.options ? (
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`flex items-center p-3 rounded-lg cursor-pointer border transition ${
                      answers[i] === j
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${submitted ? 'pointer-events-none' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      checked={answers[i] === j}
                      onChange={() => setAnswers({ ...answers, [i]: j })}
                      disabled={submitted}
                      className="mr-3"
                    />
                    <span>{opt}</span>
                    {submitted && j === q.answer && (
                      <span className="ml-auto text-green-600 text-sm font-medium">정답</span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[i] || ''}
                onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                disabled={submitted}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="답을 입력하세요"
              />
            )}
            {submitted && q.explanation && (
              <div className="mt-3 bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                해설: {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="mt-6">
          <button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition text-lg font-medium"
          >
            {submitMutation.isPending ? '제출 중...' : '퀴즈 제출하기'}
          </button>
        </div>
      )}
    </div>
  )
}
