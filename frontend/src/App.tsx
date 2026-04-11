/**
 * App - 최상위 라우팅 컴포넌트
 * 전체 페이지 경로를 정의하고, 인증 여부에 따라 접근을 제어한다.
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import SocialCallbackPage from './pages/auth/SocialCallbackPage'
import FindAccountPage from './pages/auth/FindAccountPage'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import CoursesPage from './pages/course/CoursesPage'
import BrowseCoursesPage from './pages/course/BrowseCoursesPage'
import CourseDetailPage from './pages/course/CourseDetailPage'
import CurriculumGeneratePage from './pages/curriculum/CurriculumGeneratePage'
import MaterialGeneratePage from './pages/material/MaterialGeneratePage'
import QuizGeneratePage from './pages/quiz/QuizGeneratePage'
import QuizTakePage from './pages/quiz/QuizTakePage'
import FeedPage from './pages/sns/FeedPage'
import ProfilePage from './pages/sns/ProfilePage'
import VideoRecommendPage from './pages/recommend/VideoRecommendPage'
import GradeQuizPage from './pages/quiz/GradeQuizPage'
import PricingPage from './pages/subscription/PricingPage'

/** 인증 가드 - 토큰 없으면 로그인 페이지로 리다이렉트 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <Routes>
      {/* ====== 비인증 라우트 (로그인 없이 접근 가능) ====== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/:provider/callback" element={<SocialCallbackPage />} />
      <Route path="/find-account" element={<FindAccountPage />} />

      {/* ====== 인증 필요 라우트 (Layout 안에서 렌더링) ====== */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* 역할에 따라 대시보드 분기 (교강사 / 학생) */}
        <Route
          index
          element={
            user?.role === 'TEACHER' ? <TeacherDashboard /> : <StudentDashboard />
          }
        />
        {/* 강의 관리 */}
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/browse" element={<BrowseCoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        {/* AI 생성 기능 */}
        <Route path="courses/:courseId/generate-curriculum" element={<CurriculumGeneratePage />} />
        <Route path="curriculum/:curriculumId/generate-material" element={<MaterialGeneratePage />} />
        <Route path="curriculum/:curriculumId/generate-quiz" element={<QuizGeneratePage />} />
        {/* 퀴즈 풀기 */}
        <Route path="quiz/:quizId" element={<QuizTakePage />} />
        {/* 강의 추천 */}
        <Route path="recommend" element={<VideoRecommendPage />} />
        {/* 학년별 AI 퀴즈 */}
        <Route path="grade-quiz" element={<GradeQuizPage />} />
        {/* 요금제 */}
        <Route path="pricing" element={<PricingPage />} />
        {/* SNS 커뮤니티 */}
        <Route path="sns/feed" element={<FeedPage />} />
        <Route path="sns/profile/:userId" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
