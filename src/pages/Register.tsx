import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuth } from '../hooks/useAuth'

export const Register: React.FC = () => {
  const { user, session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user || session) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, session, navigate])

  return (
    <AuthLayout activePage="register">
      <RegisterForm />
    </AuthLayout>
  )
}

export default Register

