import { motion } from 'framer-motion'
import { Zap, Shield, Activity } from 'lucide-react'

export default function Performance() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-3">Performance</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Engineered for smooth streaming</h2>
          <p className="text-[#92929E] leading-relaxed mb-8">
            Shadow Cast focuses on connection stability, efficient resource management, and optimized video decoding. No inflated benchmarks are claimed.
          </p>
          <div className="space-y-4">
            {[
              { icon: Zap, t: 'Streaming architecture', d: 'Efficient data flow from device to display.' },
              { icon: Activity, t: 'Latency optimization', d: 'Reduced overhead in the capture pipeline.' },
              { icon: Shield, t: 'Connection stability', d: 'Robust reconnect and diagnostics.' },
            ].map((x) => (
              <div key={x.t} className="glass rounded-xl p-4 flex gap-4">
                <x.icon className="text-[#FF1025] shrink-0" />
                <div><div className="font-medium">{x.t}</div><div className="text-sm text-[#92929E]">{x.d}</div></div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-[#92929E]">Data flow</span>
            <span className="text-xs text-[#FF1025]">● Active</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {['Device', 'Capture', 'Decode', 'Display'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-[#0a080a] text-sm border border-[#1a151a]">{s}</div>
                {i < 3 && <div className="w-6 h-px bg-[#FF1025]" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
