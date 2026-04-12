/**
 * 인증 API 모듈
 * 회원가입, 로그인, 소셜 로그인, 계정 찾기/비밀번호 재설정 등 인증 관련 API를 제공한다.
 */
import apiClient from './client'
import type { ApiResponse } from '../types/api'

// ====== 요청/응답 타입 정의 ======
export interface RegisterRequest {
  email: string
  password: string
  name: string
  role: 'TEACHER' | 'STUDENT'
  grade?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SocialLoginRequest {
  accessToken: string
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER'
  role?: 'TEACHER' | 'STUDENT'
}

export interface SocialCodeLoginRequest {
  code: string
  state?: string
  provider: 'KAKAO' | 'NAVER'
  role?: 'TEACHER' | 'STUDENT'
  redirectUri: string
}

export interface UserInfo {
  id: number
  email: string
  name: string
  role: 'TEACHER' | 'STUDENT'
  profileImage?: string
  socialProvider?: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER'
  grade?: string
}

export interface AuthToken {
  accessToken: string
  user: UserInfo
}

// ====== 인증 API 메서드 ======
export const authApi = {
  /** 이메일 중복 확인 */
  checkEmail: (email: string) =>
    apiClient.get<ApiResponse<{ exists: boolean }>>('/auth/check-email', { params: { email } }),

  /** 이메일 회원가입 */
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<AuthToken>>('/auth/register', data),

  /** 이메일 로그인 */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthToken>>('/auth/login', data),

  /** 소셜 로그인 - access token 방식 (Google) */
  socialLogin: (data: SocialLoginRequest) =>
    apiClient.post<ApiResponse<AuthToken>>('/auth/social-login', data),

  /** 소셜 로그인 - authorization code 방식 (Kakao/Naver, CORS 우회) */
  socialLoginWithCode: (data: SocialCodeLoginRequest) =>
    apiClient.post<ApiResponse<AuthToken>>('/auth/social-login/code', data),

  /** 이름으로 가입된 이메일 찾기 */
  findEmail: (data: { name: string }) =>
    apiClient.post<ApiResponse<string[]>>('/auth/find-email', data),

  /** 임시 비밀번호 발급 (이메일로 발송) */
  resetPassword: (data: { email: string; name: string }) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', data),

  /** 임시 비밀번호로 새 비밀번호 설정 */
  changePassword: (data: { email: string; tempPassword: string; newPassword: string }) =>
    apiClient.post<ApiResponse<null>>('/auth/change-password', data),

  /** 현재 로그인된 유저 정보 조회 */
  me: () =>
    apiClient.get<ApiResponse<UserInfo>>('/auth/me'),
}
