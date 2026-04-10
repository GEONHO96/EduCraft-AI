import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-primary-600">
                EduCraft AI
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                대시보드
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900">
                강의 관리
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user?.name} ({user?.role === 'TEACHER' ? '교강사' : '학생'})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
