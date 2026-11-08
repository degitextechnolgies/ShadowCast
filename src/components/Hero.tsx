import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </ErrorBoundary>

      {/* Cinematic Vignette Overlays for Maximum Left-Side Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/95 via-[#050507]/60 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-6rem)]">
        {/* Left Column: Words and Actions strictly on the LEFT */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start text-left max-w-xl py-6 lg:py-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-[#FF1025]/40 text-[#FF1025] text-xs font-semibold uppercase tracking-wider w-fit mb-5 backdrop-blur-md shadow-lg shadow-black/40"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF1025] animate-pulse" />
            <span className="tracking-widest">GAME TO ANY SCREEN • 0.8ms ENGINE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-6xl sm:text-7xl xl:text-8xl font-black leading-[0.92] tracking-tight text-white mb-6 uppercase"
          >
            SHADOW<span className="text-[#FF1025]">CAST</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl mb-8 text-left"
          >
            Experience seamless screen mirroring with Shadow Cast. Connect your devices and bring your content to life on a bigger screen.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <a
              href="#download"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF1025] via-[#E6001F] to-[#B30018] text-white font-bold text-sm shadow-xl shadow-[#FF1025]/30 hover:shadow-[#FF1025]/60 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span>Download for Windows</span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-sm backdrop-blur-md transition-all duration-200 group"
            >
              <span>Explore Features</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#FF1025]" />
            </a>
          </motion.div>

          {/* Hardware Specs & Engine Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-md"
          >
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">0.8<span className="text-xs text-[#FF1025] ml-0.5">ms</span></div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Pipeline Latency</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">4K<span className="text-xs text-[#FF1025] ml-0.5">120FPS</span></div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Studio Fidelity</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">NVENC<span className="text-xs text-[#FF1025] ml-0.5">AV1</span></div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Hardware Accelerated</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Clean empty stage reserved for the 3D Samurai & Moon */}
        <div className="hidden lg:block lg:col-span-5 h-full pointer-events-none" />
      </div>
    </section>
  )
}
