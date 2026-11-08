import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </ErrorBoundary>

      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center w-full">
        <div className="max-w-3xl flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-6"
          >
            Shadow Cast
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[#FF1025]/50 text-[10px] font-bold text-[#FF1025] uppercase tracking-wider"
          >
            GAME TO ANY SCREEN
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-6xl md:text-8xl font-extrabold leading-[0.95] tracking-tight text-white"
          >
            SHADOW<span className="text-[#FF1025]">CAST</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 text-lg text-[#A1A1B5] max-w-xl mx-auto">
            Experience seamless screen mirroring with Shadow Cast. Connect your devices and bring your content to life on a bigger screen.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#download" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"><Download size={18} /> Download for Windows</a>
            <a href="#features" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-white font-medium hover:bg-white/5 transition-all">Explore Features <ArrowRight size={18} /></a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
