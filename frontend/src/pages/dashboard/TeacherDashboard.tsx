import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.teacher()
      return res.data.data
    },
  })

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-6 bg-gray-100 animate-pulse">
              <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 border-2 border-dashed border-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">교강사 대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">AI로 수업 준비 시간을 절약하세요</p>
        </div>
        <Link
          to="/courses"
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>강의 관리</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashCard
          title="내 강의"
          value={data?.totalCourses ?? 0}
          unit="개"
          color="blue"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <DashCard
          title="수강생"
          value={data?.totalStudents ?? 0}
          unit="명"
          color="green"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <DashCard
          title="AI 생성 횟수"
          value={Number(data?.timeSaved?.generationCount ?? 0)}
          unit="회"
          color="purple"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <DashCard
          title="절약한 시간"
          value={data?.timeSaved?.formatted ?? '0시간 0분'}
          color="orange"
          isText
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">빠른 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/courses"
            className="group p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition text-center"
          >
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="font-medium text-gray-800">새 강의 만들기</div>
            <div className="text-sm text-gray-500 mt-1">강의를 생성하고 AI로 커리큘럼을 설계하세요</div>
          </Link>
          <Link
            to="/courses"
            className="group p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition text-center"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="font-medium text-gray-800">AI 자료 생성</div>
            <div className="text-sm text-gray-500 mt-1">강의를 선택 후 자료를 생성하세요</div>
          </Link>
          <Link
            to="/courses"
            className="group p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-center"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-medium text-gray-800">AI 퀴즈 출제</div>
            <div className="text-sm text-gray-500 mt-1">커리큘럼 기반 퀴즈를 자동 생성하세요</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function DashCard({
  title,
  value,
  unit,
  color,
  isText,
  icon,
}: {
  title: string
  value: number | string
  unit?: string
  color: string
  isText?: boolean
  icon: React.ReactNode
}) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100 text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100 text-green-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100 text-purple-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'bg-orange-100 text-orange-600' },
  }

  const c = colorMap[color]

  return (
    <div className={`rounded-xl p-5 ${c.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${c.text} opacity-80`}>{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconBg}`}>
          {icon}
        </div>
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>
        {isText ? value : <>{value}<span className="text-base font-medium ml-1">{unit}</span></>}
      </div>
    </div>
  )
}
