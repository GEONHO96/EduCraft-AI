/**
 * SocialCallbackPage - 소셜 로그인 콜백 처리 페이지
 * OAuth 인증 후 리다이렉트되는 페이지로, 프로바이더별(Google/Kakao/Naver)
 * 토큰을 추출한 뒤 역할 선택 UI를 표시하고 백엔드에 소셜 로그인을 요청한다.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import { getResponseError } from '../../utils/error'
import toast from 'react-hot-toast'

export default function SocialCallbackPage() {
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showRoleSelect, setShowRoleSelect] = useState(false)

  // Google: access token 저장 / Kakao·Naver: authorization code 저장
  const [accessToken, setAccessToken] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [authState, setAuthState] = useState('')

  useEffect(() => {
    handleCallback()
  }, [])

  /**
   * 프로바이더별 OAuth 콜백 처리
   * - Google: implicit flow → hash에서 access_token 추출
   * - Kakao/Naver: authorization code flow → code를 백엔드로 전달 (CORS 우회)
   */
  const handleCallback = async () => {
    if (provider === 'google') {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const token = params.get('access_token') || ''
      if (!token) {
        toast.error('인증 토큰을 받지 못했습니다.')
        navigate('/login')
        return
      }
      setAccessToken(token)
      setShowRoleSelect(true)
    } else if (provider === 'kakao') {
      const code = searchParams.get('code')
      if (!code) {
        toast.error('카카오 인증 코드를 받지 못했습니다.')
        navigate('/login')
        return
      }
      setAuthCode(code)
      setShowRoleSelect(true)
    } else if (provider === 'naver') {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      if (!code || !state) {
        toast.error('네이버 인증 코드를 받지 못했습니다.')
        navigate('/login')
        return
      }
      setAuthCode(code)
      setAuthState(state)
      setShowRoleSelect(true)
    } else {
      toast.error('지원하지 않는 소셜 로그인입니다.')
      navigate('/login')
    }
  }

  // 역할 선택 후 백엔드에 소셜 로그인 요청
  const handleRoleSelect = async (role: 'TEACHER' | 'STUDENT') => {
    try {
      let res

      if (provider === 'google') {
        // Google은 access token을 직접 전달
        res = await authApi.socialLogin({
          accessToken,
          provider: 'GOOGLE',
          role,
        })
      } else {
        // Kakao/Naver는 authorization code를 백엔드로 전달 (백엔드에서 토큰 교환)
        res = await authApi.socialLoginWithCode({
          code: authCode,
          state: authState || undefined,
          provider: provider?.toUpperCase() as 'KAKAO' | 'NAVER',
          role,
          redirectUri: `${window.location.origin}/auth/${provider}/callback`,
        })
      }

      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.accessToken)
        toast.success('로그인 성공!')
        navigate('/')
      } else {
        toast.error(getResponseError(res.data, '로그인 실패'))
        navigate('/login')
      }
    } catch {
      toast.error('소셜 로그인에 실패했습니다.')
      navigate('/login')
    }
  }

  if (showRoleSelect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">역할을 선택하세요</h2>
          <p className="text-gray-500 mb-6">처음 가입하시는 경우 역할을 선택해주세요.<br/>이미 가입된 경우 자동으로 로그인됩니다.</p>
          <div className="space-y-3">
            <button
              onClick={() => handleRoleSelect('TEACHER')}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              교강사로 시작하기
            </button>
            <button
              onClick={() => handleRoleSelect('STUDENT')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              학생으로 시작하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">소셜 로그인 처리 중...</p>
      </div>
    </div>
  )
}
