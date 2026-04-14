/**
 * LoadingSkeleton - 페이지 로딩 중 표시하는 스켈레톤 UI
 * 대시보드, 피드 등 데이터 로딩 시 공통으로 사용한다.
 */

interface LoadingSkeletonProps {
  /** 스켈레톤 변형 (기본: dashboard) */
  variant?: 'dashboard' | 'feed' | 'detail'
}

export default function LoadingSkeleton({ variant = 'dashboard' }: LoadingSkeletonProps) {
  if (variant === 'feed') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-gray-200 rounded" />
                <div className="h-2.5 w-16 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  // dashboard (default)
  return (
    <div className="space-y-4">
      <div className="h-44 rounded-2xl bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  )
}
