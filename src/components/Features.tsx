import { motion } from 'framer-motion'
import { Wifi, Cable, Search, Video, Layers, Sliders, Cpu, Activity, Wrench, Monitor, Settings, HelpCircle } from 'lucide-react'

const features = [
  { icon: Wifi, title: 'Wireless screen mirroring', desc: 'Mirror your device over the network.' },
  { icon: Cable, title: 'USB screen mirroring', desc: 'Connect via cable for a stable session.' },
  { icon: Search, title: 'Device discovery', desc: 'Automatically find supported devices.' },
  { icon: Video, title: 'Screen recording', desc: 'Record your mirrored session.' },
  { icon: Layers, title: 'Multiple device management', desc: 'Manage several devices at once.' },
  { icon: Sliders, title: 'Connection management', desc: 'Control and monitor connections.' },
  { icon: Activity, title: 'Streaming performance', desc: 'Optimized streaming pipeline.' },
  { icon: Cpu, title: 'Video decoding', desc: 'Hardware-accelerated decoding.' },
  { icon: Wrench, title: 'Connection diagnostics', desc: 'Tools to diagnose issues.' },
  { icon: Monitor, title: 'Resolution & quality config', desc: 'Adjust resolution and quality.' },
  { icon: Settings, title: 'User preferences', desc: 'Customize the application.' },
  { icon: HelpCircle, title: 'Troubleshooting tools', desc: 'Built-in help and diagnostics.' },
]

export default function Features() {
  return (
    <section id="features" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold">Built for serious mirroring</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 hover:border-purple-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-purple-300" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-[#A1A1B5]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
