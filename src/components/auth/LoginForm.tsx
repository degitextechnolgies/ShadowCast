import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { PasswordInput } from './PasswordInput'
import { GoogleLoginButton } from './GoogleLoginButton'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
  onForgotPasswordClick?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPasswordClick,
}) => {
  const { signIn, showToast } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  // Retrieve destination from router state or default to /dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setInfoMessage(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const res = await signIn(trimmedEmail, password)
      if (res.success) {
        onSuccess?.()
        navigate(from, { replace: true })
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles size={12} className="text-purple-400" />
          <span>Next-Gen Mirroring</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Sign in to access your low-latency streaming hub & paired devices.
        </p>
      </div>

      {/* Alert Notices */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 text-left"
          >
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </motion.div>
        )}

        {infoMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5 text-left"
          >
            <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{infoMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors">
              <Mail size={16} />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="email"
              required
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading}
        />

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-purple-600"
            />
            <span>Remember me</span>
          </label>

          {onForgotPasswordClick ? (
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          ) : (
            <Link
              to="/forgot-password"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="relative w-full py-3 px-4 rounded-xl font-bold text-sm text-white
            bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500
            shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50
            border border-purple-400/30
            flex items-center justify-center gap-2 transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      {/* OR Separator */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-slate-800" />
        <span className="absolute px-3 bg-[#0A0914] text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          or
        </span>
      </div>

      {/* Google OAuth Button */}
      <GoogleLoginButton
        disabled={loading}
        onSuccess={() => {
          showToast('Google authentication initialized!', 'info')
        }}
        onError={(err) => setErrorMessage(err)}
      />

      {/* Footer Switcher */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Create an Account
          </button>
        ) : (
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Create an Account
          </Link>
        )}
      </div>
    </div>
  )
}

