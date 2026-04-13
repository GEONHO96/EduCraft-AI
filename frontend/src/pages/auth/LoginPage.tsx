/**
 * LoginPage - 로그인 페이지 (미니멀 v3)
 * 깔끔한 화이트 배경, Validation 중심, 최대 여백
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
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  // 실시간 유효성 검사
  const validateEmail = (v: string) => {
    if (!v) return '이메일을 입력해주세요'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return '올바른 이메일 형식이 아닙니다'
    return ''
  }

  const validatePassword = (v: string) => {
    if (!v) return '비밀번호를 입력해주세요'
    if (v.length < 4) return '비밀번호는 4자 이상이어야 합니다'
    return ''
  }

  const handleEmailBlur = () => {
    const err = validateEmail(email)
    setErrors((prev) => ({ ...prev, email: err || undefined }))
  }

  const handlePasswordBlur = () => {
    const err = validatePassword(password)
    setErrors((prev) => ({ ...prev, password: err || undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (emailErr || passErr) {
      setErrors({ email: emailErr || undefined, password: passErr || undefined })
      return
    }
    setErrors({})
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
      const msg = err?.response?.data?.error?.message || '이메일 또는 비밀번호를 확인해주세요.'
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

      {/* 왼쪽 브랜딩 패널 - 몽환적 초록 */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 overflow-hidden" style={{ background: 'linear-gradient(160deg, #064e3b 0%, #065f46 20%, #047857 40%, #059669 60%, #0d9488 80%, #134e4a 100%)' }}>

        {/* 몽환적 배경 오브 - 여러 겹 겹침으로 깊이감 */}
        <div className="absolute inset-0">
          {/* 큰 빛 오브 */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 65%)', animation: 'pulse 4s ease-in-out infinite alternate' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.2) 0%, transparent 60%)', animation: 'pulse 6s ease-in-out infinite alternate-reverse' }} />

          {/* 작은 떠다니는 빛 입자들 */}
          <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-emerald-300/40 rounded-full" style={{ animation: 'float 8s ease-in-out infinite' }} />
          <div className="absolute top-[35%] right-[15%] w-1.5 h-1.5 bg-teal-200/50 rounded-full" style={{ animation: 'float 6s ease-in-out infinite 1s' }} />
          <div className="absolute top-[55%] left-[30%] w-1 h-1 bg-green-300/60 rounded-full" style={{ animation: 'float 7s ease-in-out infinite 2s' }} />
          <div className="absolute top-[70%] right-[25%] w-2.5 h-2.5 bg-emerald-200/30 rounded-full" style={{ animation: 'float 9s ease-in-out infinite 0.5s' }} />
          <div className="absolute top-[25%] left-[60%] w-1 h-1 bg-teal-300/40 rounded-full" style={{ animation: 'float 5s ease-in-out infinite 3s' }} />
          <div className="absolute top-[80%] left-[50%] w-1.5 h-1.5 bg-green-200/50 rounded-full" style={{ animation: 'float 10s ease-in-out infinite 1.5s' }} />

          {/* 나뭇잎 실루엣 장식 */}
          <svg className="absolute bottom-0 left-0 w-full opacity-[0.06]" viewBox="0 0 500 200" fill="white">
            <path d="M0,200 Q50,120 100,180 Q130,100 180,160 Q210,80 260,150 Q290,90 340,140 Q370,70 420,130 Q450,60 500,120 L500,200 Z" />
          </svg>
          <svg className="absolute top-0 right-0 w-40 h-40 opacity-[0.06]" viewBox="0 0 100 100" fill="white">
            <path d="M80,10 Q60,30 50,50 Q40,70 30,90 M80,10 Q70,40 75,60 Q80,80 70,95 M80,10 Q50,20 35,40 Q20,60 15,85" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* 유리 질감 오버레이 */}
        <div className="absolute inset-0 backdrop-blur-[0.5px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)' }} />

        {/* 로고 */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-900/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-white drop-shadow-sm">EduCraft</span>
              <span className="text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded ml-1.5 uppercase tracking-wider border border-white/10">AI</span>
            </div>
          </Link>
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-[28px] font-bold text-white leading-snug drop-shadow-sm">
              배움의 숲에서<br />
              <span className="text-emerald-200">AI와 함께 성장하다</span>
            </h2>
            <p className="text-emerald-100/70 text-sm mt-3 leading-relaxed">
              교강사와 학생 모두를 위한 차세대 교육 플랫폼.<br />
              AI가 만드는 새로운 교육의 경험을 시작하세요.
            </p>
          </div>

          {/* 기능 하이라이트 - 글래스모피즘 카드 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white/[0.07] backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/30 to-green-500/20 border border-emerald-300/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-white">AI 문제 자동 생성</h4>
                <p className="text-xs text-emerald-200/50 mt-0.5">교과서 내용 기반, 다양한 유형의 문제를 즉시 생성</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/[0.07] backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/30 to-cyan-500/20 border border-teal-300/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-white">실시간 학습 분석</h4>
                <p className="text-xs text-emerald-200/50 mt-0.5">학생별 취약점과 성장 추이를 한눈에 파악</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/[0.07] backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/30 to-emerald-500/20 border border-green-300/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-white">커뮤니티 & 협업</h4>
                <p className="text-xs text-emerald-200/50 mt-0.5">교강사 간 자료 공유와 소통으로 교육의 질 향상</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 통계 - 글래스 카드 */}
        <div className="relative z-10 bg-white/[0.07] backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xl font-bold text-white">280+</p>
              <p className="text-[10px] text-emerald-200/50 mt-0.5">AI 생성 문항</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">8과목</p>
              <p className="text-[10px] text-emerald-200/50 mt-0.5">지원 교과</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">24/7</p>
              <p className="text-[10px] text-emerald-200/50 mt-0.5">AI 학습 지원</p>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">

          {/* 모바일 로고 (lg 이하에서만 표시) */}
          <div className="text-center mb-10 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Edu</span>
                <span className="text-xl font-bold text-gray-900">Craft</span>
                <span className="text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase tracking-wider">AI</span>
              </div>
            </Link>
          </div>

          {/* 헤딩 */}
          <div className="mb-8">
            <h1 className="text-[22px] font-bold text-gray-900">로그인</h1>
            <p className="text-sm text-gray-400 mt-1">계정에 로그인하여 학습을 시작하세요</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })) }}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none transition-all placeholder:text-gray-300 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                }`}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">비밀번호</label>
                <Link to="/find-account" className="text-xs text-emerald-600 hover:text-emerald-700 transition font-medium">
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })) }}
                  onBlur={handlePasswordBlur}
                  className={`w-full px-4 py-3 pr-11 bg-gray-50 border rounded-xl text-sm outline-none transition-all placeholder:text-gray-300 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                  }`}
                  placeholder="비밀번호를 입력하세요"
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
              {errors.password && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-2 mt-6"
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
          <p className="text-center text-sm text-gray-400 mt-6">
            아직 계정이 없으신가요?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
              회원가입
            </Link>
          </p>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mt-8 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] text-gray-300 font-medium">간편 로그인</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* 소셜 로그인 - 아이콘 원형 */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleGoogleLogin}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all"
              title="Google 로그인"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              onClick={handleKakaoLogin}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-all"
              style={{ backgroundColor: '#FEE500' }}
              title="Kakao 로그인"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.37 6.24l-1.12 4.16c-.1.36.31.65.62.44l4.94-3.26c.39.04.78.06 1.19.06 5.52 0 10-3.36 10-7.64S17.52 3 12 3z"/>
              </svg>
            </button>

            <button
              onClick={handleNaverLogin}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-all text-white"
              style={{ backgroundColor: '#03C75A' }}
              title="Naver 로그인"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#fff" d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
              </svg>
            </button>
          </div>

          {/* Copyright */}
          <p className="text-center text-[11px] text-gray-300 mt-10">
            &copy; 2026 EduCraft AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
