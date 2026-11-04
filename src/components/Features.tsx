import { motion } from 'framer-motion'
import { Zap, Monitor, Smartphone, Shield, Layers, Gamepad2 } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Ultra-Low Latency', desc: 'Mirror your device over the network.' },
  { icon: Monitor, title: 'High-Quality Streaming', desc: 'Optimized streaming pipeline.' },
  { icon: Smartphone, title: 'Cross-Device Compatibility', desc: 'Connect PC, laptop, phone and tablet.' },
  { icon: Shield, title: 'Secure Connections', desc: 'Protected mirroring sessions.' },
  { icon: Layers, title: 'Seamless Screen Mirroring', desc: 'Multiple device management.' },
  { icon: Gamepad2, title: 'Gaming-Ready Performance', desc: 'Built for gaming responsiveness.' },
]

export default function Features() {
  return (
    <section id="features" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold">Power Beyond the Screen</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 hover:border-[#FF1025]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF1025]/10 flex items-center justify-center mb-4 border border-[#FF1025]/20">
                <f.icon size={18} className="text-[#FF1025]" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-[#92929E]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
