import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useAuth()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const handledRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const processOAuthCallback = async () => {
      if (handledRef.current) return

      try {
        // 1. Inspect URL search and hash fragments for OAuth errors
        const searchParams = new URLSearchParams(window.location.search)
        const hashRaw = window.location.hash.startsWith('#')
          ? window.location.hash.substring(1)
          : window.location.hash
        const hashParams = new URLSearchParams(hashRaw)

        const errorCode = searchParams.get('error') || hashParams.get('error')
        const errorDesc = searchParams.get('error_description') || hashParams.get('error_description')
        const rawError = errorDesc || errorCode

        if (rawError) {
          handledRef.current = true
          const friendly =
            (errorCode && errorCode.toLowerCase().includes('denied')) ||
            (errorDesc && (errorDesc.toLowerCase().includes('denied') || errorDesc.toLowerCase().includes('cancel')))
              ? 'Google sign-in request was cancelled or access denied.'
              : rawError.replace(/\+/g, ' ')
          if (mounted) {
            setErrorMsg(friendly)
            showToast(friendly, 'error')
          }
          return
        }

        // 2. Handle PKCE code exchange if present in query parameters
        const code = searchParams.get('code')
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            handledRef.current = true
            if (mounted) {
              setErrorMsg(error.message)
              showToast(error.message, 'error')
            }
            return
          }
          if (data?.session) {
            handledRef.current = true
            if (mounted) {
              showToast('Authenticated successfully with Google!', 'success')
              navigate('/dashboard', { replace: true })
            }
            return
          }
        }

        // 3. Inspect existing / implicit session
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          handledRef.current = true
          if (mounted) {
            setErrorMsg(error.message)
            showToast(error.message, 'error')
          }
          return
        }

        if (data?.session) {
          handledRef.current = true
          if (mounted) {
            showToast('Authenticated successfully with Google!', 'success')
            navigate('/dashboard', { replace: true })
          }
          return
        }

        // 4. Listen for SIGNED_IN event from Supabase auth listener
        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
          if (!handledRef.current && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
            handledRef.current = true
            if (mounted) {
              showToast('Signed in successfully!', 'success')
              navigate('/dashboard', { replace: true })
            }
          }
        })

        // 5. Fallback safety timeout
        const timeout = setTimeout(async () => {
          if (!handledRef.current && mounted) {
            const { data: fallbackData } = await supabase.auth.getSession()
            if (fallbackData?.session) {
              handledRef.current = true
              navigate('/dashboard', { replace: true })
            } else {
              navigate('/login', { replace: true })
            }
          }
        }, 2500)

        return () => {
          sub?.subscription?.unsubscribe()
          clearTimeout(timeout)
        }
      } catch (err: unknown) {
        if (mounted) {
          const msg = err instanceof Error ? err.message : 'OAuth verification error'
          setErrorMsg(msg)
          showToast(msg, 'error')
        }
      }
    }

    processOAuthCallback()

    return () => {
      mounted = false
    }
  }, [navigate, showToast])

  return (
    <div className="min-h-screen bg-[#050509] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Glow backgrounds */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full text-center">
        {errorMsg ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-slate-900/90 border border-red-500/30 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Authentication Failed</h3>
            <p className="text-xs text-red-200/80 mb-5 leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Return to Sign In
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-950/40"
          >
            {/* Spinning loader */}
            <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <div
                className="absolute w-10 h-10 rounded-full border-2 border-blue-500/30 border-b-blue-400 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
              />
              <svg
                className="absolute w-6 h-6 text-[#FF1025]"
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

            <h3 className="text-lg font-bold text-white tracking-tight">Authenticating with Google</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Securing session tokens &amp; redirecting to dashboard...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AuthCallback

