import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { courseApi } from '../../api/courses'
import { useAuthStore } from '../../stores/authStore'
import apiClient from '../../api/client'

interface CurriculumInfo {
  id: number
  courseId: number
  weekNumber: number
  topic: string
  objectives: string
  contentJson: string
  aiGenerated: boolean
  createdAt: string
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const isTeacher = useAuthStore((s) => s.isTeacher)()
  const navigate = useNavigate()

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await courseApi.getCourse(Number(courseId))
      if (!res.data.success) throw new Error(res.data.error?.message || '강의 정보를 불러올 수 없습니다')
      return res.data.data
    },
  })

  const { data: curriculums } = useQuery({
    queryKey: ['curriculums', courseId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: CurriculumInfo[]; error?: { message: string } }>(
        `/courses/${courseId}/curriculums`
      )
      if (!res.data.success) throw new Error(res.data.error?.message || '커리큘럼을 불러올 수 없습니다')
      return res.data.data
    },
  })

  const aiCount = curriculums?.filter((c) => c.aiGenerated).length ?? 0

  return (
    <div className="space-y-5">

      {/* ====== 히어로 배너 ====== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 p-6">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <Link to="/courses" className="inline-flex items-center gap-1 text-indigo-300/70 hover:text-white text-sm transition mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            강의 목록
          </Link>

          {course && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  {course.subject}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-indigo-200/60 text-sm max-w-2xl">{course.description}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-indigo-300/50">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {course.teacherName}
                </span>
                <span>·</span>
                <span>{new Date(course.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== 통계 바 + 커리큘럼 생성 ====== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">{curriculums?.length ?? 0}</span>주차
          </div>
          {aiCount > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              AI 생성 <span className="font-medium text-gray-700">{aiCount}</span>개
            </div>
          )}
        </div>
        {isTeacher && (
          <Link
            to={`/courses/${courseId}/generate-curriculum`}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 커리큘럼 생성
          </Link>
        )}
      </div>

      {/* ====== 커리큘럼 타임라인 ====== */}
      {curriculums && curriculums.length > 0 ? (
        <div className="relative">
          {/* 타임라인 세로줄 */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gray-200" />

          <div className="space-y-3">
            {curriculums.map((c, idx) => (
              <div key={c.id} className="relative flex gap-4 group">
                {/* 타임라인 원 */}
                <div className="relative z-10 shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition ${
                    c.aiGenerated
                      ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white border-indigo-300'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}>
                    {c.weekNumber}
                  </div>
                </div>

                {/* 카드 - 클릭하면 자료 생성 페이지로 이동 */}
                <div
                  onClick={() => navigate(`/curriculum/${c.id}/generate-material`)}
                  className="flex-1 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group-hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {c.weekNumber}주차
                        </span>
                        {c.aiGenerated && (
                          <span className="text-[10px] font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{c.topic}</h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{c.objectives}</p>
                    </div>
                    {isTeacher && (
                      <div className="flex gap-1.5 shrink-0">
                        <Link
                          to={`/curriculum/${c.id}/generate-material`}
                          className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          자료 생성
                        </Link>
                        <Link
                          to={`/curriculum/${c.id}/generate-quiz`}
                          className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          퀴즈 출제
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="font-medium text-gray-600 mb-1">아직 커리큘럼이 없습니다</p>
          <p className="text-sm text-gray-400 mb-4">AI로 커리큘럼을 자동 생성해보세요</p>
          {isTeacher && (
            <Link
              to={`/courses/${courseId}/generate-curriculum`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI 커리큘럼 생성하기
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
