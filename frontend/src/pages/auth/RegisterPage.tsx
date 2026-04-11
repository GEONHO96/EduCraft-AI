/**
 * RegisterPage - 회원가입 페이지
 * 이름, 이메일, 비밀번호, 역할(교강사/학생)을 입력받아 회원가입을 처리한다.
 * 이메일 중복 실시간 확인, 비밀번호 유효성 검사를 제공한다.
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
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  // ====== 이메일 중복 확인 상태 ======
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [emailChecked, setEmailChecked] = useState(false)

  // ====== 이메일 중복 확인 (디바운스 적용) ======
  const checkEmail = useCallback(async (emailValue: string) => {
    if (!emailValue || !emailValue.includes('@')) {
      setEmailStatus('idle')
      setEmailChecked(false)
      return
    }
    setEmailStatus('checking')
    try {
      const res = await authApi.checkEmail(emailValue)
      if (res.data.data.exists) {
        setEmailStatus('taken')
        setEmailChecked(false)
      } else {
        setEmailStatus('available')
        setEmailChecked(true)
      }
    } catch {
      setEmailStatus('idle')
      setEmailChecked(false)
    }
  }, [])

  // 이메일 입력 시 500ms 디바운스 후 중복 확인
  useEffect(() => {
    setEmailChecked(false)
    setEmailStatus('idle')
    const timer = setTimeout(() => checkEmail(email), 500)
    return () => clearTimeout(timer)
  }, [email, checkEmail])

  // ====== 비밀번호 유효성 검사 ======
  const passwordChecks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === passwordConfirm && passwordConfirm.length > 0,
  }
  const isPasswordValid = passwordChecks.length && passwordChecks.letter && passwordChecks.number
  const isFormValid = name.trim() && emailChecked && isPasswordValid && passwordChecks.match

  // ====== 회원가입 폼 제출 ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailChecked) {
      toast.error('이메일 중복 확인이 필요합니다.')
      return
    }
    if (!isPasswordValid) {
      toast.error('비밀번호 조건을 확인해주세요.')
      return
    }
    if (!passwordChecks.match) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.register({ email, password, name, role })
      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.accessToken)
        toast.success('회원가입 성공!')
        navigate('/')
      } else {
        toast.error((res.data as any).error?.message || '회원가입 실패')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || '회원가입에 실패했습니다.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">EduCraft AI</h1>
          <p className="text-gray-500 mt-2">회원가입</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          {/* 이메일 + 중복 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none pr-10 ${
                  emailStatus === 'taken'
                    ? 'border-red-400 focus:ring-red-300'
                    : emailStatus === 'available'
                    ? 'border-green-400 focus:ring-green-300'
                    : 'focus:ring-primary-500'
                }`}
                placeholder="이메일을 입력하세요"
                required
              />
              {/* 상태 아이콘 */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailStatus === 'checking' && (
                  <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {emailStatus === 'available' && (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {emailStatus === 'taken' && (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            {/* 상태 메시지 */}
            {emailStatus === 'taken' && (
              <p className="text-xs text-red-500 mt-1">이미 가입된 이메일입니다.</p>
            )}
            {emailStatus === 'available' && (
              <p className="text-xs text-green-500 mt-1">사용 가능한 이메일입니다.</p>
            )}
          </div>

          {/* 비밀번호 */}
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
            {/* 비밀번호 조건 체크리스트 */}
            {password && (
              <div className="mt-2 space-y-1">
                <PasswordCheck passed={passwordChecks.length} label="8자 이상" />
                <PasswordCheck passed={passwordChecks.letter} label="영문 포함" />
                <PasswordCheck passed={passwordChecks.number} label="숫자 포함" />
              </div>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${
                passwordConfirm && !passwordChecks.match
                  ? 'border-red-400 focus:ring-red-300'
                  : passwordConfirm && passwordChecks.match
                  ? 'border-green-400 focus:ring-green-300'
                  : 'focus:ring-primary-500'
              }`}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {passwordConfirm && !passwordChecks.match && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
            {passwordConfirm && passwordChecks.match && (
              <p className="text-xs text-green-500 mt-1">비밀번호가 일치합니다.</p>
            )}
          </div>

          {/* 역할 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="TEACHER"
                  checked={role === 'TEACHER'}
                  onChange={() => setRole('TEACHER')}
                  className="text-primary-600"
                />
                <span>교강사</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="STUDENT"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                  className="text-primary-600"
                />
                <span>학생</span>
              </label>
            </div>
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

/** 비밀번호 조건 체크 표시 컴포넌트 */
function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {passed ? (
        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      )}
      <span className={`text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}
