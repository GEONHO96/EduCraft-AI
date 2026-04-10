import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { aiApi, CurriculumResult } from '../../api/ai'
import toast from 'react-hot-toast'

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
          </div>
          <div className="space-y-4">
            {result.weeks.map((week) => (
              <div key={week.weekNumber} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                    {week.weekNumber}주차
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{week.topic}</h3>
                <p className="text-sm text-gray-600 mt-1">{week.objectives}</p>
                <p className="text-sm text-gray-500 mt-2">{week.content}</p>
              </div>
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
