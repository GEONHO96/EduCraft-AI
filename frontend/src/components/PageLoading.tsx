/**
 * PageLoading - 코드 스플리팅 시 페이지 로딩 폴백 컴포넌트
 * React.lazy + Suspense의 fallback으로 사용된다.
 */
export default function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  )
}
