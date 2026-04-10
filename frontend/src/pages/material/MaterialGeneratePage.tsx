import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { aiApi, MaterialResult } from '../../api/ai'
import toast from 'react-hot-toast'

export default function MaterialGeneratePage() {
  const { curriculumId } = useParams<{ curriculumId: string }>()

  const [type, setType] = useState('LECTURE')
  const [difficulty, setDifficulty] = useState(3)
  const [additionalReq, setAdditionalReq] = useState('')
  const [result, setResult] = useState<MaterialResult | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      aiApi.generateMaterial({
        curriculumId: Number(curriculumId),
        type,
        difficulty,
        additionalRequirements: additionalReq || undefined,
      }),
    onSuccess: (res) => {
      if (res.data.success) {
        setResult(res.data.data)
        const minutes = Math.round(res.data.data.timeSavedSeconds / 60)
        toast.success(`자료 생성 완료! 약 ${minutes}분 절약했습니다.`)
      }
    },
    onError: () => toast.error('자료 생성에 실패했습니다.'),
  })

  const renderContent = () => {
    if (!result) return null
    try {
      const content = JSON.parse(result.contentJson)
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{content.title}</h2>
          {content.sections?.map((section: any, i: number) => (
            <div key={i} className="border-l-4 border-primary-400 pl-4">
              <h3 className="font-semibold text-lg">{section.heading}</h3>
              <p className="text-gray-600 mt-2 whitespace-pre-wrap">{section.content}</p>
              {section.keyPoints && (
                <ul className="mt-2 space-y-1">
                  {section.keyPoints.map((point: string, j: number) => (
                    <li key={j} className="text-sm text-primary-700 flex items-start">
                      <span className="mr-2">*</span>{point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {content.summary && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">요약</h3>
              <p className="text-gray-600">{content.summary}</p>
            </div>
          )}
        </div>
      )
    } catch {
      return <pre className="text-sm whitespace-pre-wrap">{result.contentJson}</pre>
    }
  }

  return (
    <div>
      <Link to={`/courses`} className="text-primary-600 hover:underline text-sm">
        &larr; 돌아가기
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">AI 수업 자료 생성</h1>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">자료 유형</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="LECTURE">강의 자료</option>
                  <option value="EXERCISE">실습 자료</option>
                </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">추가 요구사항 (선택)</label>
              <textarea
                value={additionalReq}
                onChange={(e) => setAdditionalReq(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-lg font-medium"
            >
              {mutation.isPending ? 'AI가 자료를 생성하고 있습니다...' : 'AI 자료 생성하기'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-green-800">
              자료가 생성되었습니다! (약 {Math.round(result.timeSavedSeconds / 60)}분 절약)
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderContent()}
          </div>
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
