import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

/**
 * PublicOnlyRoute ensures that once an account is logged in,
 * public marketing/landing pages and auth forms will not pop up again.
 * Authenticated users are automatically routed to /dashboard.
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

  // If already logged in, redirect straight to dashboard
  if (session || user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default PublicOnlyRoute
