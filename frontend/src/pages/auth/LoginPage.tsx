/**
 * LoginPage - 로그인 페이지 (리뉴얼 v2)
 * 좌측 브랜딩 패널 (라이트) + 우측 로그인 폼
 * 소셜 로그인은 하단 배치
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

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
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || '로그인에 실패했습니다.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { toast.error('Google Client ID가 설정되지 않았습니다.'); return }
    const redirectUri = `${window.location.origin}/auth/google/callback`
    const scope = 'openid email profile'
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`
  }

  const handleKakaoLogin = () => {
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID
    if (!clientId) { toast.error('Kakao Client ID가 설정되지 않았습니다.'); return }
    const redirectUri = `${window.location.origin}/auth/kakao/callback`
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
  }

  const handleNaverLogin = () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
    if (!clientId) { toast.error('Naver Client ID가 설정되지 않았습니다.'); return }
    const redirectUri = `${window.location.origin}/auth/naver/callback`
    const state = Math.random().toString(36).substring(2)
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* ====== 좌측 브랜딩 패널 (라이트) ====== */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gray-50 flex-col justify-between py-10 pl-[72px] pr-10">
        {/* 배경 장식 — 은은한 라이트 톤 */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl" />

        {/* 도트 패턴 */}
        <div className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* 로고 */}
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/15 group-hover:rotate-6 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Edu</span>
              <span className="text-xl font-bold text-gray-900">Craft</span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase tracking-wider">AI</span>
            </div>
          </Link>
        </div>

        {/* 중앙 컨텐츠 */}
        <div className="relative flex-1 flex flex-col justify-center -mt-6">
          <h2 className="text-3xl font-bold text-gray-900 leading-snug mb-3">
            AI와 함께하는<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              스마트한 교육의 시작
            </span>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-10">
            커리큘럼 생성부터 학습 자료, 퀴즈까지<br />
            AI가 교육의 모든 과정을 도와드립니다.
          </p>

          {/* 피처 카드 */}
          <div className="space-y-3 max-w-sm">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'AI 커리큘럼 자동 생성',
                desc: '과목과 주차를 입력하면 체계적인 교육과정을 설계합니다',
                gradient: 'from-amber-500 to-orange-500',
                bg: 'bg-amber-50',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                ),
                title: '맞춤형 학습 자료',
                desc: '커리큘럼에 맞는 강의 자료와 핵심 포인트를 자동 생성합니다',
                gradient: 'from-blue-500 to-cyan-500',
                bg: 'bg-blue-50',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                ),
                title: '스마트 퀴즈 시스템',
                desc: '학습 내용을 기반으로 실전 문제를 자동으로 출제합니다',
                gradient: 'from-emerald-500 to-teal-500',
                bg: 'bg-emerald-50',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800">{feature.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 */}
        <div className="relative">
          <p className="text-xs text-gray-400">&copy; 2026 EduCraft AI. All rights reserved.</p>
        </div>
      </div>

      {/* ====== 우측 로그인 폼 ====== */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">

          {/* 모바일 로고 */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Edu</span>
                <span className="text-lg font-bold text-gray-900">Craft</span>
                <span className="text-[9px] font-bold bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-1.5 py-0.5 rounded ml-1">AI</span>
              </div>
            </Link>
          </div>

          {/* 헤딩 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
            <p className="text-sm text-gray-400 mt-1.5">
              계정에 로그인하여 학습을 시작하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">비밀번호</label>
                <Link to="/find-account" className="text-xs text-indigo-600 hover:text-indigo-700 transition font-medium">
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                  placeholder="8자 이상 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  로그인 중...
                </>
              ) : '로그인'}
            </button>
          </form>

          {/* 회원가입 */}
          <p className="text-center text-sm text-gray-500 mt-5">
            아직 계정이 없으신가요?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
              회원가입
            </Link>
          </p>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mt-8 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">소셜 로그인</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* 소셜 로그인 — 하단 배치 */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-600">Google</span>
            </button>

            <button
              onClick={handleKakaoLogin}
              className="flex items-center justify-center gap-2 h-11 rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#FEE500' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.37 6.24l-1.12 4.16c-.1.36.31.65.62.44l4.94-3.26c.39.04.78.06 1.19.06 5.52 0 10-3.36 10-7.64S17.52 3 12 3z"/>
              </svg>
              <span className="text-sm font-medium" style={{ color: '#3C1E1E' }}>Kakao</span>
            </button>

            <button
              onClick={handleNaverLogin}
              className="flex items-center justify-center gap-2 h-11 rounded-xl hover:opacity-90 transition-all text-white"
              style={{ backgroundColor: '#03C75A' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#fff" d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
              </svg>
              <span className="text-sm font-medium">Naver</span>
            </button>
          </div>

          {/* 하단 모바일 */}
          <p className="lg:hidden text-center text-xs text-gray-300 mt-8">
            &copy; 2026 EduCraft AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
