import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '../../api/courses'
import { useAuthStore } from '../../stores/authStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CoursesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const isTeacher = useAuthStore((s) => s.isTeacher)()
  const queryClient = useQueryClient()

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await courseApi.getMyCourses()
      return res.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: () => courseApi.create({ title, subject, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setShowCreate(false)
      setTitle('')
      setSubject('')
      setDescription('')
      toast.success('강의가 생성되었습니다!')
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">강의 관리</h1>
        {isTeacher && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            {showCreate ? '취소' : '+ 새 강의'}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">새 강의 만들기</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">강의 제목</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="예: 자바 프로그래밍 기초"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="예: 컴퓨터공학"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                rows={3}
                placeholder="강의에 대한 간단한 설명을 입력하세요"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {createMutation.isPending ? '생성 중...' : '강의 생성'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">로딩 중...</div>
      ) : courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="text-xs text-primary-600 font-medium mb-1">{course.subject}</div>
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                {course.teacherName} · {new Date(course.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">아직 강의가 없습니다.</p>
          {isTeacher && <p className="text-sm mt-1">위의 "새 강의" 버튼을 눌러 시작하세요.</p>}
        </div>
      )}
    </div>
  )
}
