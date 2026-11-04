import { motion } from 'framer-motion'
import { Zap, Shield, Activity } from 'lucide-react'

export default function Performance() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">Performance</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Engineered for smooth streaming</h2>
          <p className="text-[#A1A1B5] leading-relaxed mb-8">
            Shadow Cast focuses on connection stability, efficient resource management, and optimized video decoding. No inflated benchmarks are claimed.
          </p>
          <div className="space-y-4">
            {[
              { icon: Zap, t: 'Streaming architecture', d: 'Efficient data flow from device to display.' },
              { icon: Activity, t: 'Latency optimization', d: 'Reduced overhead in the capture pipeline.' },
              { icon: Shield, t: 'Connection stability', d: 'Robust reconnect and diagnostics.' },
            ].map((x) => (
              <div key={x.t} className="glass rounded-xl p-4 flex gap-4">
                <x.icon className="text-purple-300 shrink-0" />
                <div><div className="font-medium">{x.t}</div><div className="text-sm text-[#A1A1B5]">{x.d}</div></div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-[#A1A1B5]">Data flow</span>
            <span className="text-xs text-green-400">● Active</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            {['Device', 'Capture', 'Decode', 'Display'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-[#10101C] text-sm">{s}</div>
                {i < 3 && <div className="w-6 h-px bg-gradient-to-r from-purple-500 to-blue-500" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
