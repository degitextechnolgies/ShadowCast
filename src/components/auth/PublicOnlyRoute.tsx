import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { adminAuthService } from '../../services/adminAuthService'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

/**
 * PublicOnlyRoute ensures that once an account is logged in,
 * public marketing/landing pages and auth forms will not pop up again.
 * Authenticated admins are routed to /kyareadmin; users are routed to /dashboard.
 */
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { session, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-[#FF1025] animate-spin mb-3" />
        <span className="text-xs font-mono text-slate-500 tracking-wider uppercase">Loading ShadowCast...</span>
      </div>
    )
  }

  // If admin session is active, route to Command Center
  if (adminAuthService.isAdminAuthenticated()) {
    return <Navigate to="/kyareadmin" replace />
  }

  // If already logged in as regular user, redirect straight to dashboard
  if (session || (user && user.id !== 'usr_admin_root')) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default PublicOnlyRoute

