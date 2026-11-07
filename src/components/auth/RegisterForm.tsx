import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { PasswordInput } from './PasswordInput'
import { GoogleLoginButton } from './GoogleLoginButton'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { signUp, showToast } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-700' }
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-red-500' }
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' }
      case 3:
        return { score: 3, label: 'Strong', color: 'bg-blue-500' }
      case 4:
        return { score: 4, label: 'Ultra Strong', color: 'bg-emerald-400' }
      default:
        return { score: 0, label: 'Too short', color: 'bg-slate-700' }
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessInfo(null)

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service & Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      const res = await signUp(name.trim(), trimmedEmail, password)
      if (res.success) {
        onSuccess?.()
        navigate('/dashboard', { replace: true })
      } else {
        setErrorMessage(res.error || 'Failed to create account. Please try again.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration error.'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
          <Sparkles size={12} className="text-blue-400" />
          <span>Instant Access</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Join thousands of streamers and pro users casting at sub-millisecond latency.
        </p>
      </div>

      {/* Alerts */}
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

        {successInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3 text-left"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white text-sm mb-1">Check your inbox</div>
              <p className="leading-relaxed text-emerald-200/90">{successInfo}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors">
              <User size={16} />
            </div>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Vance"
              autoComplete="name"
              required
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors">
              <Mail size={16} />
            </div>
            <input
              id="reg-email"
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
        <div>
          <PasswordInput
            id="reg-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
            disabled={loading}
          />

          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2 text-left">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Password strength:</span>
                <span className="font-semibold text-slate-300">{passwordStrength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-all duration-300 ${
                      passwordStrength.score >= step ? passwordStrength.color : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <PasswordInput
          id="reg-confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          disabled={loading}
        />

        {/* Terms and conditions */}
        <div className="pt-1 text-left">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-purple-600"
            />
            <span className="leading-relaxed">
              I agree to the{' '}
              <a href="#faq" className="text-purple-400 hover:text-purple-300 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#faq" className="text-purple-400 hover:text-purple-300 underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="relative w-full py-3 px-4 rounded-xl font-bold text-sm text-white
            bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
            shadow-lg shadow-blue-600/30 hover:shadow-purple-600/50
            border border-blue-400/30
            flex items-center justify-center gap-2 transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating your account...</span>
            </div>
          ) : (
            <>
              <span>Create Account</span>
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
          showToast('Google registration initialized!', 'info')
        }}
        onError={(err) => setErrorMessage(err)}
      />

      {/* Footer Switcher */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Already have an account?{' '}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        ) : (
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}

