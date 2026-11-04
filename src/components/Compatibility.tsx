import { motion } from 'framer-motion'
import { Smartphone, Tablet, Monitor } from 'lucide-react'

const groups = [
  { title: 'Android', items: ['Wireless mirroring', 'USB mirroring (where supported)'] },
  { title: 'iPhone', items: ['Wireless mirroring', 'USB mirroring (where supported)'] },
  { title: 'Windows', items: ['Host application', 'Device discovery', 'Recording'] },
]

export default function Compatibility() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">Compatibility</p>
          <h2 className="text-4xl md:text-5xl font-bold">Supported platforms</h2>
          <p className="text-[#A1A1B5] mt-4 max-w-2xl mx-auto">Support varies by device and OS version. Compatibility is verified against actual tested devices.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                {i === 0 && <Smartphone className="text-purple-300" />}
                {i === 1 && <Tablet className="text-purple-300" />}
                {i === 2 && <Monitor className="text-purple-300" />}
                <h3 className="text-xl font-semibold">{g.title}</h3>
              </div>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="text-sm text-[#A1A1B5] flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400" />{it}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
