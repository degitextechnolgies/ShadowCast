import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { lazy, Suspense } from 'react'
const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>

      <div className="absolute inset-0 -z-0 bg-gradient-to-b from-transparent via-[#08090D]/30 to-[#08090D]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm uppercase tracking-[0.3em] text-[#A5A6B3] mb-6">
            Shadow Cast
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="inline-block mb-4 px-3 py-1 rounded-full border border-red-500/40 text-xs text-red-400">
            GAME TO ANY SCREEN
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            SHADOWCAST
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 text-xl text-[#A5A6B3]">
            Play. Stream. Mirror. Anywhere.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 text-lg text-[#A5A6B3] max-w-xl">
            Experience seamless screen mirroring and high-performance streaming with ShadowCast. Connect your devices and take your gaming experience anywhere.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap gap-4">
            <a href="#download" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all">
              <Download size={18} /> Download Now
            </a>
            <a href="#features" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-red-500/40 text-white font-medium hover:bg-red-500/10 transition-all">
              Explore Features <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
        <div />
      </div>
    </section>
  )
}

