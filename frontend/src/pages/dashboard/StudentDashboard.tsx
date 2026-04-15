/**
 * StudentDashboard - 학생 대시보드
 * 수강 중인 강의 수, 완료한 퀴즈 수, 평균 점수 등 학습 현황을 표시하고
 * 최근 퀴즈 결과를 점수 바 차트로 보여준다.
 */
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { gradeLabel } from '../../constants/grades'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import ErrorCard from '../../components/ErrorCard'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.student()
      if (!res.data.success) throw new Error(res.data.error?.message || '데이터를 불러올 수 없습니다')
      return res.data.data
    },
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorCard onRetry={refetch} description={error?.message} />

  const scorePercent = data?.averageScore ?? 0
  const scoreColor = useMemo(() =>
    scorePercent >= 80 ? 'from-emerald-500 to-teal-400' : scorePercent >= 60 ? 'from-amber-500 to-yellow-400' : 'from-red-500 to-rose-400'
  , [scorePercent])

  return (
    <div className="space-y-5">

      {/* ====== 히어로 배너 + 인라인 통계 ====== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 p-6">
        {/* 배경 장식 */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-4 right-6 opacity-[0.04]">
          <svg className="w-32 h-32 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>

        {/* 상단 인사 */}
        <div className="relative flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">
              {user?.name ?? '학생'}님, 안녕하세요
            </h1>
            <p className="text-emerald-300/80 text-sm mt-0.5">
              {user?.grade ? (
                <><span className="font-medium text-emerald-200">{gradeLabel(user.grade)}</span> · 오늘도 함께 성장해요</>
              ) : '오늘도 함께 성장해요'}
            </p>
          </div>
          <Link
            to="/courses/browse"
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur text-white text-sm px-3.5 py-2 rounded-lg hover:bg-white/20 transition border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            강의 탐색
          </Link>
        </div>

        {/* 통계 인라인 3칸 */}
        <div className="relative grid grid-cols-3 gap-3">
          <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-3 border border-white/[0.08]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              <span className="text-[11px] font-medium text-emerald-200/70 uppercase tracking-wider">수강 강의</span>
            </div>
            <div className="text-white font-bold text-lg leading-none">
              {data?.enrolledCourses ?? 0}
              <span className="text-xs font-medium text-emerald-300/60 ml-0.5">개</span>
            </div>
          </div>
          <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-3 border border-white/[0.08]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
              <span className="text-[11px] font-medium text-emerald-200/70 uppercase tracking-wider">완료 퀴즈</span>
            </div>
            <div className="text-white font-bold text-lg leading-none">
              {data?.completedQuizzes ?? 0}
              <span className="text-xs font-medium text-emerald-300/60 ml-0.5">개</span>
            </div>
          </div>
          <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-3 border border-white/[0.08]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${scoreColor}`} />
              <span className="text-[11px] font-medium text-emerald-200/70 uppercase tracking-wider">평균 점수</span>
            </div>
            <div className="text-white font-bold text-lg leading-none">
              {data?.averageScore ?? 0}
              <span className="text-xs font-medium text-emerald-300/60 ml-0.5">점</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== 빠른 시작 ====== */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { to: '/courses/browse', title: '강의 탐색', desc: '새 강의 찾기', gradient: 'from-blue-500 to-cyan-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
          { to: '/courses', title: '내 강의', desc: '수강 중인 강의', gradient: 'from-indigo-500 to-violet-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
          { to: '/grade-quiz', title: 'AI 퀴즈', desc: '학년별 문제 풀기', gradient: 'from-amber-500 to-orange-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> },
          { to: '/recommend', title: '맞춤 추천', desc: '영상 강의 추천', gradient: 'from-rose-500 to-pink-500', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></> },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden bg-white border border-gray-100 rounded-xl p-3.5 hover:shadow-md transition-all duration-200"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-200`} />
            <div className="relative flex items-center gap-2.5">
              <div className={`w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">{item.title}</div>
                <div className="text-[11px] text-gray-400 truncate">{item.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ====== 최근 퀴즈 결과 ====== */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">최근 퀴즈 결과</h2>
        {data?.recentQuizResults && data.recentQuizResults.length > 0 ? (
          <div className="space-y-2.5">
            {data.recentQuizResults.map((result: { quizTitle: string; score: number; totalQuestions: number }, i: number) => {
              const percent = Math.round((result.score / result.totalQuestions) * 100)
              const barGradient = percent >= 80 ? 'from-emerald-500 to-teal-400' : percent >= 60 ? 'from-amber-500 to-yellow-400' : 'from-red-500 to-rose-400'
              return (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${barGradient} flex items-center justify-center text-white text-xs font-bold`}>
                    {percent}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{result.quizTitle}</div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 font-medium">
                    {result.score}/{result.totalQuestions}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">아직 완료한 퀴즈가 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">강의에 등록하고 퀴즈에 도전해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
