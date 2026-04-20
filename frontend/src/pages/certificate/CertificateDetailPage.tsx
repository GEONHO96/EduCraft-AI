/**
 * CertificateDetailPage — 수료증 단건 상세
 *
 * 수료증 번호로 조회하여 학생 이름·강의명·발급일·점수 등을 큰 카드 형태로 표시한다.
 * PDF 다운로드는 out of scope — 인쇄(Ctrl+P)로 대체 가능하도록 프린트 친화적 레이아웃 구성.
 */
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { progressApi } from '../../api/progress'

export default function CertificateDetailPage() {
  const { certificateNumber } = useParams<{ certificateNumber: string }>()

  const { data: cert, isLoading, isError } = useQuery({
    queryKey: ['certificate', certificateNumber],
    queryFn: async () => {
      const res = await progressApi.getCertificate(certificateNumber!)
      if (!res.data.success) throw new Error(res.data.error?.message || '수료증을 불러올 수 없습니다')
      return res.data.data
    },
    enabled: !!certificateNumber,
  })

  if (isLoading) return <div className="text-center py-16 text-gray-400 text-sm">불러오는 중...</div>
  if (isError || !cert) return <div className="text-center py-16 text-rose-500 text-sm">수료증을 찾을 수 없습니다.</div>

  const issuedDate = new Date(cert.issuedAt)
  const formattedDate = `${issuedDate.getFullYear()}년 ${issuedDate.getMonth() + 1}월 ${issuedDate.getDate()}일`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/certificates" className="text-sm text-indigo-600 hover:underline">← 수료증 목록</Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          🖨️ 인쇄 / PDF로 저장
        </button>
      </div>

      {/* 수료증 본문 — 프린트 친화적 레이아웃 */}
      <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-8 border-double border-amber-600 rounded-xl p-10 md:p-16 text-center">
        <div className="absolute top-6 left-6 text-3xl">🌿</div>
        <div className="absolute top-6 right-6 text-3xl">🌿</div>
        <div className="absolute bottom-6 left-6 text-3xl">🌿</div>
        <div className="absolute bottom-6 right-6 text-3xl">🌿</div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">Certificate of Completion</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-amber-900 tracking-tight">수료증</h1>

        <div className="mt-10">
          <p className="text-sm text-amber-800/70">이 수료증은 아래 학생이</p>
          <p className="mt-2 text-2xl md:text-3xl font-bold text-amber-900">{cert.studentName}</p>
          <p className="mt-6 text-sm text-amber-800/70">다음 강의의 모든 과정을 성실히 이수하였음을 증명합니다.</p>
          <p className="mt-3 text-xl md:text-2xl font-semibold text-amber-900">&ldquo;{cert.courseTitle}&rdquo;</p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-amber-800">
          <p>최종 성취도: <strong>{cert.finalScore.toFixed(1)}점</strong></p>
          <p>발급일: <strong>{formattedDate}</strong></p>
        </div>

        <div className="mt-10 pt-6 border-t border-amber-300/60 flex items-center justify-between text-xs text-amber-700">
          <span className="font-mono">{cert.certificateNumber}</span>
          <span className="font-semibold">EduCraft AI</span>
        </div>
      </div>
    </div>
  )
}
