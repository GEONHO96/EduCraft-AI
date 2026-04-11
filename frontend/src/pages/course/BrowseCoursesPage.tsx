/**
 * BrowseCoursesPage - 강의 탐색 페이지
 * 학생이 전체 강의를 검색하고 수강 신청할 수 있다.
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { courseApi, BrowseCourse } from '../../api/courses'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function BrowseCoursesPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')

  // 강의 목록 조회
  const { data: courses, isLoading } = useQuery({
    queryKey: ['browse-courses', keyword],
    queryFn: async () => {
      const res = await courseApi.browse(keyword || undefined)
      return res.data.data
    },
  })

  // 수강 신청
  const enrollMutation = useMutation({
    mutationFn: (courseId: number) => courseApi.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['browse-courses'] })
      toast.success('수강 신청이 완료되었습니다!')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message || '수강 신청에 실패했습니다.'
      toast.error(msg)
    },
  })

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(search)
  }

  // 상대 시간 표시
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 1) return '오늘'
    if (days < 7) return `${days}일 전`
    if (days < 30) return `${Math.floor(days / 7)}주 전`
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  // 과목별 아이콘 색상
  const subjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      '수학': 'from-blue-400 to-blue-600',
      '영어': 'from-green-400 to-green-600',
      '과학': 'from-purple-400 to-purple-600',
      '국어': 'from-red-400 to-red-600',
      '사회': 'from-yellow-400 to-yellow-600',
      '프로그래밍': 'from-cyan-400 to-cyan-600',
      '음악': 'from-pink-400 to-pink-600',
      '미술': 'from-orange-400 to-orange-600',
    }
    return colors[subject] || 'from-gray-400 to-gray-600'
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">강의 탐색</h1>
        <p className="text-gray-500 text-sm mt-1">관심 있는 강의를 찾아 수강 신청하세요</p>
      </div>

      {/* 검색 바 */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="강의명 또는 과목으로 검색..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition text-sm font-medium"
          >
            검색
          </button>
          {keyword && (
            <button
              type="button"
              onClick={() => { setSearch(''); setKeyword('') }}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition text-sm"
            >
              초기화
            </button>
          )}
        </div>
      </form>

      {/* 검색 결과 정보 */}
      {keyword && (
        <p className="text-sm text-gray-500 mb-4">
          "<span className="font-medium text-gray-700">{keyword}</span>" 검색 결과 {courses?.length || 0}개
        </p>
      )}

      {/* 로딩 */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 강의 없음 */}
      {!isLoading && courses?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-400 font-medium">
            {keyword ? '검색 결과가 없습니다.' : '아직 개설된 강의가 없습니다.'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {keyword ? '다른 키워드로 검색해보세요.' : '교강사가 강의를 개설하면 여기에 표시됩니다.'}
          </p>
        </div>
      )}

      {/* 강의 카드 목록 */}
      <div className="grid gap-4 md:grid-cols-2">
        {courses?.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isStudent={user?.role === 'STUDENT'}
            subjectColor={subjectColor(course.subject)}
            timeAgo={timeAgo(course.createdAt)}
            onEnroll={() => enrollMutation.mutate(course.id)}
            enrolling={enrollMutation.isPending}
          />
        ))}
      </div>
    </div>
  )
}

/** 강의 카드 컴포넌트 */
function CourseCard({
  course,
  isStudent,
  subjectColor,
  timeAgo,
  onEnroll,
  enrolling,
}: {
  course: BrowseCourse
  isStudent: boolean
  subjectColor: string
  timeAgo: string
  onEnroll: () => void
  enrolling: boolean
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5">
      <div className="flex gap-4">
        {/* 과목 아이콘 */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subjectColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
          {course.subject.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <Link to={`/courses/${course.id}`} className="text-base font-semibold text-gray-800 hover:text-primary-600 transition line-clamp-1">
            {course.title}
          </Link>

          {/* 과목 + 교강사 */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{course.subject}</span>
            <span className="text-xs text-gray-400">{course.teacherName} 교강사</span>
          </div>

          {/* 설명 */}
          {course.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
          )}

          {/* 하단: 수강생 수 + 날짜 + 수강 신청 버튼 */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                수강생 {course.studentCount}명
              </span>
              <span>{timeAgo}</span>
            </div>

            {/* 수강 신청 버튼 (학생만) */}
            {isStudent && (
              course.enrolled ? (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  수강 중
                </span>
              ) : (
                <button
                  onClick={onEnroll}
                  disabled={enrolling}
                  className="text-xs bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition font-medium"
                >
                  {enrolling ? '신청 중...' : '수강 신청'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
