/**
 * 에러 처리 유틸리티
 * API 에러 응답에서 사용자 친화적 메시지를 추출한다.
 */

/** 백엔드 공통 응답 형식 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: { code: string; message: string }
}

/** API 에러에서 메시지를 추출 (기본 메시지 폴백 지원) */
export function getErrorMessage(error: unknown, fallback = '요청 처리에 실패했습니다.'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: ApiResponse } }
    return axiosError.response?.data?.error?.message || fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

/** 실패 응답 body에서 에러 메시지 추출 (success: false일 때 사용) */
export function getResponseError(data: ApiResponse, fallback = '요청 처리에 실패했습니다.'): string {
  return data.error?.message || fallback
}
