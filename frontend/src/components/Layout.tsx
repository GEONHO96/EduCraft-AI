/**
 * Layout - 인증된 사용자의 공통 레이아웃
 * 상단 네비게이션 바(데스크톱/모바일), 유저 정보, 로그아웃 기능을 포함한다.
 * 하위 라우트는 <Outlet />으로 렌더링된다.
 */
import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import ChatBot from './ChatBot'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // 로그아웃 처리: 상태 초기화 후 로그인 페이지로 이동
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 네비게이션 메뉴 항목 정의
  const navItems = [
    { path: '/', label: '대시보드', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { path: '/courses', label: '강의 관리', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { path: '/courses/browse', label: '강의 탐색', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    { path: '/grade-quiz', label: 'AI 퀴즈', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )},
    { path: '/recommend', label: '강의 추천', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { path: '/sns/feed', label: '커뮤니티', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    )},
    { path: '/pricing', label: '요금제', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { path: '/settings', label: '설정', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ]

  // 현재 경로와 메뉴 항목의 활성 상태를 비교
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/grade-quiz') return location.pathname.startsWith('/grade-quiz')
    if (path === '/recommend') return location.pathname.startsWith('/recommend')
    if (path === '/sns/feed') return location.pathname.startsWith('/sns')
    if (path === '/pricing') return location.pathname.startsWith('/pricing')
    if (path === '/settings') return location.pathname.startsWith('/settings')
    if (path === '/courses/browse') return location.pathname === '/courses/browse'
    if (path === '/courses') return location.pathname.startsWith('/courses') && !location.pathname.startsWith('/courses/browse')
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* 로고 + 네비게이션 */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                  </div>
                </div>
                <span className="hidden sm:flex items-baseline text-lg font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Edu</span>
                  <span className="text-gray-800">Craft</span>
                  <span className="text-[10px] font-bold text-violet-500 ml-1 bg-violet-50 px-1.5 py-0.5 rounded-md leading-none self-center">AI</span>
                </span>
              </Link>

              {/* 데스크톱 메뉴 */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 유저 정보 + 로그아웃 */}
            <div className="flex items-center space-x-3">
              <Link
                to="/profile/edit"
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition cursor-pointer"
                title="프로필 수정"
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium text-gray-700">{user?.name}</span>
                  <span className="ml-1 text-xs text-gray-400">
                    {user?.role === 'TEACHER' ? '교강사' : '학생'}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-sm text-gray-400 hover:text-gray-600 transition p-2 rounded-lg hover:bg-gray-100"
                title="로그아웃"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 pb-3 pt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              to="/profile/edit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )}
              <span>{user?.name} ({user?.role === 'TEACHER' ? '교강사' : '학생'})</span>
              <svg className="w-4 h-4 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>
          </div>
        )}
      </nav>

      {/* ====== 메인 콘텐츠 영역 (하위 라우트 렌더링) ====== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 로그아웃 확인 모달 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">로그아웃</h3>
            <p className="text-sm text-gray-500 mb-5">정말 로그아웃 하시겠습니까?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI 챗봇 위젯 */}
      <ChatBot />
    </div>
  )
}
