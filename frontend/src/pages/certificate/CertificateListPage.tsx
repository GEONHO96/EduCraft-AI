/**
 * CertificateListPage — 내 수료증 목록
 *
 * 사용자가 발급받은 모든 수료증을 최근 순으로 나열한다.
 * 각 카드를 클릭하면 {@link CertificateDetailPage}로 이동해 상세 정보를 볼 수 있다.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { progressApi } from '../../api/progress'

export default function CertificateListPage() {
  const { data: certificates, isLoading, isError } = useQuery({
    queryKey: ['certificates', 'me'],
    queryFn: async () => {
      const res = await progressApi.getMyCertificates()
      if (!res.data.success) throw new Error(res.data.error?.message || '수료증을 불러올 수 없습니다')
      return res.data.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm">수료증을 불러오는 중...</div>
  }
  if (isError) {
    return <div className="text-center py-16 text-rose-500 text-sm">수료증을 불러오지 못했습니다.</div>
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">🏆 내 수료증</h1>
        <p className="text-sm text-gray-500 mt-1">강의를 수료하면 자동으로 수료증이 발급됩니다</p>
      </div>

      {certificates && certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((c) => (
            <Link
              key={c.id}
              to={`/certificates/${c.certificateNumber}`}
              className="relative overflow-hidden block bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-200 rounded-xl p-5 hover:shadow-lg transition"
            >
              <div className="absolute top-3 right-3 text-2xl">🏆</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Certificate of Completion</p>
              <h3 className="mt-2 text-lg font-bold text-amber-900">{c.courseTitle}</h3>
              <p className="mt-1 text-xs text-amber-800/70">수료자: {c.studentName}</p>
              <div className="mt-4 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-800/80">{c.certificateNumber}</span>
                <span className="text-amber-700">{new Date(c.issuedAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-6xl mb-3">📜</p>
          <p className="text-sm text-gray-500 mb-2">아직 발급받은 수료증이 없습니다</p>
          <p className="text-xs text-gray-400">수강 중인 강의의 자료를 모두 완료하고 퀴즈를 풀어 수료 조건을 달성해보세요.</p>
          <Link to="/progress/me" className="inline-block mt-4 text-sm text-indigo-600 underline">내 진도 보러가기</Link>
        </div>
      )}
    </div>
  )
}
