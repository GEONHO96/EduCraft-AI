/**
 * API 공통 응답 타입
 * 모든 백엔드 API 응답은 이 형식을 따른다.
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    code: string
    message: string
  }
}
