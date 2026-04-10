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
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('accessToken'),

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  isLoggedIn: () => !!get().token,
  isTeacher: () => get().user?.role === 'TEACHER',
}))
