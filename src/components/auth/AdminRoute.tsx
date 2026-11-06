import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { adminAuthService } from '../../services/adminAuthService'

interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = adminAuthService.isAdminAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/kyareadmin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AdminRoute

