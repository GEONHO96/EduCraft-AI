import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { aiApi, QuizResult } from '../../api/ai'
import toast from 'react-hot-toast'

export default function QuizGeneratePage() {
  const { curriculumId } = useParams<{ curriculumId: string }>()

  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState(3)
  const [questionTypes, setQuestionTypes] = useState('객관식 위주')
  const [additionalReq, setAdditionalReq] = useState('')
  const [result, setResult] = useState<QuizResult | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      aiApi.generateQuiz({
        curriculumId: Number(curriculumId),
        questionCount,
        difficulty,
        questionTypes,
        additionalRequirements: additionalReq || undefined,
      }),
    onSuccess: (res) => {
      if (res.data.success) {
        setResult(res.data.data)
        const minutes = Math.round(res.data.data.timeSavedSeconds / 60)
        toast.success(`퀴즈 생성 완료! 약 ${minutes}분 절약했습니다.`)
      }
    },
    onError: () => toast.error('퀴즈 생성에 실패했습니다.'),
  })

  const renderQuiz = () => {
    if (!result) return null
    try {
      const data = JSON.parse(result.questionsJson)
      return (
        <div className="space-y-6">
          {data.questions?.map((q: any, i: number) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                  Q{q.number}
                </span>
                <span className="text-xs text-gray-400">
                  {q.type === 'MULTIPLE_CHOICE' ? '객관식' : '주관식'}
                </span>
              </div>
              <p className="font-medium text-gray-800 mb-3">{q.question}</p>
              {q.options && (
                <div className="space-y-2 mb-3">
                  {q.options.map((opt: string, j: number) => (
                    <div
                      key={j}
                      className={`p-2 rounded-lg text-sm ${
                        j === q.answer
                          ? 'bg-green-50 border border-green-300 text-green-800'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {j + 1}. {opt} {j === q.answer && ' (정답)'}
                    </div>
                  ))}
                </div>
              )}
              {q.explanation && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  해설: {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    } catch {
      return <pre className="text-sm whitespace-pre-wrap">{result.questionsJson}</pre>
    }
  }

  return (
    <div>
      <Link to="/courses" className="text-primary-600 hover:underline text-sm">
        &larr; 돌아가기
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">AI 퀴즈 출제</h1>

      {!result ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문제 수</label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">난이도 (1-5)</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-center text-sm text-gray-500">{difficulty}/5</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">문제 유형</label>
              <select
                value={questionTypes}
                onChange={(e) => setQuestionTypes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="객관식 위주">객관식 위주</option>
                <option value="주관식 위주">주관식 위주</option>
                <option value="객관식/주관식 혼합">객관식/주관식 혼합</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">추가 요구사항 (선택)</label>
              <textarea
                value={additionalReq}
                onChange={(e) => setAdditionalReq(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-lg font-medium"
            >
              {mutation.isPending ? 'AI가 퀴즈를 생성하고 있습니다...' : 'AI 퀴즈 생성하기'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-green-800">
              퀴즈가 생성되었습니다! {result.questionCount}문제 (약{' '}
              {Math.round(result.timeSavedSeconds / 60)}분 절약)
            </div>
          </div>
          {renderQuiz()}
          <div className="mt-6">
            <button
              onClick={() => setResult(null)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              다시 생성하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
