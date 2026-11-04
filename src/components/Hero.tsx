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

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="max-w-[480px]">
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-sm text-[#C4C4CC] font-medium tracking-tight uppercase"
          >
            Play. Stream. Mirror. Anywhere.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-base text-[#92929E] max-w-md leading-relaxed"
          >
            Experience seamless screen mirroring and high-performance streaming with ShadowCast. Connect your devices and take your gaming experience anywhere.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#download"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF1025] to-[#D90020] text-white font-bold shadow-xl shadow-[#FF1025]/40 hover:shadow-[#FF1025]/60 hover:-translate-y-1 transition-all duration-300"
            >
              <Download size={18} /> Download Now
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#D90020]/60 text-white font-bold hover:bg-[#FF1025]/10 hover:text-[#FF1025] transition-all duration-300"
            >
              Explore Features <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

