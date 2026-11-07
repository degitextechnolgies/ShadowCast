import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { LoginForm } from '../components/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'
import { adminAuthService } from '../services/adminAuthService'

export const Login: React.FC = () => {
  const { user, session } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users away from login pages
  useEffect(() => {
    if (adminAuthService.isAdminAuthenticated() || user?.id === 'usr_admin_root') {
      navigate('/kyareadmin', { replace: true })
    } else if (user || session) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, session, navigate])

  return (
    <AuthLayout activePage="login">
      <LoginForm />
    </AuthLayout>
  )
}

export default Login

