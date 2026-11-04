import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#080810]" />
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/30 blur-[120px]" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="absolute top-20 right-[-120px] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute inset-0 noise opacity-40" />
      </div>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-6">Shadow Cast</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            YOUR SCREEN.<br /><span className="grad-text">WITHOUT LIMITS.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 text-lg text-[#A1A1B5] max-w-xl">
            Experience seamless screen mirroring with Shadow Cast. Connect your devices and bring your content to life on a bigger screen.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap gap-4">
            <a href="#download" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"><Download size={18} /> Download for Windows</a>
            <a href="#features" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-white font-medium hover:bg-white/5 transition-all">Explore Features <ArrowRight size={18} /></a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="relative">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative mx-auto w-full max-w-[520px]">
            <div className="rounded-2xl border border-[#27243A] bg-[#141422] shadow-2xl shadow-purple-900/40 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27243A]">
                <span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-[#A1A1B5]">Shadow Cast</span>
              </div>
              <div className="p-5">
                <div className="rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-[#27243A] p-4">
                  <div className="flex items-center justify-between mb-3"><span className="text-sm font-medium">Connected Devices</span><span className="text-xs text-green-400">● Live</span></div>
                  <div className="space-y-2">
                    {['Pixel 8', 'iPhone 15', 'Galaxy S24'].map((d, i) => (
                      <div key={d} className="flex items-center justify-between rounded-lg bg-[#10101C] px-3 py-2"><span className="text-sm">{d}</span><span className="text-xs text-[#A1A1B5]">{i === 0 ? 'Mirroring' : 'Ready'}</span></div>
                    ))}
                  </div>
                  <div className="mt-4 h-24 rounded-lg bg-black/40 border border-[#27243A] flex items-center justify-center text-xs text-[#A1A1B5]">Mirroring preview</div>
                </div>
              </div>
            </div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -right-6 w-28 h-44 rounded-2xl border border-[#27243A] bg-[#141422] shadow-xl shadow-blue-900/40 overflow-hidden">
              <div className="h-full bg-gradient-to-b from-purple-900/30 to-blue-900/30 flex items-center justify-center text-[10px] text-[#A1A1B5]">Phone</div>
            </motion.div>
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
