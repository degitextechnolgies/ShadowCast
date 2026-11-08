import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Radio, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050509] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FF1025] selection:text-white">
      <SEO
        pageKey="notFound"
        title="404 Page Not Found — ShadowCast"
        description="The requested resource or mirroring route could not be found on the ShadowCast network."
        robots="noindex, nofollow"
      />

      {/* Atmospheric Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1025] to-purple-600 p-[1px] shadow-lg shadow-[#FF1025]/30">
            <div className="w-full h-full bg-[#050509] rounded-[7px] flex items-center justify-center">
              <span className="text-[#FF1025] font-black text-sm">S</span>
            </div>
          </div>
          <span className="font-extrabold tracking-tight text-base text-white">
            SHADOW<span className="text-[#FF1025]">CAST</span>
          </span>
        </Link>
      </header>

      {/* Center 404 Hero */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-6">
            <ShieldAlert size={14} />
            <span>ERROR 404 • ROUTE UNREACHABLE</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight mb-4">
            4<span className="text-[#FF1025]">0</span>4
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Signal Lost in the Shadows
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-md mx-auto">
            The page or stream endpoint you are attempting to access does not exist or has been relocated to another cluster node.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF1025] to-[#B30018] text-white font-bold text-xs shadow-lg shadow-[#FF1025]/30 hover:opacity-90 transition-all"
            >
              <ArrowLeft size={14} />
              <span>Return to Headquarters</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Radio size={14} className="text-purple-400" />
              <span>Pilot Sign In</span>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ShadowCast by DEGiTEX. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default NotFound
