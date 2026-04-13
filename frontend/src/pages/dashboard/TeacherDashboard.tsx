/**
 * TeacherDashboard - 교강사 대시보드
 * 내 강의 수, 수강생 수, AI 생성 횟수, 이번 주 활동 등 통계를 표시하고
 * 빠른 시작(새 강의/자료 생성/퀴즈 출제) 바로가기를 제공한다.
 */
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function TeacherDashboard() {
  const userName = useAuthStore((s) => s.user?.name) ?? '선생님'

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.teacher()
      return res.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-44 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">연결할 수 없습니다</h3>
        <p className="text-sm text-gray-500 mb-4">서버 상태를 확인해주세요</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
          다시 시도
        </button>
      </div>
    )
  }

  const genCount = Number(data?.timeSaved?.generationCount ?? 0)

  // 이번 주 활동 횟수 계산
  const weeklyActivity = (() => {
    if (!data?.recentActivities) return 0
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    return data.recentActivities.filter(
      (a) => new Date(a.createdAt) >= startOfWeek
    ).length
  })()

  return (
    <div className="space-y-5">

      {/* ====== 히어로 배너 + 인라인 통계 ====== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 p-6">
        {/* 배경 장식 */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-4 right-6 opacity-[0.04]">
          <svg className="w-32 h-32 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        </div>

        {/* 상단 인사 */}
        <div className="relative flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">
              {userName}님, 안녕하세요
            </h1>
            <p className="text-indigo-300/80 text-sm mt-0.5">오늘도 효율적인 수업을 준비해보세요</p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur text-white text-sm px-3.5 py-2 rounded-lg hover:bg-white/20 transition border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            강의 관리
          </Link>
        </div>

        {/* 통계 인라인 4칸 */}
        <div className="relative grid grid-cols-4 gap-3">
          <StatPill
            label="내 강의"
            value={String(data?.totalCourses ?? 0)}
            unit="개"
            accent="from-blue-500 to-cyan-400"
          />
          <StatPill
            label="수강생"
            value={String(data?.totalStudents ?? 0)}
            unit="명"
            accent="from-emerald-500 to-teal-400"
          />
          <StatPill
            label="AI 생성"
            value={String(genCount)}
            unit="회"
            accent="from-violet-500 to-purple-400"
          />
          <StatPill
            label="이번 주 활동"
            value={String(weeklyActivity)}
            unit="회"
            accent="from-amber-500 to-orange-400"
          />
        </div>
      </div>

      {/* ====== 빠른 시작 ====== */}
      <div className="grid grid-cols-3 gap-3">
        <QuickLink
          to="/courses"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          title="새 강의"
          desc="커리큘럼 설계"
          gradient="from-indigo-500 to-blue-500"
        />
        <QuickLink
          to="/courses"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="AI 자료 생성"
          desc="강의 자료 자동 생성"
          gradient="from-cyan-500 to-teal-500"
        />
        <QuickLink
          to="/courses"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="AI 퀴즈 출제"
          desc="퀴즈 자동 생성"
          gradient="from-violet-500 to-purple-500"
        />
      </div>

      {/* ====== 팁 배너 ====== */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl px-5 py-3">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm text-indigo-700/80">
          <span className="font-medium text-indigo-800">Tip.</span> 강의 상세에서 <span className="font-medium">AI 커리큘럼 생성</span>을 클릭하면 주차별 강의 자료와 퀴즈가 한 번에 만들어집니다.
        </p>
      </div>
    </div>
  )
}

/** StatPill — 히어로 배너 안의 컴팩트 통계 칸 */
function StatPill({
  label,
  value,
  unit,
  accent,
  isText,
}: {
  label: string
  value: string
  unit?: string
  accent: string
  isText?: boolean
}) {
  return (
    <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-3 border border-white/[0.08]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
        <span className="text-[11px] font-medium text-indigo-200/70 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-white font-bold text-lg leading-none">
        {isText ? (
          <span className="text-base">{value}</span>
        ) : (
          <>
            {value}
            {unit && <span className="text-xs font-medium text-indigo-300/60 ml-0.5">{unit}</span>}
          </>
        )}
      </div>
    </div>
  )
}

/** QuickLink — 빠른 시작 카드 */
function QuickLink({
  to,
  icon,
  title,
  desc,
  gradient,
}: {
  to: string
  icon: React.ReactNode
  title: string
  desc: string
  gradient: string
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200"
    >
      {/* 호버 시 그라디언트 배경 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-200`} />
      <div className="relative flex items-center gap-3">
        <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-800 truncate">{title}</div>
          <div className="text-xs text-gray-400 truncate">{desc}</div>
        </div>
        <svg className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-gray-400 ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
