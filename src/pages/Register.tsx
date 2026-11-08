import React from 'react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { RegisterForm } from '../components/auth/RegisterForm'

export const Register: React.FC = () => {
  return (
    <AuthLayout activePage="register">
      <RegisterForm />
    </AuthLayout>
  )
}

export default Register

