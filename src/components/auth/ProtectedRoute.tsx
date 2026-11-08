import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { adminAuthService } from '../../services/adminAuthService'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -bottom-20" />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            <div className="absolute w-10 h-10 rounded-full border-2 border-blue-500/30 border-b-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <svg
              className="absolute w-6 h-6 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-sm font-bold tracking-widest uppercase text-white/90">
              Shadow<span className="text-[#FF1025]">Cast</span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Verifying encrypted session...
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // If active admin session, route to Command Center
  if (adminAuthService.isAdminAuthenticated()) {
    return <Navigate to="/kyareadmin" replace />
  }

  // Not authenticated
  if (!session && (!user || user.id === 'usr_admin_root')) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

