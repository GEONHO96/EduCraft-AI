import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.student()
      return res.data.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">로딩 중...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">학생 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 text-blue-700 rounded-xl p-6">
          <div className="text-sm font-medium opacity-75">수강 중인 강의</div>
          <div className="text-3xl font-bold mt-2">{data?.enrolledCourses ?? 0}개</div>
        </div>
        <div className="bg-green-50 text-green-700 rounded-xl p-6">
          <div className="text-sm font-medium opacity-75">완료한 퀴즈</div>
          <div className="text-3xl font-bold mt-2">{data?.completedQuizzes ?? 0}개</div>
        </div>
        <div className="bg-purple-50 text-purple-700 rounded-xl p-6">
          <div className="text-sm font-medium opacity-75">평균 점수</div>
          <div className="text-3xl font-bold mt-2">{data?.averageScore ?? 0}점</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">최근 퀴즈 결과</h2>
        {data?.recentQuizResults && data.recentQuizResults.length > 0 ? (
          <div className="space-y-3">
            {data.recentQuizResults.map((result, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{result.quizTitle}</span>
                <span className="text-sm">
                  {result.score}/{result.totalQuestions}문제 정답
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">아직 완료한 퀴즈가 없습니다.</p>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/courses"
          className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          내 강의 보기
        </Link>
      </div>
    </div>
  )
}
