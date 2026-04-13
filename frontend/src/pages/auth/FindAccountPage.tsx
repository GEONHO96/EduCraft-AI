/**
 * FindAccountPage - 계정 찾기 페이지 (리뉴얼)
 * 좌측 브랜딩 패널 + 우측 폼 스플릿 레이아웃
 * 탭 구조로 '이메일 찾기'와 '비밀번호 재설정' 기능을 제공한다.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import toast from 'react-hot-toast'

type Tab = 'find-email' | 'reset-password'
type ResetStep = 'request' | 'temp-issued'

export default function FindAccountPage() {
  const [tab, setTab] = useState<Tab>('find-email')

  return (
    <div className="min-h-screen flex bg-white">

      {/* ====== 좌측 브랜딩 패널 ====== */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gray-50 flex-col justify-between py-10 pl-[72px] pr-10">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl" />
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
            계정 정보를<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              안전하게 찾아드립니다
            </span>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-10">
            가입 시 등록한 정보로 이메일을 찾거나<br />
            비밀번호를 재설정할 수 있습니다.
          </p>

          {/* 안내 카드 */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-start gap-3.5 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">이메일(아이디) 찾기</h4>
                <p className="text-xs text-gray-400 mt-0.5">이름을 입력하면 가입된 이메일을 알려드립니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">비밀번호 재설정</h4>
                <p className="text-xs text-gray-400 mt-0.5">임시 비밀번호를 발급받아 새 비밀번호로 변경합니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-gray-400">&copy; 2026 EduCraft AI. All rights reserved.</p>
        </div>
      </div>

      {/* ====== 우측 폼 영역 ====== */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">

          {/* 모바일 로고 */}
          <div className="lg:hidden text-center mb-6">
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">계정 찾기</h1>
            <p className="text-sm text-gray-400 mt-1.5">이메일 또는 비밀번호를 찾을 수 있습니다</p>
          </div>

          {/* 탭 */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => setTab('find-email')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === 'find-email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              이메일 찾기
            </button>
            <button
              onClick={() => setTab('reset-password')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === 'reset-password'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              비밀번호 재설정
            </button>
          </div>

          {tab === 'find-email' ? <FindEmailForm /> : <ResetPasswordForm />}

          {/* 로그인 링크 */}
          <div className="flex items-center gap-3 mt-8">
            <div className="flex-1 h-px bg-gray-200" />
            <Link to="/login" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition">
              로그인으로 돌아가기
            </Link>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="lg:hidden text-center text-xs text-gray-300 mt-8">
            &copy; 2026 EduCraft AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

/** 이메일 찾기 폼 */
function FindEmailForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [emails, setEmails] = useState<string[] | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setEmails(null)
    try {
      const res = await authApi.findEmail({ name })
      if (res.data.success) {
        setEmails(res.data.data)
      } else {
        toast.error((res.data as any).error?.message || '사용자를 찾을 수 없습니다.')
      }
    } catch {
      toast.error('사용자를 찾을 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">
        가입 시 입력한 이름으로 이메일(아이디)을 찾을 수 있습니다.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
              placeholder="가입 시 입력한 이름"
              required
            />
          </div>
        </div>
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
              찾는 중...
            </>
          ) : '이메일 찾기'}
        </button>
      </form>

      {emails && (
        <div className="mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-indigo-800">가입된 이메일</span>
          </div>
          <div className="space-y-1.5">
            {emails.map((email, i) => (
              <div key={i} className="text-sm text-indigo-700 bg-white px-3.5 py-2 rounded-lg font-mono border border-indigo-100">
                {email}
              </div>
            ))}
          </div>
          <p className="text-xs text-indigo-400 mt-2.5">보안을 위해 이메일 일부가 마스킹 처리되어 있습니다.</p>
        </div>
      )}
    </div>
  )
}

/** 비밀번호 재설정 폼 */
function ResetPasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ResetStep>('request')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [inputTempPw, setInputTempPw] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.resetPassword({ email, name })
      if (res.data.success) {
        setStep('temp-issued')
        toast.success('임시 비밀번호가 이메일로 발송되었습니다.')
      } else {
        toast.error((res.data as any).error?.message || '사용자를 찾을 수 없습니다.')
      }
    } catch {
      toast.error('이메일 또는 이름이 일치하지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('새 비밀번호가 일치하지 않습니다.'); return }
    if (newPassword.length < 6) { toast.error('비밀번호는 6자 이상이어야 합니다.'); return }
    setLoading(true)
    try {
      const res = await authApi.changePassword({ email, tempPassword: inputTempPw, newPassword })
      if (res.data.success) {
        toast.success('비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.')
        navigate('/login')
      } else {
        toast.error((res.data as any).error?.message || '비밀번호 변경에 실패했습니다.')
      }
    } catch {
      toast.error('임시 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'request') {
    return (
      <div>
        <p className="text-sm text-gray-500 mb-5">
          가입한 이메일과 이름을 입력하면 임시 비밀번호를 보내드립니다.
        </p>
        <form onSubmit={handleRequestReset} className="space-y-4">
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
                placeholder="가입한 이메일 주소"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                placeholder="가입 시 입력한 이름"
                required
              />
            </div>
          </div>
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
                발송 중...
              </>
            ) : '임시 비밀번호 발급'}
          </button>
        </form>
      </div>
    )
  }

  if (step === 'temp-issued') {
    return (
      <div>
        {/* 발송 완료 안내 */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-indigo-800">이메일 발송 완료</span>
          </div>
          <p className="text-sm text-indigo-700 leading-relaxed">
            <strong>{email}</strong>으로 임시 비밀번호를 발송했습니다.
          </p>
          <p className="text-xs text-indigo-400 mt-1.5">메일이 도착하지 않으면 스팸함을 확인해주세요.</p>
        </div>

        {/* 비밀번호 변경 폼 */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">임시 비밀번호</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <input
                type="text"
                value={inputTempPw}
                onChange={(e) => setInputTempPw(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300 placeholder:font-sans"
                placeholder="이메일로 받은 임시 비밀번호"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">새 비밀번호</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                placeholder="새 비밀번호 (6자 이상)"
                minLength={6}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">새 비밀번호 확인</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-300 focus:ring-red-500/20'
                    : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                }`}
                placeholder="새 비밀번호 다시 입력"
                required
              />
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || (confirmPassword !== '' && confirmPassword !== newPassword)}
            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                변경 중...
              </>
            ) : '비밀번호 변경'}
          </button>
        </form>

        <button
          onClick={() => { setStep('request'); setInputTempPw(''); setNewPassword(''); setConfirmPassword('') }}
          className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          임시 비밀번호 다시 발급받기
        </button>
      </div>
    )
  }

  return null
}
