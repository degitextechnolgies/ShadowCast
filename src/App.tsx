import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductExperience from './components/ProductExperience'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Compatibility from './components/Compatibility'
import Performance from './components/Performance'
import ProductShowcase from './components/ProductShowcase'
import Download from './components/Download'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'

// Premium Authentication Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'

/**
 * Main Landing Page Component
 */
function LandingPage() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // If user navigates to #login hash, redirect to /login route
    if (window.location.hash === '#login') {
      navigate('/login')
      return
    }

    // Hardware-accelerated, zero-lag anchor scrolling for landing sections
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        if (anchor.hash === '#login') {
          e.preventDefault()
          navigate('/login')
          return
        }

        const targetElement = document.querySelector(anchor.hash)
        if (targetElement) {
          e.preventDefault()
          const navOffset = 80
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - navOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [navigate, location])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductExperience />
        <HowItWorks />
        <Features />
        <Compatibility />
        <Performance />
        <ProductShowcase />
        <Download />
        <FAQ />
      </main>
      <Footer />
      <AuthModal />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#050507] text-white selection:bg-[#FF1025] selection:text-white">
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Premium Auth Experience */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Command Center (Secured Secret Path) */}
            <Route path="/kyareadmin/login" element={<AdminLogin />} />
            <Route
              path="/kyareadmin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            {/* Alias /admin redirect to secret path */}
            <Route path="/admin" element={<Navigate to="/kyareadmin" replace />} />
            <Route path="/admin/login" element={<Navigate to="/kyareadmin/login" replace />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Toast notifications */}
          <Toast />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
