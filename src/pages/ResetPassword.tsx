import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useAuth } from '../hooks/useAuth'
import SEO from '../components/SEO'

export const ResetPassword: React.FC = () => {
  const { updatePassword, showToast } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await updatePassword(password)
      if (res.success) {
        setIsDone(true)
        showToast('Password updated successfully! Please sign in.', 'success')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      } else {
        setErrorMessage(res.error || 'Failed to update password. Your recovery link may have expired.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating password.'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout activePage="reset">
      <SEO pageKey="resetPassword" />
      <div className="w-full text-left">
        {/* Heading */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <ShieldCheck size={12} className="text-blue-400" />
            <span>Set New Credentials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            New Password
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose a strong password to secure your ShadowCast streaming sessions.
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

          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white text-sm mb-1">Password updated!</div>
                <p className="leading-relaxed text-emerald-200/90">
                  Redirecting you to the sign-in page...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            id="new-password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
            disabled={loading || isDone}
          />

          <PasswordInput
            id="confirm-new-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            required
            disabled={loading || isDone}
          />

          <motion.button
            type="submit"
            disabled={loading || isDone}
            whileHover={{ scale: loading || isDone ? 1 : 1.01 }}
            whileTap={{ scale: loading || isDone ? 1 : 0.99 }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
              shadow-lg shadow-blue-600/30 hover:shadow-purple-600/50
              border border-blue-400/30
              flex items-center justify-center gap-2 transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating password...</span>
              </div>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
            Cancel and Return to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ResetPassword

