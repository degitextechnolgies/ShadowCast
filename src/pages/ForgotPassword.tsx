import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmed = email.trim()
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setErrorMessage('Please provide a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await resetPassword(trimmed)
      if (res.success) {
        setSuccessMessage(
          `We have sent a password reset link to ${trimmed}. Please check your email to proceed.`
        )
      } else {
        setErrorMessage(res.error || 'Failed to dispatch recovery email. Please try again.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending password reset.'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout activePage="forgot">
      <div className="w-full text-left">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-5"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>

        {/* Heading */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Lock size={12} className="text-purple-400" />
            <span>Account Recovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Enter your registered email address and we'll send you an encrypted link to reset your credentials.
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white text-sm mb-1">Recovery link dispatched</div>
                <p className="leading-relaxed text-emerald-200/90">{successMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors">
                <Mail size={16} />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all duration-200 outline-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white
              bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500
              shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50
              border border-purple-400/30
              flex items-center justify-center gap-2 transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending link...</span>
              </div>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
