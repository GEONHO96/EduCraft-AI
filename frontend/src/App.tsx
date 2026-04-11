import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import SocialCallbackPage from './pages/auth/SocialCallbackPage'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import CoursesPage from './pages/course/CoursesPage'
import CourseDetailPage from './pages/course/CourseDetailPage'
import CurriculumGeneratePage from './pages/curriculum/CurriculumGeneratePage'
import MaterialGeneratePage from './pages/material/MaterialGeneratePage'
import QuizGeneratePage from './pages/quiz/QuizGeneratePage'
import QuizTakePage from './pages/quiz/QuizTakePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/:provider/callback" element={<SocialCallbackPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={
            user?.role === 'TEACHER' ? <TeacherDashboard /> : <StudentDashboard />
          }
        />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="courses/:courseId/generate-curriculum" element={<CurriculumGeneratePage />} />
        <Route path="curriculum/:curriculumId/generate-material" element={<MaterialGeneratePage />} />
        <Route path="curriculum/:curriculumId/generate-quiz" element={<QuizGeneratePage />} />
        <Route path="quiz/:quizId" element={<QuizTakePage />} />
      </Route>
    </Routes>
  )
}

export default App
