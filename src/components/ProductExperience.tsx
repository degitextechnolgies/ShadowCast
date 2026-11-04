import { motion } from 'framer-motion'

export default function ProductExperience() {
  const items = ['Device discovery', 'Available device list', 'Connection status', 'Mirroring preview', 'Recording controls', 'Application settings']
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-3">Product experience</p>
          <h2 className="text-4xl md:text-5xl font-bold">See Shadow Cast in action</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div key={it} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-6">
              <div className="h-28 rounded-xl bg-[#0a080a] border border-[#1a151a] mb-4 flex items-center justify-center text-xs text-[#92929E]">{it}</div>
              <div className="font-medium">{it}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
