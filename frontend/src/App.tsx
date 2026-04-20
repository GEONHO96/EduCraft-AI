/**
 * App - 최상위 라우팅 컴포넌트
 * 전체 페이지 경로를 정의하고, 인증 여부에 따라 접근을 제어한다.
 * 모든 페이지는 React.lazy로 동적 import하여 초기 번들 크기를 최소화한다.
 */
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import PageLoading from './components/PageLoading'

// ====== 비인증 페이지 (lazy) ======
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const SocialCallbackPage = lazy(() => import('./pages/auth/SocialCallbackPage'))
const FindAccountPage = lazy(() => import('./pages/auth/FindAccountPage'))

// ====== 인증 필요 페이지 (lazy) ======
const TeacherDashboard = lazy(() => import('./pages/dashboard/TeacherDashboard'))
const StudentDashboard = lazy(() => import('./pages/dashboard/StudentDashboard'))
const CoursesPage = lazy(() => import('./pages/course/CoursesPage'))
const BrowseCoursesPage = lazy(() => import('./pages/course/BrowseCoursesPage'))
const CourseDetailPage = lazy(() => import('./pages/course/CourseDetailPage'))
const CurriculumGeneratePage = lazy(() => import('./pages/curriculum/CurriculumGeneratePage'))
const MaterialGeneratePage = lazy(() => import('./pages/material/MaterialGeneratePage'))
const QuizGeneratePage = lazy(() => import('./pages/quiz/QuizGeneratePage'))
const QuizTakePage = lazy(() => import('./pages/quiz/QuizTakePage'))
const FeedPage = lazy(() => import('./pages/sns/FeedPage'))
const ProfilePage = lazy(() => import('./pages/sns/ProfilePage'))
const VideoRecommendPage = lazy(() => import('./pages/recommend/VideoRecommendPage'))
const GradeQuizPage = lazy(() => import('./pages/quiz/GradeQuizPage'))
const PricingPage = lazy(() => import('./pages/subscription/PricingPage'))
const ProfileEditPage = lazy(() => import('./pages/auth/ProfileEditPage'))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'))
// 학습 진도 & 수료증
const MyProgressPage = lazy(() => import('./pages/progress/MyProgressPage'))
const CourseProgressDetailPage = lazy(() => import('./pages/progress/CourseProgressDetailPage'))
const MyWeaknessPage = lazy(() => import('./pages/progress/MyWeaknessPage'))
const CertificateListPage = lazy(() => import('./pages/certificate/CertificateListPage'))
const CertificateDetailPage = lazy(() => import('./pages/certificate/CertificateDetailPage'))
// 교사 모니터링
const CourseMonitoringPage = lazy(() => import('./pages/teacher/CourseMonitoringPage'))

/** 인증 가드 - 토큰 없으면 로그인 페이지로 리다이렉트 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <Suspense fallback={<PageLoading />}>
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
          {/* 프로필 & 설정 */}
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* SNS 커뮤니티 */}
          <Route path="sns/feed" element={<FeedPage />} />
          <Route path="sns/profile/:userId" element={<ProfilePage />} />
          {/* 학습 진도 & 수료증 */}
          <Route path="progress/me" element={<MyProgressPage />} />
          <Route path="progress/courses/:courseId" element={<CourseProgressDetailPage />} />
          <Route path="progress/weakness" element={<MyWeaknessPage />} />
          <Route path="certificates" element={<CertificateListPage />} />
          <Route path="certificates/:certificateNumber" element={<CertificateDetailPage />} />
          {/* 교사 모니터링 */}
          <Route path="teacher/courses/:courseId/monitoring" element={<CourseMonitoringPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
