import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Monitor, Smartphone, Zap, Shield, Sparkles, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
  activePage?: 'login' | 'register' | 'forgot' | 'reset'
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#050509] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Dynamic Lighting Effects & Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Purple glow top-left */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-700/15 rounded-full blur-[140px]" />
        {/* Blue glow right */}
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[150px]" />
        {/* Deep electric red accent bottom-left */}
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-[#FF1025]/10 rounded-full blur-[140px]" />

        {/* Ambient Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all group backdrop-blur-md"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-purple-400" />
          <span>Back to Home</span>
        </Link>

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1025] to-purple-600 p-[1px] shadow-lg shadow-[#FF1025]/20 group-hover:shadow-purple-500/40 transition-all">
            <div className="w-full h-full bg-[#050509] rounded-[7px] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#FF1025] group-hover:scale-110 transition-transform"
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
      </header>

      {/* Main Two-Column Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 sm:py-8 my-auto flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT SECTION ================= */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center pr-6 xl:pr-12">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner text-xs font-semibold text-purple-300 w-fit mb-6 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Studio-Grade Screen Casting Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.15]"
            >
              Your Screen.{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-[#FF1025] bg-clip-text text-transparent">
                Beyond Limits.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-base leading-relaxed mt-4 max-w-xl"
            >
              Experience ultra-low latency 4K 60FPS screen mirroring from iOS and Android devices directly to your Windows desktop with zero perceptible lag and audiophile-grade audio sync.
            </motion.p>

            {/* Abstract Screen-Mirroring Futuristic Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative mt-10 w-full max-w-lg"
            >
              {/* Outer decorative card container */}
              <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-[1px] shadow-2xl shadow-purple-950/30">
                <div className="relative rounded-2xl bg-[#090812]/90 backdrop-blur-xl p-6 overflow-hidden border border-purple-500/20">
                  {/* Subtle holographic beam effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-blue-500/10 pointer-events-none" />

                  {/* Visual Stream Projection Diagram */}
                  <div className="flex items-center justify-between gap-4 py-3 relative z-10">
                    {/* Device A (Mobile) */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-24 rounded-xl bg-slate-900 border-2 border-purple-500/60 p-1.5 flex flex-col justify-between shadow-lg shadow-purple-600/20">
                        <div className="w-5 h-1 rounded-full bg-slate-700 mx-auto" />
                        <div className="w-full flex-1 my-1 rounded-md bg-gradient-to-br from-purple-900/60 to-indigo-950/80 flex items-center justify-center">
                          <Smartphone size={20} className="text-purple-300" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto" />
                      </div>
                      <span className="text-[11px] font-mono font-medium text-slate-300">iPhone / Android</span>
                    </div>

                    {/* Beam Connection with Pulsing Rings & Latency */}
                    <div className="flex-1 flex flex-col items-center px-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 mb-2">
                        <Radio size={14} className="animate-pulse" />
                        <span>0.8 ms Latency</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                          className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#FF1025] to-purple-400 rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full mt-2 text-[10px] font-mono text-slate-500">
                        <span>AirPlay 2</span>
                        <span className="text-purple-400">4K HDR @ 60fps</span>
                        <span>Scrcpy HD</span>
                      </div>
                    </div>

                    {/* Device B (PC Monitor) */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-20 rounded-xl bg-slate-900 border-2 border-blue-500/60 p-1.5 flex flex-col justify-between shadow-lg shadow-blue-600/20">
                        <div className="w-full flex-1 rounded-md bg-gradient-to-br from-blue-950/70 to-slate-900 flex items-center justify-center relative overflow-hidden">
                          <Monitor size={22} className="text-blue-300" />
                          <div className="absolute top-1 right-1.5 text-[8px] font-mono font-bold px-1 rounded bg-[#FF1025] text-white">
                            LIVE
                          </div>
                        </div>
                        <div className="w-6 h-1 rounded-full bg-slate-700 mx-auto mt-1" />
                      </div>
                      <span className="text-[11px] font-mono font-medium text-slate-300">ShadowCast Windows</span>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-800/80 text-left">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <Zap size={14} className="text-[#FF1025]" />
                      <div className="text-[11px] leading-tight font-medium text-slate-300">
                        Hardware NVENC
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <Shield size={14} className="text-purple-400" />
                      <div className="text-[11px] leading-tight font-medium text-slate-300">
                        End-to-End Safe
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <Sparkles size={14} className="text-blue-400" />
                      <div className="text-[11px] leading-tight font-medium text-slate-300">
                        Lossless 320k Sync
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT SECTION (AUTH CARD) ================= */}
          <div className="w-full lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md relative"
            >
              {/* Outer Neon Border */}
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.1] via-purple-500/20 to-white/[0.03] p-[1px] shadow-2xl shadow-black/80">
                {/* Glassmorphic card body */}
                <div className="relative rounded-3xl bg-[#0B0A16]/95 backdrop-blur-2xl p-7 sm:p-9 border border-white/[0.06] overflow-hidden">
                  {/* Subtle top glowing accent line */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ShadowCast by DEGiTEX. All rights reserved.</p>
      </footer>
    </div>
  )
}

