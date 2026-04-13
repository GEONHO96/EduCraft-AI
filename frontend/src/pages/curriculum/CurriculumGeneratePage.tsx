import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { aiApi, CurriculumResult, WeekPlan } from '../../api/ai'
import toast from 'react-hot-toast'

interface MaterialSection {
  heading: string
  content: string
  keyPoints: string[]
}

interface ParsedMaterial {
  title: string
  sections: MaterialSection[]
  summary: string
}

interface QuizQuestion {
  number: number
  type: string
  question: string
  options: string[]
  answer: number | string
  explanation: string
}

function WeekCard({ week }: { week: WeekPlan }) {
  const [expanded, setExpanded] = useState(false)

  const material: ParsedMaterial | null = useMemo(() => {
    try {
      return week.materialContentJson ? JSON.parse(week.materialContentJson) : null
    } catch {
      return null
    }
  }, [week.materialContentJson])

  const quizQuestions: QuizQuestion[] = useMemo(() => {
    try {
      if (!week.quizQuestionsJson) return []
      const parsed = JSON.parse(week.quizQuestionsJson)
      return parsed.questions || []
    } catch {
      return []
    }
  }, [week.quizQuestionsJson])

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 클릭 가능한 헤더 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition flex items-start justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
              {week.weekNumber}주차
            </span>
            {material && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                강의 자료
              </span>
            )}
            {quizQuestions.length > 0 && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                퀴즈 {quizQuestions.length}문제
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold">{week.topic}</h3>
          <p className="text-sm text-gray-600 mt-1">{week.objectives}</p>
        </div>
        <span className={`text-gray-400 text-xl ml-4 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* 펼쳐지는 상세 영역 */}
      {expanded && (
        <div className="border-t px-6 pb-6">
          {/* 주차 개요 */}
          <div className="mt-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">주차 개요</h4>
            <p className="text-sm text-gray-500">{week.content}</p>
          </div>

          {/* 강의 자료 섹션 */}
          {material && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                <span className="mr-2">📘</span> 강의 자료: {material.title}
              </h4>
              <div className="space-y-4">
                {material.sections.map((section, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">{section.heading}</h5>
                    <p className="text-sm text-gray-600 mb-3">{section.content}</p>
                    {section.keyPoints && section.keyPoints.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-blue-600">핵심 포인트</span>
                        <ul className="mt-1 space-y-1">
                          {section.keyPoints.map((point, pIdx) => (
                            <li key={pIdx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {material.summary && (
                <div className="mt-3 bg-blue-100 rounded-lg p-3">
                  <span className="text-xs font-medium text-blue-700">요약: </span>
                  <span className="text-sm text-blue-800">{material.summary}</span>
                </div>
              )}
            </div>
          )}

          {/* 퀴즈 섹션 */}
          {quizQuestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                <span className="mr-2">📝</span> 확인 퀴즈 ({quizQuestions.length}문제)
              </h4>
              <div className="space-y-3">
                {quizQuestions.map((q) => (
                  <div key={q.number} className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-2">
                      <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Q{q.number}
                      </span>
                      <span className="text-xs text-gray-400">
                        {q.type === 'MULTIPLE_CHOICE' ? '객관식' : '주관식'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">{q.question}</p>
                    {q.type === 'MULTIPLE_CHOICE' && q.options && (
                      <div className="space-y-1 mb-2">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`text-sm px-3 py-1.5 rounded ${
                              oIdx === q.answer
                                ? 'bg-green-200 text-green-800 font-medium'
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            {oIdx + 1}. {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'SHORT_ANSWER' && (
                      <div className="text-sm bg-green-200 text-green-800 px-3 py-1.5 rounded mb-2">
                        정답: {String(q.answer)}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">해설:</span> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CurriculumGeneratePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [totalWeeks, setTotalWeeks] = useState(8)
  const [targetLevel, setTargetLevel] = useState('중급')
  const [additionalReq, setAdditionalReq] = useState('')
  const [result, setResult] = useState<CurriculumResult | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      aiApi.generateCurriculum({
        courseId: Number(courseId),
        subject,
        topic,
        totalWeeks,
        targetLevel,
        additionalRequirements: additionalReq || undefined,
      }),
    onSuccess: (res) => {
      if (res.data.success) {
        setResult(res.data.data)
        const minutes = Math.round(res.data.data.timeSavedSeconds / 60)
        toast.success(`커리큘럼 생성 완료! 약 ${minutes}분 절약했습니다.`)
      }
    },
    onError: () => toast.error('커리큘럼 생성에 실패했습니다.'),
  })

  return (
    <div>
      <Link to={`/courses/${courseId}`} className="text-primary-600 hover:underline text-sm">
        &larr; 강의로 돌아가기
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">AI 커리큘럼 생성</h1>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="예: 컴퓨터공학, 수학, 영어"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주제</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="예: 자바 프로그래밍 기초"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">총 주차 수</label>
                <input
                  type="number"
                  value={totalWeeks}
                  onChange={(e) => setTotalWeeks(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대상 수준</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="입문">입문</option>
                  <option value="초급">초급</option>
                  <option value="중급">중급</option>
                  <option value="고급">고급</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">추가 요구사항 (선택)</label>
              <textarea
                value={additionalReq}
                onChange={(e) => setAdditionalReq(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                rows={3}
                placeholder="특별히 포함하고 싶은 내용이나 요구사항을 입력하세요"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition text-lg font-medium"
            >
              {mutation.isPending ? 'AI가 커리큘럼을 생성하고 있습니다...' : 'AI 커리큘럼 생성하기'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-green-800">
              커리큘럼이 생성되었습니다! (약 {Math.round(result.timeSavedSeconds / 60)}분 절약)
            </div>
            <p className="text-sm text-green-600 mt-1">
              각 주차를 클릭하면 강의 자료와 퀴즈를 확인할 수 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {result.weeks.map((week) => (
              <WeekCard key={week.weekNumber} week={week} />
            ))}
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              강의로 돌아가기
            </button>
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
