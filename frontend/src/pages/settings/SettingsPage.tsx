/**
 * SettingsPage - 설정 페이지
 * 프로필, 알림, 화면, 계정 관리 탭으로 구성
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { authApi } from '../../api/auth'
import { getErrorMessage } from '../../utils/error'
import toast from 'react-hot-toast'

type Tab = 'profile' | 'notifications' | 'display' | 'account'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  // 알림 토글 상태 (UI only)
  const [notifMaterial, setNotifMaterial] = useState(true)
  const [notifQuiz, setNotifQuiz] = useState(true)
  const [notifCommunity, setNotifCommunity] = useState(false)
  const [notifEmail, setNotifEmail] = useState(false)

  // 화면 설정 (UI only)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  // 계정 탈퇴
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePw, setDeletePw] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const isSocialUser = !!user?.socialProvider && user.socialProvider !== 'LOCAL'

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const handleDeleteAccount = async () => {
    if (!deletePw) { toast.error('비밀번호를 입력해주세요'); return }
    setDeleteLoading(true)
    try {
      const res = await authApi.deleteAccount({ password: deletePw })
      if (!res.data.success) {
        toast.error(res.data.error?.message || '계정 탈퇴에 실패했습니다')
        return
      }
      toast.success('계정이 삭제되었습니다. 이용해주셔서 감사합니다.')
      logout()
      navigate('/login')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, '계정 탈퇴에 실패했습니다'))
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw !== confirmPw) { toast.error('새 비밀번호가 일치하지 않습니다'); return }
    if (newPw.length < 6) { toast.error('비밀번호는 6자 이상이어야 합니다'); return }
    if (currentPw === newPw) { toast.error('현재 비밀번호와 다른 비밀번호를 입력해주세요'); return }

    setPwLoading(true)
    try {
      const res = await authApi.changeMyPassword({ currentPassword: currentPw, newPassword: newPw })
      if (!res.data.success) {
        toast.error(res.data.error?.message || '비밀번호 변경에 실패했습니다')
        return
      }
      toast.success('비밀번호가 변경되었습니다')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, '비밀번호 변경에 실패했습니다'))
    } finally {
      setPwLoading(false)
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: '프로필', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { key: 'notifications', label: '알림 설정', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> },
    { key: 'display', label: '화면 설정', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    { key: 'account', label: '계정 관리', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> },
  ]

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 px-6 py-5">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-xl font-bold text-white">설정</h1>
          <p className="text-indigo-300/80 text-sm mt-0.5">계정 및 앱 환경을 관리합니다</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* 왼쪽 탭 메뉴 */}
        <div className="w-52 shrink-0">
          <nav className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition border-l-2 ${
                  activeTab === tab.key
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">{tab.icon}</svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* ── 프로필 탭 ── */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-800">프로필 정보</h2>
              <div className="flex items-center gap-4">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" loading="lazy" className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-800">{user?.name}</div>
                  <div className="text-sm text-gray-400">{user?.role === 'TEACHER' ? '교강사' : '학생'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">이름</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">{user?.name}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">이메일</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">{user?.email}</div>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                프로필 수정
              </Link>
            </div>
          )}

          {/* ── 알림 설정 탭 ── */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">알림 설정</h2>
              <ToggleRow label="새 강의 자료 알림" desc="강의에 새 자료가 등록되면 알려드립니다" checked={notifMaterial} onChange={setNotifMaterial} />
              <ToggleRow label="퀴즈 결과 알림" desc="퀴즈 채점이 완료되면 알려드립니다" checked={notifQuiz} onChange={setNotifQuiz} />
              <ToggleRow label="커뮤니티 활동 알림" desc="내 게시글에 댓글이나 좋아요가 달리면 알려드립니다" checked={notifCommunity} onChange={setNotifCommunity} />
              <ToggleRow label="이메일 알림 수신" desc="주요 알림을 이메일로도 받습니다" checked={notifEmail} onChange={setNotifEmail} />
            </div>
          )}

          {/* ── 화면 설정 탭 ── */}
          {activeTab === 'display' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">화면 설정</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">테마</label>
                <div className="flex gap-3">
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                        theme === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {t === 'light' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      )}
                      {t === 'light' ? '라이트' : '다크'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">글꼴 크기</label>
                <div className="flex gap-3">
                  {([
                    { key: 'small' as const, label: '작게', sample: 'text-xs' },
                    { key: 'medium' as const, label: '보통', sample: 'text-sm' },
                    { key: 'large' as const, label: '크게', sample: 'text-base' },
                  ]).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFontSize(f.key)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                        fontSize === f.key ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className={f.sample}>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">언어</label>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>한국어</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          )}

          {/* ── 계정 관리 탭 ── */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              {/* 비밀번호 변경 */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">비밀번호 변경</h2>
                <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                  <input type="password" placeholder="현재 비밀번호" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  <input type="password" placeholder="새 비밀번호 (6자 이상)" value={newPw} onChange={e => setNewPw(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  <input type="password" placeholder="새 비밀번호 확인" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  <button type="submit" disabled={pwLoading} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50">
                    {pwLoading ? '변경 중...' : '비밀번호 변경'}
                  </button>
                </form>
              </div>

              {/* 세션 */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">로그아웃</h2>
                <p className="text-sm text-gray-500 mb-3">현재 세션에서 로그아웃합니다.</p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  로그아웃
                </button>
              </div>

              {/* 위험 영역 */}
              <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
                <h2 className="text-lg font-semibold text-red-700 mb-1">계정 탈퇴</h2>
                <p className="text-sm text-red-500/80 mb-3">
                  계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.
                </p>
                <button
                  onClick={() => { setShowDeleteModal(true); setDeletePw('') }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                >
                  계정 탈퇴
                </button>
              </div>

              {/* 계정 탈퇴 확인 모달 */}
              {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteModal(false)}>
                  <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-1">정말 탈퇴하시겠습니까?</h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      모든 강의, 퀴즈, 게시글, 학습 기록이 영구적으로 삭제됩니다.
                    </p>
                    <input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      value={deletePw}
                      onChange={e => setDeletePw(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-400 outline-none mb-4"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {deleteLoading ? '처리 중...' : '탈퇴하기'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** 토글 스위치 Row */
function ToggleRow({ label, desc, checked, onChange }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => { onChange(!checked); toast.success(`${label} ${!checked ? '켜짐' : '꺼짐'}`) }}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}
        style={{ height: 22, width: 40 }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : ''}`}
          style={{ width: 18, height: 18 }}
        />
      </button>
    </div>
  )
}
