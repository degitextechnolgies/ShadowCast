import React from 'react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { RegisterForm } from '../components/auth/RegisterForm'
import SEO from '../components/SEO'

export const Register: React.FC = () => {
  return (
    <AuthLayout activePage="register">
      <SEO pageKey="register" />
      <RegisterForm />
    </AuthLayout>
  )
}

export default Register

