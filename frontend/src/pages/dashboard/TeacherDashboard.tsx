import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.teacher()
      return res.data.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">교강사 대시보드</h1>
        <Link
          to="/courses"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          강의 관리
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashCard title="내 강의" value={data?.totalCourses ?? 0} unit="개" color="blue" />
        <DashCard title="수강생" value={data?.totalStudents ?? 0} unit="명" color="green" />
        <DashCard title="AI 생성 횟수" value={Number(data?.timeSaved?.generationCount ?? 0)} unit="회" color="purple" />
        <DashCard
          title="절약한 시간"
          value={data?.timeSaved?.formatted ?? '0시간 0분'}
          color="orange"
          isText
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">빠른 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/courses"
            className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition text-center"
          >
            <div className="text-3xl mb-2">+</div>
            <div className="font-medium">새 강의 만들기</div>
            <div className="text-sm text-gray-500">강의를 생성하고 AI로 커리큘럼을 설계하세요</div>
          </Link>
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
            <div className="text-3xl mb-2">AI</div>
            <div className="font-medium">AI 자료 생성</div>
            <div className="text-sm">강의를 선택 후 자료를 생성하세요</div>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
            <div className="text-3xl mb-2">Q</div>
            <div className="font-medium">AI 퀴즈 출제</div>
            <div className="text-sm">커리큘럼 기반 퀴즈를 자동 생성하세요</div>
          </div>
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
}: {
  title: string
  value: number | string
  unit?: string
  color: string
  isText?: boolean
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className={`rounded-xl p-6 ${colorMap[color]}`}>
      <div className="text-sm font-medium opacity-75">{title}</div>
      <div className="text-3xl font-bold mt-2">
        {isText ? value : `${value}${unit ?? ''}`}
      </div>
    </div>
  )
}
