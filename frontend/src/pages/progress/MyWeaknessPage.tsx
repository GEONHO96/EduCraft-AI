/**
 * MyWeaknessPage — 내 AI 약점 분석 이력
 *
 * 학생이 풀어본 모든 퀴즈의 약점 분석 리포트를 최근순으로 나열.
 * 각 카드는 취약 개념 태그와 AI가 생성한 학습 권장사항을 표시한다.
 *
 * Feature B의 핵심 차별 기능 — Claude API가 틀린 문항을 분석해
 * 학생의 취약 개념과 구체적 학습 제안을 제공.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { weaknessApi, type WeaknessReportInfo } from '../../api/weakness'

function formatDate(iso: string | null) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch { return iso }
}

export default function MyWeaknessPage() {
  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ['weakness', 'me'],
    queryFn: async () => {
      const res = await weaknessApi.getMyReports()
      if (!res.data.success) throw new Error(res.data.error?.message || '약점 분석 이력을 불러올 수 없습니다')
      return res.data.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm">분석 이력을 불러오는 중...</div>
  }
  if (isError) {
    return <div className="text-center py-16 text-rose-500 text-sm">분석 이력을 불러오지 못했습니다.</div>
  }

  const completed = reports?.filter(r => r.analysisStatus === 'COMPLETED') ?? []
  const pending = reports?.filter(r => r.analysisStatus === 'PENDING').length ?? 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">🎯 AI 약점 분석</h1>
        <p className="text-sm text-gray-500 mt-1">
          퀴즈에서 틀린 문제를 Claude AI가 분석해 취약 개념과 학습 방법을 제안합니다
        </p>
      </div>

      {pending > 0 && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-700">
          🤖 현재 {pending}건의 분석이 진행 중입니다. 잠시 후 새로고침해보세요.
        </div>
      )}

      {completed.length > 0 ? (
        <div className="space-y-4">
          {completed.map((r) => <ReportCard key={r.id} r={r} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-6xl mb-3">📝</p>
          <p className="text-sm text-gray-500 mb-2">아직 분석된 리포트가 없습니다</p>
          <p className="text-xs text-gray-400">퀴즈에서 오답을 낸 경우 자동으로 AI가 약점을 분석해드립니다.</p>
          <Link to="/courses" className="inline-block mt-4 text-sm text-indigo-600 underline">
            강의 보러가기
          </Link>
        </div>
      )}
    </div>
  )
}

function ReportCard({ r }: { r: WeaknessReportInfo }) {
  return (
    <div className="p-5 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400">
            제출 #{r.quizSubmissionId} · 틀린 문제 {r.incorrectQuestionCount}개
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(r.generatedAt)}</p>
        </div>
      </div>

      {/* 취약 개념 태그 */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-1.5">Weak Concepts</p>
        <div className="flex flex-wrap gap-1.5">
          {r.weakConcepts.map((concept, i) => (
            <span key={i} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* 학습 권장사항 */}
      {r.recommendations && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 mb-1.5">
            Recommendations
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{r.recommendations}</p>
        </div>
      )}
    </div>
  )
}
