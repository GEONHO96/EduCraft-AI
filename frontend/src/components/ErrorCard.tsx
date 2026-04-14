/**
 * ErrorCard - 데이터 로드 실패 시 표시하는 에러 카드
 * "다시 시도" 버튼과 함께 서버 연결 실패 UI를 제공한다.
 */

interface ErrorCardProps {
  /** 재시도 콜백 */
  onRetry?: () => void
  /** 에러 제목 (기본: "연결할 수 없습니다") */
  title?: string
  /** 에러 설명 (기본: "서버 상태를 확인해주세요") */
  description?: string
}

export default function ErrorCard({
  onRetry,
  title = '연결할 수 없습니다',
  description = '서버 상태를 확인해주세요',
}: ErrorCardProps) {
  return (
    <div className="text-center py-20">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
