import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Monitor,
  Zap,
  LogOut,
  ArrowLeft,
  Smartphone,
  Radio,
  Download,
  Cpu,
  CheckCircle2,
  Shield,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const CURRENT_YEAR = new Date().getFullYear()

export const Dashboard: React.FC = () => {
  const { user, signOut, showToast } = useAuth()
  const navigate = useNavigate()
  const [copiedKey, setCopiedKey] = useState(false)

  const licenseToken = user ? `SHADOWCAST-PRO-${user.id.slice(0, 8).toUpperCase()}-PASS` : 'SHADOWCAST-PRO-KEY'

  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseToken)
    setCopiedKey(true)
    showToast('Pro License Key copied to clipboard!', 'success')
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] bg-[#FF1025]/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1025] to-purple-600 p-[1px] shadow-lg shadow-[#FF1025]/20">
              <div className="w-full h-full bg-[#050509] rounded-[7px] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#FF1025]"
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
            </div>
            <span className="font-bold tracking-tight text-white text-base">
              Shadow<span className="text-[#FF1025]">Cast</span>
            </span>
          </Link>

          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            Member Hub
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/kyareadmin"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 hover:text-red-200 transition-colors"
          >
            <Shield size={14} />
            <span>Admin Portal</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-300 hover:text-red-200 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Welcome Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/70 to-slate-900/40 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt={user?.name || 'User'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-purple-950/40 ring-2 ring-purple-500/40 shadow-xl"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-[#050509]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {user?.name || 'ShadowCast Pilot'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF1025]/20 text-red-300 border border-[#FF1025]/30 text-xs font-bold uppercase tracking-wider">
                    PRO ULTRA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{user?.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Member since {user?.joinedAt}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <Radio size={12} className="animate-pulse" /> Active Session
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop App Pairing Token */}
            <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>ShadowCast App License Key</span>
                <span className="text-emerald-400 text-[10px]">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1.5 rounded-lg bg-black/60 font-mono text-xs text-purple-300 font-bold border border-purple-500/30">
                  {licenseToken}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
                  title="Copy Key"
                >
                  {copiedKey ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Paste inside Windows ShadowCast Settings &gt; License to remove watermarks.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Active Devices */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Monitor size={20} />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                2 Connected
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Mirroring Clients</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Paired devices ready for wireless AirPlay &amp; USB Scrcpy mirroring.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Smartphone size={14} className="text-purple-400" /> iPhone 15 Pro
                </span>
                <span className="text-purple-300 font-mono">AirPlay 2</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Smartphone size={14} className="text-blue-400" /> Samsung Galaxy S24
                </span>
                <span className="text-blue-300 font-mono">USB 3.2 Gen 2</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Stream Engine */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Zap size={20} />
              </div>
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                0.8ms Lag
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Encoding Pipeline</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Hardware accelerated low-latency NVENC / QuickSync video renderer.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
                <span className="text-slate-400">Resolution</span>
                <span className="text-white font-mono font-semibold">3840 × 2160 (4K UHD)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
                <span className="text-slate-400">Audio Bitrate</span>
                <span className="text-emerald-400 font-mono font-semibold">320 kbps Opus Studio</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Software Installer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-[#FF1025]/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[#FF1025]/10 text-[#FF1025]">
                  <Cpu size={20} />
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                  v1.8.5
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Desktop App</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Get the latest ShadowCast Windows client package with bundled AirPlay &amp; Scrcpy drivers.
              </p>
            </div>

            <a
              href="#download"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF1025]/20 transition-all"
            >
              <Download size={14} />
              <span>Download ShadowCast Setup</span>
            </a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>© {CURRENT_YEAR} ShadowCast by DEGiTEX. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Dashboard
