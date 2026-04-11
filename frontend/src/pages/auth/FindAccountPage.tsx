/**
 * FindAccountPage - 계정 찾기 페이지
 * 탭 구조로 '이메일 찾기'와 '비밀번호 재설정' 기능을 제공한다.
 * 비밀번호 재설정은 3단계 플로우: 임시 비밀번호 요청 -> 발급 확인 -> 새 비밀번호 설정
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Link to="/login" className="text-2xl font-bold text-primary-600">EduCraft AI</Link>
          <p className="text-gray-500 mt-1">계정 찾기</p>
        </div>

        {/* 탭 */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setTab('find-email')}
            className={`flex-1 pb-3 text-sm font-medium transition border-b-2 ${
              tab === 'find-email'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            아이디(이메일) 찾기
          </button>
          <button
            onClick={() => setTab('reset-password')}
            className={`flex-1 pb-3 text-sm font-medium transition border-b-2 ${
              tab === 'reset-password'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            비밀번호 재설정
          </button>
        </div>

        {tab === 'find-email' ? <FindEmailForm /> : <ResetPasswordForm />}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-primary-600 hover:underline">로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  )
}

/** 이메일 찾기 폼 - 이름으로 가입된 이메일을 조회 */
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
      <p className="text-sm text-gray-500 mb-4">
        가입 시 입력한 이름으로 이메일(아이디)을 찾을 수 있습니다.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="가입 시 입력한 이름"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition font-medium text-sm"
        >
          {loading ? '찾는 중...' : '이메일 찾기'}
        </button>
      </form>

      {emails && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-blue-800">가입된 이메일</span>
          </div>
          <div className="space-y-1">
            {emails.map((email, i) => (
              <div key={i} className="text-sm text-blue-700 bg-white px-3 py-2 rounded-lg font-mono">
                {email}
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-500 mt-2">보안을 위해 이메일 일부가 마스킹 처리되어 있습니다.</p>
        </div>
      )}
    </div>
  )
}

/** 비밀번호 재설정 폼 - 2단계 플로우 (이메일 발송 요청 -> 임시 비밀번호 입력 + 새 비밀번호 변경) */
function ResetPasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ResetStep>('request')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [inputTempPw, setInputTempPw] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1: 이메일+이름으로 임시 비밀번호 이메일 발송 요청
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

  // Step 2: 이메일로 받은 임시 비밀번호 입력 후 새 비밀번호로 변경
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.changePassword({
        email,
        tempPassword: inputTempPw,
        newPassword,
      })
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
        <p className="text-sm text-gray-500 mb-4">
          가입한 이메일과 이름을 입력하면 해당 이메일로 임시 비밀번호를 보내드립니다.
        </p>
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="가입한 이메일 주소"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="가입 시 입력한 이름"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition font-medium text-sm"
          >
            {loading ? '발송 중...' : '임시 비밀번호 발급'}
          </button>
        </form>
      </div>
    )
  }

  if (step === 'temp-issued') {
    return (
      <div>
        {/* 이메일 발송 완료 안내 */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-blue-800">이메일 발송 완료</span>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            <strong>{email}</strong>으로 임시 비밀번호를 발송했습니다.<br />
            이메일을 확인한 후, 아래에서 새 비밀번호를 설정해주세요.
          </p>
          <p className="text-xs text-blue-500 mt-2">
            메일이 도착하지 않으면 스팸함을 확인해주세요.
          </p>
        </div>

        {/* 비밀번호 변경 폼 */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">임시 비밀번호</label>
            <input
              type="text"
              value={inputTempPw}
              onChange={(e) => setInputTempPw(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition font-mono"
              placeholder="이메일로 받은 임시 비밀번호"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="새 비밀번호 (6자 이상)"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                confirmPassword && confirmPassword !== newPassword ? 'border-red-300 bg-red-50' : ''
              }`}
              placeholder="새 비밀번호 다시 입력"
              required
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || (confirmPassword !== '' && confirmPassword !== newPassword)}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition font-medium text-sm"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>

        <button
          onClick={() => { setStep('request'); setInputTempPw(''); setNewPassword(''); setConfirmPassword('') }}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          임시 비밀번호 다시 발급받기
        </button>
      </div>
    )
  }

  return null
}
