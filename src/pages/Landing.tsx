import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductExperience from '../components/ProductExperience'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Compatibility from '../components/Compatibility'
import Performance from '../components/Performance'
import ProductShowcase from '../components/ProductShowcase'
import Download from '../components/Download'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import AuthModal from '../components/AuthModal'

export default function Landing() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, session } = useAuth()

  useEffect(() => {
    // 1. If OAuth hash or code detected on landing page, immediately forward to /auth/callback
    if (
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('refresh_token') ||
      window.location.search.includes('code=')
    ) {
      navigate(`/auth/callback${window.location.search}${window.location.hash}`, { replace: true })
      return
    }

    // 2. If authenticated, bounce straight to dashboard
    if (session || (user && user.id !== 'usr_admin_root')) {
      navigate('/dashboard', { replace: true })
      return
    }

    // 3. If user navigates to #login hash, redirect to /login route
    if (window.location.hash === '#login') {
      navigate('/login')
      return
    }

    // Hardware-accelerated anchor scrolling for landing sections
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

