import { motion } from 'framer-motion'
import { Search, Link2, MonitorPlay } from 'lucide-react'

const steps = [
  { n: '01', title: 'Connect', desc: 'Connect your devices.', icon: Search },
  { n: '02', title: 'Discover', desc: 'Find available screens and devices.', icon: Link2 },
  { n: '03', title: 'Cast', desc: 'Start mirroring and enjoy your content.', icon: MonitorPlay },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold">Your Screen. Your World.</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="text-6xl font-bold text-white/5 absolute top-4 right-6">{s.n}</div>
              <div className="w-12 h-12 rounded-xl bg-[#FF1025]/10 flex items-center justify-center mb-5 border border-[#FF1025]/20">
                <s.icon className="text-[#FF1025]" size={22} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-[#92929E] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
