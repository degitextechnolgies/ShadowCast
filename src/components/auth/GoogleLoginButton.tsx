import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

interface GoogleLoginButtonProps {
  onSuccess?: () => void
  onError?: (err: string) => void
  disabled?: boolean
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
}) => {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleClick = async () => {
    if (loading || disabled) return
    setLoading(true)
    try {
      const res = await signInWithGoogle()
      if (!res.success) {
        onError?.(res.error || 'Failed to initialize Google login.')
      } else {
        onSuccess?.()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in error.'
      onError?.(msg)
    } finally {
      // Note: In OAuth redirect, the browser will navigate away, but set loading false if still mounted
      setLoading(false)
    }
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.99 }}
      onClick={handleGoogleClick}
      disabled={disabled || loading}
      className={`relative w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
        bg-slate-900/80 hover:bg-slate-800/90 text-white text-sm font-medium
        border border-slate-700/80 hover:border-purple-500/50
        shadow-lg shadow-black/40 hover:shadow-purple-900/20
        transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
        group overflow-hidden`}
    >
      {/* Subtle futuristic glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {loading ? (
        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.57 0 2.98.54 4.1 1.6l3.07-3.07C17.3 1.7 14.83 1 12 1 7.42 1 3.53 3.6 1.63 7.37l3.68 2.85C6.19 7.41 8.85 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
          />
          <path
            fill="#FBBC05"
            d="M5.31 14.78c-.24-.71-.38-1.47-.38-2.28s.14-1.57.38-2.28L1.63 7.37C.59 9.44 0 11.66 0 14.5s.59 5.06 1.63 7.13l3.68-2.85z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.07.72-2.45 1.16-4.23 1.16-3.15 0-5.81-2.41-6.69-5.22L1.63 15.98C3.53 19.75 7.42 23 12 23z"
          />
        </svg>
      )}

      <span className="relative z-10 tracking-tight">
        {loading ? 'Connecting to Google...' : 'Continue with Google'}
      </span>
    </motion.button>
  )
}

