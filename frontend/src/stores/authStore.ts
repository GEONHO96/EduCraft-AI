/**
 * authStore - Zustand 기반 인증 상태 관리
 * 로그인 유저 정보와 JWT 토큰을 관리하며, localStorage와 동기화한다.
 */
import { create } from 'zustand'
import { UserInfo } from '../api/auth'

interface AuthState {
  user: UserInfo | null
  token: string | null
  setAuth: (user: UserInfo, token: string) => void
  logout: () => void
  isLoggedIn: () => boolean
  isTeacher: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기값: localStorage에서 복원 (새로고침 시 로그인 유지)
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('accessToken'),

  // 로그인 성공 시 유저 정보 + 토큰 저장
  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  // 로그아웃: 로컬 스토리지 + 상태 초기화
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  // 헬퍼 함수
  isLoggedIn: () => !!get().token,
  isTeacher: () => get().user?.role === 'TEACHER',
}))
