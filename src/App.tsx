import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'

// Route components are dynamically split to minimize bundle footprint and maximize TTFB
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))

import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute'
import { AdminRoute } from './components/auth/AdminRoute'

const RouteLoader = () => (
  <div className="min-h-screen bg-[#050509] flex flex-col items-center justify-center">
    <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-[#FF1025] animate-spin mb-3" />
    <span className="text-xs font-mono text-slate-500 tracking-wider uppercase">Loading ShadowCast...</span>
  </div>
)

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-[#050509] text-white selection:bg-[#FF1025] selection:text-white">
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                {/* Public Landing Page — Once logged in, automatically redirects to /dashboard and never pops up again */}
                <Route
                  path="/"
                  element={
                    <PublicOnlyRoute>
                      <Landing />
                    </PublicOnlyRoute>
                  }
                />

                {/* Authentication Routes — Bounces already authenticated users straight to /dashboard */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <Register />
                    </PublicOnlyRoute>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected User Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Command Center (Secured Secret Path) */}
                <Route path="/kyareadmin/login" element={<Navigate to="/login" replace />} />
                <Route
                  path="/kyareadmin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                {/* Alias /admin redirects to secret path & unified login */}
                <Route path="/admin" element={<Navigate to="/kyareadmin" replace />} />
                <Route path="/admin/login" element={<Navigate to="/login" replace />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

            {/* Global Toast notifications */}
            <Toast />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
