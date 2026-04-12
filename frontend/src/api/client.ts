/**
 * API 클라이언트 - Axios 인스턴스 설정
 * 공통 baseURL, 헤더, 타임아웃, 인터셉터를 설정하여 모든 API 호출에서 재사용한다.
 */
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 30000,
})

// 요청 인터셉터: 매 요청마다 JWT 토큰을 Authorization 헤더에 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터: 401 Unauthorized 시 토큰 삭제 후 로그인 페이지로 이동
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
