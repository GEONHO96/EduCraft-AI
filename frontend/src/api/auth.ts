import apiClient from './client'

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role: 'TEACHER' | 'STUDENT'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserInfo {
  id: number
  email: string
  name: string
  role: 'TEACHER' | 'STUDENT'
}

export interface AuthToken {
  accessToken: string
  user: UserInfo
}

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<{ success: boolean; data: AuthToken }>('/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<{ success: boolean; data: AuthToken }>('/auth/login', data),

  me: () =>
    apiClient.get<{ success: boolean; data: UserInfo }>('/auth/me'),
}
