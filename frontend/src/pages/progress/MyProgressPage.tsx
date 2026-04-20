/**
 * MyProgressPage — 내 학습 진도 대시보드
 *
 * 학생 본인이 수강 중인 모든 강의의 진도율, 완료 자료 수, 마지막 활동일,
 * 수료 여부를 한눈에 보여주는 페이지.
 * 각 강의 행을 클릭하면 `CourseProgressDetailPage`로 이동해 자료별 체크박스를 쓸 수 있다.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { progressApi, type ProgressSummary } from '../../api/progress'

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return iso
  }
}

export default function MyProgressPage() {
  const { data: progressList, isLoading, isError } = useQuery({
    queryKey: ['progress', 'me'],
    queryFn: async () => {
      const res = await progressApi.getMyProgressList()
      if (!res.data.success) throw new Error(res.data.error?.message || '진도 정보를 불러올 수 없습니다')
      return res.data.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm">진도 정보를 불러오는 중...</div>
  }
  if (isError) {
    return <div className="text-center py-16 text-rose-500 text-sm">진도 정보를 불러오지 못했습니다.</div>
  }

  const completedCount = progressList?.filter(p => p.completed).length ?? 0
  const inProgressCount = (progressList?.length ?? 0) - completedCount

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">내 학습 진도</h1>
        <p className="text-sm text-gray-500 mt-1">수강 중인 강의별 진도를 확인하고 자료 완료를 체크하세요</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="수강 중" value={inProgressCount} color="indigo" />
        <SummaryCard label="수료 완료" value={completedCount} color="emerald" />
        <SummaryCard label="전체" value={progressList?.length ?? 0} color="violet" />
      </div>

      {/* 강의별 진도 목록 */}
      {progressList && progressList.length > 0 ? (
        <div className="space-y-3">
          {progressList.map((p) => <ProgressRow key={p.courseId} p={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl text-sm text-gray-400">
          아직 수강 중인 강의가 없습니다. <Link to="/courses/browse" className="text-indigo-600 underline">강의 탐색</Link>으로 이동해보세요.
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: 'indigo' | 'emerald' | 'violet' }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
  }
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} text-white rounded-xl p-4`}>
      <p className="text-xs font-medium opacity-90">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function ProgressRow({ p }: { p: ProgressSummary }) {
  const rate = Math.round(p.progressRate * 10) / 10
  const barColor = p.completed ? 'bg-emerald-500' : rate >= 50 ? 'bg-indigo-500' : 'bg-amber-500'

  return (
    <Link
      to={`/progress/courses/${p.courseId}`}
      className="block p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{p.courseTitle}</h3>
            {p.completed && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">수료</span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {p.subject} · 자료 {p.completedMaterialCount}/{p.totalMaterialCount} · 최근 활동 {formatDate(p.lastActivityAt)}
          </p>

          {/* 진도율 바 */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-gray-500">진도율</span>
              <span className="text-xs font-bold text-gray-900">{rate}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${barColor} transition-all`} style={{ width: `${Math.min(100, rate)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
