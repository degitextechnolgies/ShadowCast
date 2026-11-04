import { useState } from 'react'
import { motion } from 'framer-motion'

const tabs = ['Dashboard', 'Discovery', 'Mirroring', 'Recording', 'Settings']

export default function ProductShowcase() {
  const [active, setActive] = useState(0)
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">Interface</p>
          <h2 className="text-4xl md:text-5xl font-bold">Inside Shadow Cast</h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${active === i ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'glass text-[#A1A1B5] hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 min-h-[260px]">
          <h3 className="text-xl font-semibold mb-2">{tabs[active]} view</h3>
          <p className="text-[#A1A1B5] text-sm">Representative mockup of the {tabs[active].toLowerCase()} area of the desktop application.</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 rounded-xl bg-[#10101C] border border-[#27243A]" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
