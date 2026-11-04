import { useState, useEffect } from 'react'
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
import LoginPage from './components/LoginPage'

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#login' || window.location.pathname === '/login'
        ? 'login'
        : 'home'
    }
    return 'home'
  })

  useEffect(() => {
    // Listen for hash navigation
    const handleHash = () => {
      if (window.location.hash === '#login') {
        setCurrentView('login')
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentView('home')
      }
    }

    window.addEventListener('hashchange', handleHash)

    // Hardware-accelerated, zero-lag anchor scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        if (anchor.hash === '#login') {
          e.preventDefault()
          window.location.hash = '#login'
          setCurrentView('login')
          return
        }

        if (currentView === 'login') {
          setCurrentView('home')
          setTimeout(() => {
            const targetElement = document.querySelector(anchor.hash)
            if (targetElement) {
              const navOffset = 80
              const elementPosition = targetElement.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - navOffset
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
            }
          }, 50)
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
      window.removeEventListener('hashchange', handleHash)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [currentView])

  const navigateToHome = () => {
    window.location.hash = '#home'
    setCurrentView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050507] text-white selection:bg-[#FF1025] selection:text-white">
        {currentView === 'login' ? (
          <LoginPage onBackToHome={navigateToHome} />
        ) : (
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
        )}
        <Toast />
      </div>
    </AuthProvider>
  )
}
