import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useGuestProgress } from './hooks/useGuestProgress'
import { lessons } from './data/lessons'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const LearnPage = lazy(() => import('./pages/LearnPage').then((module) => ({ default: module.LearnPage })))
const LessonPage = lazy(() => import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })))
const PracticePage = lazy(() => import('./pages/PracticePage').then((module) => ({ default: module.PracticePage })))
const ProblemDetailPage = lazy(() => import('./pages/ProblemDetailPage').then((module) => ({ default: module.ProblemDetailPage })))
const CompilerPage = lazy(() => import('./pages/CompilerPage').then((module) => ({ default: module.CompilerPage })))
const DailyChallengePage = lazy(() => import('./pages/DailyChallengePage').then((module) => ({ default: module.DailyChallengePage })))
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((module) => ({ default: module.ProgressPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const LoginCallbackPage = lazy(() => import('./pages/LoginCallbackPage').then((module) => ({ default: module.LoginCallbackPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

const AdminRoute = lazy(() => import('./admin/AdminRoute').then((module) => ({ default: module.AdminRoute })))
const AdminLayout = lazy(() => import('./admin/AdminLayout').then((module) => ({ default: module.AdminLayout })))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const UsersPage = lazy(() => import('./admin/pages/UsersPage').then((module) => ({ default: module.UsersPage })))
const McqsPage = lazy(() => import('./admin/pages/McqsPage').then((module) => ({ default: module.McqsPage })))
const McqFormPage = lazy(() => import('./admin/pages/McqFormPage').then((module) => ({ default: module.McqFormPage })))
const QuizzesPage = lazy(() => import('./admin/pages/QuizzesPage').then((module) => ({ default: module.QuizzesPage })))
const QuizFormPage = lazy(() => import('./admin/pages/QuizFormPage').then((module) => ({ default: module.QuizFormPage })))

const Loader = () => <p className="rounded-2xl border border-slate-200 bg-white p-5">Loading...</p>

function App() {
  const { summary, refresh } = useGuestProgress()

  useEffect(() => {
    document.title = 'Codenix — Learn C. Build Logic.'
  }, [])

  const completionPercent = Math.round((summary.lessonsCompleted / lessons.length) * 100)

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <Suspense fallback={<Loader />}>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </Suspense>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="mcqs" element={<McqsPage />} />
        <Route path="mcqs/new" element={<McqFormPage />} />
        <Route path="mcqs/:id" element={<McqFormPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
        <Route path="quizzes/new" element={<QuizFormPage />} />
        <Route path="quizzes/:id" element={<QuizFormPage />} />
      </Route>
      <Route
        path="*"
        element={
          <Layout xp={summary.xp} streak={summary.currentStreak}>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<HomePage completionPercent={completionPercent} />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/learn/:lessonId" element={<LessonPage onProgressUpdate={refresh} />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/practice/:problemId" element={<ProblemDetailPage onProgressUpdate={refresh} />} />
                <Route path="/compiler" element={<CompilerPage />} />
                <Route path="/daily-challenge" element={<DailyChallengePage onProgressUpdate={refresh} />} />
                <Route path="/progress" element={<ProgressPage summary={summary} />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/auth/callback" element={<LoginCallbackPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        }
      >
      </Route>
    </Routes>
  )
}

export default App
