import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    signIn,
    signUp,
    signInWithProvider,
    quickDemoLogin,
    showToast,
  } = useAuth()

  const [internalMode, setInternalMode] = useState<'signin' | 'signup' | 'forgot' | null>(null)
  const mode = internalMode ?? authModalMode

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    setInternalMode(null)
    setError(null)
    closeAuthModal()
  }, [closeAuthModal])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthModalOpen, handleClose])

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'forgot') {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.')
        return
      }
      setLoading(true)
      await new Promise((r) => setTimeout(r, 600))
      setLoading(false)
      showToast(`Password reset link sent to ${email}`, 'info')
      setInternalMode('signin')
      return
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.')
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your name or gamertag.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(name, email, password)
      } else {
        await signIn(email, password)
      }
      setInternalMode(null)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider: 'google' | 'github' | 'discord') => {
    setError(null)
    setSocialLoading(provider)
    try {
      await signInWithProvider(provider)
      setInternalMode(null)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0e0a0e] border border-[#3b1218] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/50 z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#A1A1B5] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF1025] to-[#D90020] shadow-lg shadow-[#FF1025]/30 text-white font-bold text-xl mb-3">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              {mode === 'signin' && 'Welcome to Shadow Cast'}
              {mode === 'signup' && 'Create your Account'}
              {mode === 'forgot' && 'Reset your Password'}
            </h3>
            <p className="text-xs text-[#A1A1B5] mt-1">
              {mode === 'signin' && 'Sign in to access your mirrors, devices & low-latency profiles'}
              {mode === 'signup' && 'Start seamless 4K screen casting in less than 30 seconds'}
              {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {/* Quick Demo Test Button */}
          {mode !== 'forgot' && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => {
                  quickDemoLogin()
                  setInternalMode(null)
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border border-[#FF1025]/40 hover:border-[#FF1025] text-red-200 text-xs sm:text-sm font-medium transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#FF1025]/30 text-red-300">
                    <Zap size={14} className="fill-[#FF1025] text-[#FF1025]" />
                  </span>
                  <span><strong>1-Click Demo Login</strong> (Instant test)</span>
                </div>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#FF1025]" />
              </button>
            </div>
          )}

          {/* Tab Selector */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-[#140e14] rounded-xl border border-[#2b171c] mb-5">
              <button
                type="button"
                onClick={() => {
                  setInternalMode('signin')
                  setError(null)
                }}
                className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-[#FF1025] to-[#D90020] text-white shadow-md'
                    : 'text-[#A1A1B5] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalMode('signup')
                  setError(null)
                }}
                className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-[#FF1025] to-[#D90020] text-white shadow-md'
                    : 'text-[#A1A1B5] hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-[#A1A1B5] mb-1.5">Full Name / Gamer Tag</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71718A]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-[#160f16] border border-[#2e181e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5E5E75] focus:outline-none focus:border-[#FF1025] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#A1A1B5] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71718A]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#160f16] border border-[#2e181e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5E5E75] focus:outline-none focus:border-[#FF1025] transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#A1A1B5]">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setInternalMode('forgot')}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71718A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#160f16] border border-[#2e181e] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#5E5E75] focus:outline-none focus:border-[#FF1025] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71718A] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A1A1B5] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#2c2a44] bg-[#181829] accent-[#FF1025]"
                  />
                  <span>Stay signed in on this device</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#FF1025] to-[#D90020] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#FF1025]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In to Dashboard'}
                  {mode === 'signup' && 'Create Free Account'}
                  {mode === 'forgot' && 'Send Reset Instructions'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#271418]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0e0a0e] px-3 text-[#71718A]">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  disabled={!!socialLoading}
                  onClick={() => handleSocial('google')}
                  className="py-2.5 px-3 rounded-xl bg-[#140e14] hover:bg-[#1f141f] border border-[#271418] flex items-center justify-center gap-2 text-xs font-medium text-white transition-all disabled:opacity-50"
                >
                  {socialLoading === 'google' ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Google</span>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!!socialLoading}
                  onClick={() => handleSocial('github')}
                  className="py-2.5 px-3 rounded-xl bg-[#140e14] hover:bg-[#1f141f] border border-[#271418] flex items-center justify-center gap-2 text-xs font-medium text-white transition-all disabled:opacity-50"
                >
                  {socialLoading === 'github' ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>GitHub</span>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!!socialLoading}
                  onClick={() => handleSocial('discord')}
                  className="py-2.5 px-3 rounded-xl bg-[#140e14] hover:bg-[#1f141f] border border-[#271418] flex items-center justify-center gap-2 text-xs font-medium text-white transition-all disabled:opacity-50"
                >
                  {socialLoading === 'discord' ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Discord</span>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Footer note */}
          {mode === 'forgot' ? (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setInternalMode('signin')}
                className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#71718A]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Secured with end-to-end device tokenization</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
