import { motion } from 'framer-motion'
import { Search, Link2, MonitorPlay } from 'lucide-react'

const steps = [
  { n: '01', title: 'Discover', desc: 'Find supported devices on your network or through supported connection methods.', icon: Search },
  { n: '02', title: 'Connect', desc: 'Establish a connection using the appropriate supported workflow.', icon: Link2 },
  { n: '03', title: 'Mirror', desc: 'View your device screen on your Windows computer.', icon: MonitorPlay },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold">Three steps to a bigger screen</h2>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center mb-5">
                <s.icon className="text-purple-300" size={22} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-[#A1A1B5] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
