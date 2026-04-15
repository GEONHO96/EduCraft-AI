/**
 * API 클라이언트 - Axios 인스턴스 설정
 * 공통 baseURL, 헤더, 타임아웃, 재시도, 인터셉터를 설정하여 모든 API 호출에서 재사용한다.
 */
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 15000,
})

// ── 요청 인터셉터: JWT 토큰 자동 첨부 + 캐시 방지 ──
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // GET 요청 캐시 방지 (브라우저 캐시로 인한 stale 응답 방지)
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() }
  }
  return config
})

// ── 재시도 로직: 네트워크 에러 시 최대 2회 재시도 ──
apiClient.interceptors.response.use(undefined, async (error) => {
  const config = error.config
  if (!config || config._retryCount >= 2) return Promise.reject(error)

  // 네트워크 에러 또는 타임아웃만 재시도 (4xx/5xx는 재시도 안 함)
  const isNetworkError = !error.response && error.code !== 'ERR_CANCELED'
  const isTimeout = error.code === 'ECONNABORTED'
  if (!isNetworkError && !isTimeout) return Promise.reject(error)

  config._retryCount = (config._retryCount || 0) + 1
  const delay = config._retryCount * 1000 // 1초, 2초 점진적 대기
  await new Promise((r) => setTimeout(r, delay))
  return apiClient(config)
})

// ── 응답 인터셉터: 인증 에러 시 로그인 리다이렉트 ──
apiClient.interceptors.response.use(
  (response) => {
    // AUTH_003(인증 만료 / JWT 유저 DB 미존재) → 강제 로그아웃
    // ※ USER_001은 비밀번호 재설정·이메일 찾기에서도 사용되므로 여기서 제외
    if (response.data?.success === false && response.data?.error?.code === 'AUTH_003') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
