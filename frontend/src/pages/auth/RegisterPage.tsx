/**
 * RegisterPage - 회원가입 페이지 (리뉴얼)
 * 좌측 브랜딩 패널 + 우측 회원가입 폼의 스플릿 레이아웃
 * 이름, 이메일, 비밀번호, 역할(교강사/학생)을 입력받아 회원가입을 처리한다.
 */
import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'TEACHER' | 'STUDENT'>('TEACHER')
  const [grade, setGrade] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  // ====== 이메일 중복 확인 ======
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [emailChecked, setEmailChecked] = useState(false)

  const checkEmail = useCallback(async (emailValue: string) => {
    if (!emailValue || !emailValue.includes('@')) {
      setEmailStatus('idle'); setEmailChecked(false); return
    }
    setEmailStatus('checking')
    try {
      const res = await authApi.checkEmail(emailValue)
      if (res.data.data.exists) { setEmailStatus('taken'); setEmailChecked(false) }
      else { setEmailStatus('available'); setEmailChecked(true) }
    } catch { setEmailStatus('idle'); setEmailChecked(false) }
  }, [])

  useEffect(() => {
    setEmailChecked(false); setEmailStatus('idle')
    const timer = setTimeout(() => checkEmail(email), 500)
    return () => clearTimeout(timer)
  }, [email, checkEmail])

  // ====== 비밀번호 유효성 ======
  const passwordChecks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === passwordConfirm && passwordConfirm.length > 0,
  }
  const isPasswordValid = passwordChecks.length && passwordChecks.letter && passwordChecks.number
  const isGradeValid = role === 'TEACHER' || grade !== ''
  const isFormValid = name.trim() && emailChecked && isPasswordValid && passwordChecks.match && isGradeValid

  // ====== 폼 제출 ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailChecked) { toast.error('이메일 중복 확인이 필요합니다.'); return }
    if (!isPasswordValid) { toast.error('비밀번호 조건을 확인해주세요.'); return }
    if (!passwordChecks.match) { toast.error('비밀번호가 일치하지 않습니다.'); return }
    setLoading(true)
    try {
      const res = await authApi.register({ email, password, name, role, grade: role === 'STUDENT' ? grade : undefined })
      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.accessToken)
        toast.success('회원가입 성공!')
        navigate('/')
      } else {
        toast.error((res.data as any).error?.message || '회원가입 실패')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || '회원가입에 실패했습니다.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">

      {/* ====== 좌측 브랜딩 패널 ====== */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 flex-col justify-between p-10">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* 로고 */}
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">Edu</span>
              <span className="text-xl font-bold text-white">Craft</span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-400 to-violet-400 text-white px-1.5 py-0.5 rounded ml-1 uppercase tracking-wider">AI</span>
            </div>
          </Link>
        </div>

        {/* 중앙 컨텐츠 */}
        <div className="relative flex-1 flex flex-col justify-center -mt-8">
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            교육의 미래를<br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
              함께 만들어가요
            </span>
          </h2>
          <p className="text-indigo-200/50 text-sm leading-relaxed max-w-sm mb-10">
            교강사와 학생 모두를 위한 AI 기반 교육 플랫폼<br />
            지금 가입하고 새로운 학습 경험을 시작하세요.
          </p>

          {/* 가입 혜택 */}
          <div className="space-y-3 max-w-sm">
            {[
              { text: '무제한 AI 커리큘럼 생성', sub: '과목에 맞는 체계적 교육과정 설계' },
              { text: '자동 학습 자료 & 퀴즈 생성', sub: '강의 준비 시간을 획기적으로 단축' },
              { text: '학습 진도 추적 & 분석', sub: '학생별 맞춤 학습 경로 제공' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/[0.04] backdrop-blur-sm rounded-xl p-3.5 border border-white/[0.06]">
                <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/90">{item.text}</h4>
                  <p className="text-xs text-indigo-200/40 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-indigo-300/30">&copy; 2026 EduCraft AI. All rights reserved.</p>
        </div>
      </div>

      {/* ====== 우측 회원가입 폼 ====== */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-[420px]">

          {/* 모바일 로고 */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
            <p className="text-sm text-gray-400 mt-1.5">
              새 계정을 만들어 EduCraft AI를 시작하세요
            </p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                  placeholder="이름을 입력하세요" required
                />
              </div>
            </div>

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
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-10 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                    emailStatus === 'taken'
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                      : emailStatus === 'available'
                      ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-400'
                      : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                  }`}
                  placeholder="name@example.com" required
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {emailStatus === 'checking' && (
                    <svg className="w-4.5 h-4.5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {emailStatus === 'available' && (
                    <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {emailStatus === 'taken' && (
                    <svg className="w-4.5 h-4.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              {emailStatus === 'taken' && <p className="text-xs text-red-500 mt-1">이미 가입된 이메일입니다.</p>}
              {emailStatus === 'available' && <p className="text-xs text-emerald-500 mt-1">사용 가능한 이메일입니다.</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                  placeholder="8자 이상, 영문 + 숫자" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
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
              {password && (
                <div className="flex items-center gap-3 mt-2">
                  <PasswordPill passed={passwordChecks.length} label="8자+" />
                  <PasswordPill passed={passwordChecks.letter} label="영문" />
                  <PasswordPill passed={passwordChecks.number} label="숫자" />
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                  className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                    passwordConfirm && !passwordChecks.match
                      ? 'border-red-300 focus:ring-red-500/20'
                      : passwordConfirm && passwordChecks.match
                      ? 'border-emerald-300 focus:ring-emerald-500/20'
                      : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요" required
                />
              </div>
              {passwordConfirm && !passwordChecks.match && <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>}
              {passwordConfirm && passwordChecks.match && <p className="text-xs text-emerald-500 mt-1">비밀번호가 일치합니다.</p>}
            </div>

            {/* 역할 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">역할</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setRole('TEACHER'); setGrade('') }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                    role === 'TEACHER'
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    role === 'TEACHER' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${role === 'TEACHER' ? 'text-indigo-700' : 'text-gray-700'}`}>교강사</div>
                    <div className="text-[11px] text-gray-400">강의 생성 & 관리</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                    role === 'STUDENT'
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    role === 'STUDENT' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${role === 'STUDENT' ? 'text-emerald-700' : 'text-gray-700'}`}>학생</div>
                    <div className="text-[11px] text-gray-400">강의 수강 & 학습</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 학년 선택 */}
            {role === 'STUDENT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">학년</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <select
                    value={grade} onChange={(e) => setGrade(e.target.value)}
                    className={`w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all appearance-none ${
                      !grade ? 'text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    <option value="">학년을 선택하세요</option>
                    <optgroup label="초등학교">
                      <option value="ELEMENTARY_1">초등학교 1학년</option>
                      <option value="ELEMENTARY_2">초등학교 2학년</option>
                      <option value="ELEMENTARY_3">초등학교 3학년</option>
                      <option value="ELEMENTARY_4">초등학교 4학년</option>
                      <option value="ELEMENTARY_5">초등학교 5학년</option>
                      <option value="ELEMENTARY_6">초등학교 6학년</option>
                    </optgroup>
                    <optgroup label="중학교">
                      <option value="MIDDLE_1">중학교 1학년</option>
                      <option value="MIDDLE_2">중학교 2학년</option>
                      <option value="MIDDLE_3">중학교 3학년</option>
                    </optgroup>
                    <optgroup label="고등학교">
                      <option value="HIGH_1">고등학교 1학년</option>
                      <option value="HIGH_2">고등학교 2학년</option>
                      <option value="HIGH_3">고등학교 3학년</option>
                    </optgroup>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* 가입 버튼 */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  가입 중...
                </>
              ) : '회원가입'}
            </button>
          </form>

          {/* 로그인 */}
          <p className="text-center text-sm text-gray-500 mt-6">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
              로그인
            </Link>
          </p>

          <p className="lg:hidden text-center text-xs text-gray-300 mt-8">
            &copy; 2026 EduCraft AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

/** 비밀번호 조건 필 컴포넌트 */
function PasswordPill({ passed, label }: { passed: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors ${
      passed
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-gray-100 text-gray-400'
    }`}>
      {passed ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" strokeWidth={2} />
        </svg>
      )}
      {label}
    </span>
  )
}
