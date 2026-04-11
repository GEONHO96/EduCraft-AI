/**
 * LoginPage - 로그인 페이지
 * 이메일/비밀번호 로그인과 소셜 로그인(Google, Kakao, Naver)을 지원한다.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  // 이메일/비밀번호 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.accessToken)
        toast.success('로그인 성공!')
        navigate('/')
      } else {
        toast.error((res.data as any).error?.message || '로그인 실패')
      }
    } catch {
      toast.error('로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth 로그인 (Implicit Flow)
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      toast.error('Google Client ID가 설정되지 않았습니다.')
      return
    }
    const redirectUri = `${window.location.origin}/auth/google/callback`
    const scope = 'openid email profile'
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`
    window.location.href = url
  }

  // 카카오 OAuth 로그인 (Authorization Code Flow)
  const handleKakaoLogin = () => {
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID
    if (!clientId) {
      toast.error('Kakao Client ID가 설정되지 않았습니다.')
      return
    }
    const redirectUri = `${window.location.origin}/auth/kakao/callback`
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
    window.location.href = url
  }

  // 네이버 OAuth 로그인 (Authorization Code Flow)
  const handleNaverLogin = () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
    if (!clientId) {
      toast.error('Naver Client ID가 설정되지 않았습니다.')
      return
    }
    const redirectUri = `${window.location.origin}/auth/naver/callback`
    const state = Math.random().toString(36).substring(2)
    const url = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`
    window.location.href = url
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">EduCraft AI</h1>
          <p className="text-gray-500 mt-2">AI 수업 자료 생성 도우미</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google로 로그인</span>
          </button>

          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg hover:opacity-90 transition"
            style={{ backgroundColor: '#FEE500' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.37 6.24l-1.12 4.16c-.1.36.31.65.62.44l4.94-3.26c.39.04.78.06 1.19.06 5.52 0 10-3.36 10-7.64S17.52 3 12 3z"/>
            </svg>
            <span className="text-sm font-medium" style={{ color: '#3C1E1E' }}>카카오로 로그인</span>
          </button>

          <button
            onClick={handleNaverLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg hover:opacity-90 transition text-white"
            style={{ backgroundColor: '#03C75A' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
            </svg>
            <span className="text-sm font-medium">네이버로 로그인</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6 space-y-2">
          <p>
            계정이 없으신가요?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              회원가입
            </Link>
          </p>
          <p>
            <Link to="/find-account" className="text-gray-400 hover:text-gray-600 hover:underline">
              아이디/비밀번호 찾기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
