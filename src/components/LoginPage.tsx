import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Zap, ShieldCheck, ArrowRight, Monitor, Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '../context/useAuth'

interface LoginPageProps {
  onBackToHome: () => void
}

export default function LoginPage({ onBackToHome }: LoginPageProps) {
  const { user, signIn, signUp, signInWithProvider, quickDemoLogin, signOut, showToast } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'forgot') {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.')
        return
      }
      setLoading(true)
      await new Promise((r) => setTimeout(r, 500))
      setLoading(false)
      showToast(`Password reset link sent to ${email}`, 'info')
      setMode('signin')
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
      setError('Please enter your display name.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(name, email, password)
      } else {
        await signIn(email, password)
      }
    } catch {
      setError('An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider: 'google' | 'github' | 'discord') => {
    setError(null)
    setSocialLoading(provider)
    try {
      await signInWithProvider(provider)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col justify-between pt-8 pb-12 px-6">
      {/* Top Header Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#120e14] border border-[#2b171c] text-sm text-[#A1A1B5] hover:text-white hover:border-[#FF1025]/50 transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-[#FF1025]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="font-bold text-white tracking-tight">Shadow<span className="text-[#FF1025]">Cast</span></span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-md mx-auto w-full my-8">
        {user ? (
          /* Logged In Dashboard View */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0e0a0e] border border-[#2e181e] rounded-3xl p-8 shadow-2xl shadow-red-950/20"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#241318]">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover bg-red-950/30 ring-2 ring-[#FF1025]/30"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0e0a0e]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-xs text-[#A1A1B5]">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FF1025]/20 text-red-300 text-xs font-semibold">
                  <Sparkles size={12} /> {user.plan}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-xl bg-[#080508] border border-[#201014] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-[#FF1025]" />
                  <div>
                    <div className="text-xs font-semibold text-white">Active Devices</div>
                    <div className="text-[11px] text-[#71718A]">Windows 11 PC · Android 14 Client</div>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">2 Online</span>
              </div>

              <div className="p-4 rounded-xl bg-[#080508] border border-[#201014] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-[#FF1025]" />
                  <div>
                    <div className="text-xs font-semibold text-white">Stream Precision</div>
                    <div className="text-[11px] text-[#71718A]">Hardware NVENC Accelerated</div>
                  </div>
                </div>
                <span className="text-xs text-red-300 font-mono font-bold">4K 60FPS</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onBackToHome}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF1025] to-[#D90020] hover:opacity-95 text-white font-bold text-sm transition-all shadow-lg shadow-[#FF1025]/30 flex items-center justify-center gap-2"
              >
                <span>Launch Shadow Cast Studio</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={signOut}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Sign Out of Account
              </button>
            </div>
          </motion.div>
        ) : (
          /* Sign In / Sign Up Form */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0e0a0e] border border-[#2e181e] rounded-3xl p-8 shadow-2xl shadow-red-950/20"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {mode === 'signin' && 'Sign in to Shadow Cast'}
                {mode === 'signup' && 'Create your Account'}
                {mode === 'forgot' && 'Reset your Password'}
              </h2>
              <p className="text-xs text-[#A1A1B5] mt-1.5">
                {mode === 'signin' && 'Connect to your screen streaming dashboard & paired devices'}
                {mode === 'signup' && 'Join thousands of gamers & creators casting at zero latency'}
                {mode === 'forgot' && 'Enter your email to receive a recovery link'}
              </p>
            </div>

            {/* Quick Demo Login */}
            {mode !== 'forgot' && (
              <button
                type="button"
                onClick={quickDemoLogin}
                className="w-full mb-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-950/30 via-red-900/20 to-red-950/30 border border-[#FF1025]/40 hover:border-[#FF1025] text-red-200 text-xs font-medium transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#FF1025]/30 text-red-300">
                    <Zap size={13} className="fill-[#FF1025] text-[#FF1025]" />
                  </span>
                  <span><strong>1-Click Demo Login</strong> (Instant test)</span>
                </div>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-[#FF1025]" />
              </button>
            )}

            {/* Mode Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-[#140e14] rounded-xl border border-[#2b171c] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin')
                    setError(null)
                  }}
                  className={`py-2 text-xs font-medium rounded-lg transition-all ${
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
                    setMode('signup')
                    setError(null)
                  }}
                  className={`py-2 text-xs font-medium rounded-lg transition-all ${
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
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#A1A1B5] mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71718A]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full bg-[#160f16] border border-[#2e181e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5E5E75] focus:outline-none focus:border-[#FF1025] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#A1A1B5] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71718A]" />
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
                        onClick={() => setMode('forgot')}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71718A]" />
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
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
                    <span>Remember my session</span>
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

            {/* Social Authentication */}
            {mode !== 'forgot' && (
              <>
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#271418]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0e0a0e] px-3 text-[#71718A]">Or sign in with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    disabled={!!socialLoading}
                    onClick={() => handleSocial('google')}
                    className="py-2.5 px-3 rounded-xl bg-[#140e14] hover:bg-[#1f141f] border border-[#271418] flex items-center justify-center gap-2 text-xs font-medium text-white transition-all disabled:opacity-50"
                  >
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    disabled={!!socialLoading}
                    onClick={() => handleSocial('github')}
                    className="py-2.5 px-3 rounded-xl bg-[#140e14] hover:bg-[#1f141f] border border-[#271418] flex items-center justify-center gap-2 text-xs font-medium text-white transition-all disabled:opacity-50"
                  >
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    disabled={!!socialLoading}
                    onClick={() => handleSocial('discord')}
                    className="py-2.5 px-3 rounded-xl bg-[#140e14] hover:bg-[#1f141f] border border-[#271418] flex items-center justify-center gap-2 text-xs font-medium text-white transition-all disabled:opacity-50"
                  >
                    <span>Discord</span>
                  </button>
                </div>
              </>
            )}

            {/* Footer security note */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#71718A]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Direct secure peer-to-peer session authentication</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#71718A]">
        © 2026 Shadow Cast. Low Latency Display Engine.
      </div>
    </div>
  )
}
