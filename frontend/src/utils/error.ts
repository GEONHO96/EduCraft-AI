/**
 * 에러 처리 유틸리티
 * API 에러 응답에서 사용자 친화적 메시지를 추출한다.
 */

/** API 에러에서 메시지를 추출 (기본 메시지 폴백 지원) */
export function getErrorMessage(error: unknown, fallback = '요청 처리에 실패했습니다.'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: { message?: string } } } }
    return axiosError.response?.data?.error?.message || fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}
