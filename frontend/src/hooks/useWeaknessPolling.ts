/**
 * useWeaknessPolling
 *
 * 특정 퀴즈 제출의 약점 리포트 상태를 3초 간격으로 폴링하는 훅.
 * 상태가 COMPLETED 또는 FAILED로 전이되면 폴링을 자동 중단한다.
 * 최대 폴링 시간은 30초 (10회) — 이후엔 timed out으로 종료.
 */
import { useQuery } from '@tanstack/react-query'
import { weaknessApi, type WeaknessReportInfo } from '../api/weakness'

const POLL_INTERVAL_MS = 3_000
const POLL_MAX_ATTEMPTS = 10  // 3s × 10 = 30s

export function useWeaknessPolling(quizSubmissionId: number | null) {
  return useQuery<WeaknessReportInfo | null, Error>({
    queryKey: ['weakness', 'submission', quizSubmissionId],
    queryFn: async () => {
      if (!quizSubmissionId) return null
      try {
        const res = await weaknessApi.getBySubmission(quizSubmissionId)
        if (!res.data.success) {
          // 404(리포트 없음)는 "오답 없음"으로 해석
          return null
        }
        return res.data.data
      } catch {
        return null
      }
    },
    enabled: !!quizSubmissionId,
    refetchInterval: (query) => {
      const data = query.state.data
      // 완료됐거나 실패했거나 리포트가 없다고 확인되면 폴링 중지
      if (!data) return false
      if (data.analysisStatus === 'COMPLETED' || data.analysisStatus === 'FAILED') return false
      // 최대 시도 횟수 초과도 중지
      if ((query.state.dataUpdateCount ?? 0) >= POLL_MAX_ATTEMPTS) return false
      return POLL_INTERVAL_MS
    },
    refetchIntervalInBackground: false,
  })
}
