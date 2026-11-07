import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { adminAuthService } from '../services/adminAuthService'
import { useAuth } from '../hooks/useAuth'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useAuth()

  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const from = (location.state as any)?.from?.pathname || '/kyareadmin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      const res = await adminAuthService.loginAdmin(email, passcode)
      if (!res.success) {
        setErrorMessage(res.error || 'Access denied.')
        showToast(res.error || 'Authentication failed', 'error')
        setLoading(false)
        return
      }

      showToast(`Welcome, ${res.session?.name || 'Administrator'}! Level-5 Clearance Granted.`, 'success')
      navigate(from, { replace: true })
    } catch {
      setErrorMessage('An unexpected cryptographic error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#FF1025] selection:text-white">
      {/* Background Cinematic Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1025] to-purple-600 p-[1px] shadow-lg shadow-[#FF1025]/30">
            <div className="w-full h-full bg-[#050509] rounded-[7px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#FF1025]" />
            </div>
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            Shadow<span className="text-[#FF1025]">Cast</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Exit to Website</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-[#0c0c14]/90 border border-slate-800/90 p-7 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Top Decorative Scanning Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF1025] to-transparent animate-pulse" />

          {/* Header Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#FF1025] mb-3 shadow-lg shadow-red-500/10">
              <Shield size={28} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mb-1.5">
              RESTRICTED AREA • SEC-LVL 5
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Command Center Login</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Authorize with verified administrator credentials or Supabase Auth to access stream relays and license nodes.
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase GoTrue Engine (snnziouhxitblbzybesg)</span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 mb-5"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Administrator Identity / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF1025] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="admin"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF1025] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF1025] via-red-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF1025]/20 cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        <p>ShadowCast Security Gateway • AES-256 GCM • Zero-Trust Access Control</p>
      </footer>
    </div>
  )
}

export default AdminLogin

