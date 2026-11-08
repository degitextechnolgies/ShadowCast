import React from 'react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { LoginForm } from '../components/auth/LoginForm'
import SEO from '../components/SEO'

export const Login: React.FC = () => {
  return (
    <AuthLayout activePage="login">
      <SEO pageKey="login" />
      <LoginForm />
    </AuthLayout>
  )
}

export default Login

