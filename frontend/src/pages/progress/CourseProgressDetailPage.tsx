/**
 * CourseProgressDetailPage — 특정 코스의 학습 진도 상세 화면
 *
 * 커리큘럼·자료 목록을 불러와 학생이 자료별 완료 체크박스를 쓸 수 있게 한다.
 * 체크/해제 시 `progressApi`를 호출하고 TanStack Query 캐시를 무효화해
 * 상단 진도율·완료 수가 즉시 갱신된다.
 *
 * 수료 조건을 만족하면 상단 배너가 "수료 완료" 상태로 전환되며
 * `CertificateListPage`로 이동할 수 있는 링크가 노출된다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { progressApi } from '../../api/progress'

interface Material {
  id: number
  type: string
  title: string
  difficulty: number
  aiGenerated: boolean
}

interface CurriculumWithMaterials {
  id: number
  weekNumber: number
  topic: string
  objectives: string
  aiGenerated: boolean
  materials?: Material[]
}

export default function CourseProgressDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const cid = Number(courseId)
  const queryClient = useQueryClient()

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress', 'course', cid],
    queryFn: async () => {
      const res = await progressApi.getCourseProgress(cid)
      if (!res.data.success) throw new Error(res.data.error?.message || '진도 정보를 불러올 수 없습니다')
      return res.data.data
    },
    enabled: !!cid,
  })

  const { data: course } = useQuery({
    queryKey: ['course', cid],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: { id: number; title: string; subject: string } }>(
        `/courses/${cid}`
      )
      return res.data.data
    },
    enabled: !!cid,
  })

  const { data: curriculums } = useQuery({
    queryKey: ['curriculums-materials', cid],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: CurriculumWithMaterials[] }>(
        `/courses/${cid}/curriculums`
      )
      return res.data.data
    },
    enabled: !!cid,
  })

  const completeMutation = useMutation({
    mutationFn: (materialId: number) => progressApi.completeMaterial(materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', 'course', cid] })
      queryClient.invalidateQueries({ queryKey: ['progress', 'me'] })
      toast.success('완료 처리되었습니다')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || '완료 처리에 실패했습니다')
    },
  })

  const uncompleteMutation = useMutation({
    mutationFn: (materialId: number) => progressApi.uncompleteMaterial(materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', 'course', cid] })
      queryClient.invalidateQueries({ queryKey: ['progress', 'me'] })
    },
  })

  if (progressLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm">진도를 불러오는 중...</div>
  }

  const rate = progress ? Math.round(progress.progressRate * 10) / 10 : 0
  const completedSet = new Set(progress?.completedMaterialIds ?? [])

  const toggleMaterial = (materialId: number) => {
    if (completedSet.has(materialId)) {
      uncompleteMutation.mutate(materialId)
    } else {
      completeMutation.mutate(materialId)
    }
  }

  return (
    <div className="space-y-5">
      {/* 배너 */}
      <div className={`relative overflow-hidden rounded-2xl p-6 ${
        progress?.completed
          ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800'
          : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900'
      }`}>
        <Link to="/progress/me" className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-4">
          ← 내 진도 목록
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">{course?.title ?? '강의'}</h1>
        <p className="text-white/60 text-sm">{course?.subject}</p>

        {progress && (
          <>
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2 text-white/80 text-sm">
                <span>진도율</span>
                <span className="text-2xl font-bold text-white">{rate}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/90 transition-all" style={{ width: `${Math.min(100, rate)}%` }} />
              </div>
              <p className="mt-3 text-xs text-white/60">
                자료 {progress.completedMaterialCount}/{progress.totalMaterialCount} 완료 ·
                퀴즈 {progress.quizAttemptCount}회 제출
                {progress.averageQuizScore !== null && ` · 평균 ${Math.round(progress.averageQuizScore)}점`}
              </p>
            </div>

            {progress.completed && (
              <div className="mt-5 p-3 bg-white/10 rounded-lg">
                <p className="text-white font-semibold text-sm">🎉 수료 완료!</p>
                <p className="text-white/70 text-xs mt-1">
                  {new Date(progress.completedAt!).toLocaleDateString('ko-KR')} 수료증이 발급되었습니다.{' '}
                  <Link to="/certificates" className="underline font-medium">수료증 보기</Link>
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 커리큘럼 + 자료 체크리스트 */}
      <div className="space-y-3">
        {curriculums?.map((cur) => (
          <div key={cur.id} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                {cur.weekNumber}주차
              </span>
              <h3 className="text-sm font-semibold text-gray-900">{cur.topic}</h3>
            </div>

            {cur.materials && cur.materials.length > 0 ? (
              <ul className="space-y-2">
                {cur.materials.map((m) => {
                  const isCompleted = completedSet.has(m.id)
                  return (
                    <li key={m.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleMaterial(m.id)}
                        disabled={completeMutation.isPending || uncompleteMutation.isPending}
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                      <span className={`text-sm flex-1 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {m.title}
                      </span>
                      <span className="text-[10px] text-gray-400">난이도 {m.difficulty}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">학습 자료가 없습니다</p>
            )}
          </div>
        ))}
        {(!curriculums || curriculums.length === 0) && (
          <div className="text-center py-16 bg-gray-50 rounded-xl text-sm text-gray-400">
            커리큘럼이 아직 등록되지 않았습니다
          </div>
        )}
      </div>
    </div>
  )
}
