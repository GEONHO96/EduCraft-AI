/**
 * CoursesPage - 강의 관리 페이지
 * 교강사: 강의 생성 + 내 강의 목록 조회
 * 학생: 수강 중인 강의 목록 조회
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

  const { data: courses, isLoading, isError, refetch } = useQuery({
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
      setTitle(''); setSubject(''); setDescription('')
      toast.success('강의가 생성되었습니다!')
    },
    onError: () => toast.error('강의 생성에 실패했습니다.'),
  })

  const filteredCourses = courses?.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">

      {/* ====== 헤더 ====== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">강의 관리</h1>
          {courses && courses.length > 0 && (
            <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {courses.length}개
            </span>
          )}
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition text-sm font-medium ${
              showCreate
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 shadow-sm'
            }`}
          >
            {showCreate ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                취소
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 강의
              </>
            )}
          </button>
        )}
      </div>

      {/* ====== 강의 생성 폼 ====== */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">새 강의 만들기</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">강의 제목</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="예: 자바 프로그래밍 기초"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">과목</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="예: 컴퓨터공학"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">설명</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                rows={3}
                placeholder="강의에 대한 간단한 설명을 입력하세요"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {createMutation.isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  생성 중...
                </>
              ) : '강의 생성'}
            </button>
          </form>
        </div>
      )}

      {/* ====== 검색 ====== */}
      {!isLoading && courses && courses.length > 0 && (
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="강의명 또는 과목으로 검색..."
          />
        </div>
      )}

      {/* ====== 강의 목록 ====== */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-100 rounded mb-1" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">불러올 수 없습니다</h3>
          <p className="text-sm text-gray-500 mb-4">서버 연결을 확인해주세요</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">다시 시도</button>
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* 상단 그라디언트 바 */}
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {course.subject}
                  </span>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition mb-1.5 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {course.description || '설명이 없습니다.'}
                </p>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
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
            </Link>
          ))}
        </div>
      ) : search ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 font-medium">"{search}" 검색 결과가 없습니다</p>
          <button onClick={() => setSearch('')} className="text-sm text-indigo-600 hover:underline mt-2">초기화</button>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">아직 강의가 없습니다</h3>
          <p className="text-sm text-gray-400">
            {isTeacher ? '"새 강의" 버튼을 눌러 첫 강의를 만들어보세요' : '강의 탐색에서 수강 신청을 해보세요'}
          </p>
        </div>
      )}
    </div>
  )
}
