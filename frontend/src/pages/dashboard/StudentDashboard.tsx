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

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.student()
      return res.data.data
    },
  })

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl p-6 bg-gray-100 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg mb-3 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">대시보드를 불러올 수 없습니다</h3>
        <p className="text-sm text-gray-500 mb-4">서버와의 연결을 확인해주세요</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm">
          다시 시도
        </button>
      </div>
    )
  }

  const scorePercent = data?.averageScore ?? 0
  const scoreColor = useMemo(() =>
    scorePercent >= 80 ? 'text-green-600' : scorePercent >= 60 ? 'text-yellow-600' : 'text-red-500'
  , [scorePercent])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">학생 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.grade ? (
            <><span className="font-medium text-primary-600">{gradeLabel(user.grade)}</span> · 나의 학습 현황을 확인하세요</>
          ) : '나의 학습 현황을 확인하세요'}
        </p>
      </div>

      {/* ====== 학습 통계 카드 섹션 ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-700 opacity-80">수강 중인 강의</span>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700">{data?.enrolledCourses ?? 0}<span className="text-base font-medium ml-1">개</span></div>
        </div>
        <div className="bg-green-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-green-700 opacity-80">완료한 퀴즈</span>
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-700">{data?.completedQuizzes ?? 0}<span className="text-base font-medium ml-1">개</span></div>
        </div>
        <div className="bg-purple-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-purple-700 opacity-80">평균 점수</span>
            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className={`text-2xl font-bold ${scoreColor}`}>{data?.averageScore ?? 0}<span className="text-base font-medium ml-1">점</span></div>
        </div>
      </div>

      {/* ====== 최근 퀴즈 결과 섹션 ====== */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">최근 퀴즈 결과</h2>
        {data?.recentQuizResults && data.recentQuizResults.length > 0 ? (
          <div className="space-y-3">
            {data.recentQuizResults.map((result, i) => {
              const percent = Math.round((result.score / result.totalQuestions) * 100)
              const barColor = percent >= 80 ? 'bg-green-500' : percent >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              return (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{result.quizTitle}</span>
                    <span className="text-sm font-semibold">
                      {result.score}/{result.totalQuestions} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">아직 완료한 퀴즈가 없습니다</p>
            <p className="text-sm text-gray-400 mt-1">강의에 등록하고 퀴즈에 도전해보세요</p>
          </div>
        )}
      </div>

      {/* 바로가기 버튼 */}
      <div className="flex gap-3">
        <Link
          to="/courses/browse"
          className="inline-flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>강의 탐색하기</span>
        </Link>
        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 bg-white text-gray-700 border px-5 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>내 강의 보기</span>
        </Link>
        <Link
          to="/grade-quiz"
          className="inline-flex items-center space-x-2 bg-yellow-50 text-yellow-700 border border-yellow-200 px-5 py-2.5 rounded-lg hover:bg-yellow-100 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>AI 퀴즈 풀기</span>
        </Link>
        <Link
          to="/recommend"
          className="inline-flex items-center space-x-2 bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-lg hover:bg-red-100 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>맞춤 강의 추천</span>
        </Link>
      </div>
    </div>
  )
}
