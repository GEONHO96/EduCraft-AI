/**
 * CourseMonitoringPage — 교사용 통합 강의 모니터링
 *
 * 탭 2개:
 * - 진도·성적: 반 학생별 진도율·퀴즈 점수·비활성 여부 테이블
 * - 반 약점 분석: Claude AI가 뽑아낸 공통 취약 개념 TOP N
 *
 * 상단 요약 카드: 전체 학생 수 / 평균 진도율 / 수료 인원 / 비활성 인원
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { monitoringApi, type StudentProgress, type TopConcept } from '../../api/monitoring'

type Tab = 'progress' | 'weakness'

function formatDate(iso: string | null) {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  } catch { return iso }
}

export default function CourseMonitoringPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const cid = Number(courseId)
  const [tab, setTab] = useState<Tab>('progress')
  const [statusFilter, setStatusFilter] = useState<'all' | 'inactive' | 'completed'>('all')
  const [search, setSearch] = useState('')

  const { data: summary } = useQuery({
    queryKey: ['monitoring', 'summary', cid],
    queryFn: async () => {
      const res = await monitoringApi.getCourseSummary(cid)
      if (!res.data.success) throw new Error(res.data.error?.message || '요약을 불러올 수 없습니다')
      return res.data.data
    },
    enabled: !!cid,
  })

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['monitoring', 'students', cid],
    queryFn: async () => {
      const res = await monitoringApi.getStudentProgressList(cid)
      if (!res.data.success) throw new Error(res.data.error?.message || '학생 목록을 불러올 수 없습니다')
      return res.data.data
    },
    enabled: !!cid && tab === 'progress',
  })

  const { data: topConcepts, isLoading: weaknessLoading } = useQuery({
    queryKey: ['monitoring', 'weakness', cid],
    queryFn: async () => {
      const res = await monitoringApi.getWeaknessTop(cid, 5)
      if (!res.data.success) throw new Error(res.data.error?.message || '약점 분석을 불러올 수 없습니다')
      return res.data.data
    },
    enabled: !!cid && tab === 'weakness',
  })

  const filtered = (students ?? []).filter((s) => {
    if (statusFilter === 'inactive' && !s.inactive) return false
    if (statusFilter === 'completed' && !s.completed) return false
    if (search && !s.studentName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/courses" className="text-xs text-gray-500 hover:text-indigo-600">← 내 강의</Link>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{summary?.courseTitle ?? '강의'} 모니터링</h1>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-3">
        <SummaryCard label="전체 학생" value={summary?.totalStudents ?? 0} tint="slate" />
        <SummaryCard label="평균 진도율" value={`${Math.round((summary?.averageProgressRate ?? 0) * 10) / 10}%`} tint="indigo" />
        <SummaryCard label="수료 인원" value={summary?.completedStudents ?? 0} tint="emerald" />
        <SummaryCard label="비활성 (7일+)" value={summary?.inactiveStudents ?? 0} tint="rose" />
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <TabButton active={tab === 'progress'} onClick={() => setTab('progress')}>진도·성적</TabButton>
        <TabButton active={tab === 'weakness'} onClick={() => setTab('weakness')}>반 약점 분석</TabButton>
      </div>

      {/* 탭 컨텐츠 */}
      {tab === 'progress' ? (
        <>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="학생 이름 검색"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>전체</FilterChip>
            <FilterChip active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>비활성</FilterChip>
            <FilterChip active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')}>수료 완료</FilterChip>
          </div>

          {studentsLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl text-sm text-gray-400">해당하는 학생이 없습니다</div>
          ) : (
            <StudentTable students={filtered} />
          )}
        </>
      ) : (
        <>
          {weaknessLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm">AI 분석 결과를 불러오는 중...</div>
          ) : !topConcepts || topConcepts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-5xl mb-3">🎯</p>
              <p className="text-sm text-gray-500 mb-1">아직 분석된 반 공통 약점이 없습니다</p>
              <p className="text-xs text-gray-400">학생들이 퀴즈를 풀고 AI 분석이 완료되면 여기에 표시됩니다.</p>
            </div>
          ) : (
            <WeaknessTopChart concepts={topConcepts} />
          )}
        </>
      )}
    </div>
  )
}

function SummaryCard({ label, value, tint }: { label: string; value: number | string; tint: 'slate' | 'indigo' | 'emerald' | 'rose' }) {
  const map = {
    slate: 'from-slate-700 to-slate-800',
    indigo: 'from-indigo-600 to-violet-600',
    emerald: 'from-emerald-600 to-teal-700',
    rose: 'from-rose-600 to-red-700',
  }
  return (
    <div className={`bg-gradient-to-br ${map[tint]} text-white rounded-xl p-4`}>
      <p className="text-xs font-medium opacity-90">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition ${
        active ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function StudentTable({ students }: { students: StudentProgress[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">학생</th>
            <th className="text-left px-4 py-3 font-semibold">진도율</th>
            <th className="text-left px-4 py-3 font-semibold">자료</th>
            <th className="text-left px-4 py-3 font-semibold">퀴즈</th>
            <th className="text-left px-4 py-3 font-semibold">최근 활동</th>
            <th className="text-left px-4 py-3 font-semibold">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {students.map((s) => {
            const rate = Math.round(s.progressRate * 10) / 10
            const barColor = s.completed ? 'bg-emerald-500' : rate >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
            return (
              <tr key={s.studentId} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{s.studentName}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </td>
                <td className="px-4 py-3 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, rate)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-12 text-right">{rate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {s.completedMaterialCount}/{s.totalMaterialCount}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {s.quizAttemptCount}회
                  {s.averageQuizScore !== null && <span className="text-gray-400"> · 평균 {Math.round(s.averageQuizScore)}점</span>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{formatDate(s.lastActivityAt)}</td>
                <td className="px-4 py-3">
                  {s.completed ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">수료</span>
                  ) : s.inactive ? (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">비활성</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">진행중</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function WeaknessTopChart({ concepts }: { concepts: TopConcept[] }) {
  const max = Math.max(...concepts.map(c => c.count), 1)
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">반 공통 취약 개념 TOP {concepts.length}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Claude AI가 학생들의 오답을 분석해 추출한 공통 약점. 학습 보강이 필요한 영역입니다.
        </p>
      </div>

      <div className="space-y-3">
        {concepts.map((c, idx) => {
          const pct = (c.count / max) * 100
          return (
            <div key={c.concept}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 w-5">#{idx + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{c.concept}</span>
                </div>
                <span className="text-xs font-semibold text-gray-500">{c.count}명</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
