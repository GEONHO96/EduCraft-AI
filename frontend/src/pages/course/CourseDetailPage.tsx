import { useParams, Link } from 'react-router-dom'
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

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await courseApi.getCourse(Number(courseId))
      return res.data.data
    },
  })

  const { data: curriculums } = useQuery({
    queryKey: ['curriculums', courseId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: CurriculumInfo[] }>(
        `/courses/${courseId}/curriculums`
      )
      return res.data.data
    },
  })

  return (
    <div>
      <div className="mb-6">
        <Link to="/courses" className="text-primary-600 hover:underline text-sm">
          &larr; 강의 목록
        </Link>
      </div>

      {course && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="text-xs text-primary-600 font-medium mb-1">{course.subject}</div>
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          <div className="mt-4 text-sm text-gray-400">
            {course.teacherName} · {new Date(course.createdAt).toLocaleDateString('ko-KR')}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">커리큘럼</h2>
        {isTeacher && (
          <Link
            to={`/courses/${courseId}/generate-curriculum`}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
          >
            <span>AI 커리큘럼 생성</span>
          </Link>
        )}
      </div>

      {curriculums && curriculums.length > 0 ? (
        <div className="space-y-4">
          {curriculums.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
                      {c.weekNumber}주차
                    </span>
                    {c.aiGenerated && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                        AI 생성
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{c.topic}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.objectives}</p>
                </div>
                {isTeacher && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/curriculum/${c.id}/generate-material`}
                      className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                    >
                      AI 자료 생성
                    </Link>
                    <Link
                      to={`/curriculum/${c.id}/generate-quiz`}
                      className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-lg hover:bg-green-100 transition"
                    >
                      AI 퀴즈 출제
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
          <p>아직 커리큘럼이 없습니다.</p>
          {isTeacher && <p className="text-sm mt-1">AI로 커리큘럼을 자동 생성해보세요!</p>}
        </div>
      )}
    </div>
  )
}
