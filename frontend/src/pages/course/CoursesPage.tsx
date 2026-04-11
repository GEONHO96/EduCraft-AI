/**
 * CoursesPage - 강의 관리 페이지
 * 교강사: 강의 생성 + 내 강의 목록 조회
 * 학생: 수강 중인 강의 목록 조회
 * 검색 필터와 강의 카드 그리드를 제공한다.
 */
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
  const [search, setSearch] = useState('')
  const isTeacher = useAuthStore((s) => s.isTeacher)()
  const queryClient = useQueryClient()

  // 내 강의 목록 조회
  const { data: courses, isLoading, isError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await courseApi.getMyCourses()
      return res.data.data
    },
  })

  // 새 강의 생성 뮤테이션
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
    onError: () => {
      toast.error('강의 생성에 실패했습니다.')
    },
  })

  // 제목/과목 기준 클라이언트 사이드 검색 필터
  const filteredCourses = courses?.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">강의 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isTeacher ? '강의를 만들고 AI로 커리큘럼을 설계하세요' : '수강 중인 강의를 확인하세요'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
              showCreate
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {showCreate ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>취소</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>새 강의</span>
              </>
            )}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">새 강의 만들기</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">강의 제목</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="예: 자바 프로그래밍 기초"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                rows={3}
                placeholder="강의에 대한 간단한 설명을 입력하세요"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition text-sm font-medium"
            >
              {createMutation.isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>생성 중...</span>
                </>
              ) : (
                <span>강의 생성</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 검색 */}
      {!isLoading && courses && courses.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
              placeholder="강의명 또는 과목으로 검색..."
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
              <div className="mt-4 h-3 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">강의 목록을 불러올 수 없습니다</h3>
          <p className="text-sm text-gray-500 mb-4">서버와의 연결을 확인해주세요</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm">
            다시 시도
          </button>
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group bg-white rounded-xl shadow-sm border border-transparent p-6 hover:shadow-md hover:border-primary-200 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full">{course.subject}</span>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-700 transition">{course.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{course.description || '설명이 없습니다.'}</p>
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {course.teacherName}
                <span className="mx-2">·</span>
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(course.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </Link>
          ))}
        </div>
      ) : search ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">"{search}" 검색 결과가 없습니다</p>
          <button onClick={() => setSearch('')} className="text-sm text-primary-600 hover:underline mt-2">검색 초기화</button>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">아직 강의가 없습니다</h3>
          {isTeacher ? (
            <p className="text-sm text-gray-500">위의 "새 강의" 버튼을 눌러 첫 강의를 만들어보세요</p>
          ) : (
            <p className="text-sm text-gray-500">교강사가 생성한 강의에 수강 신청을 해보세요</p>
          )}
        </div>
      )}
    </div>
  )
}
