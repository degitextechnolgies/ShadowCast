import { motion } from 'framer-motion'
import { FileCheck, HardDrive } from 'lucide-react'

export default function Download() {
  return (
    <section id="download" className="py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">Download</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">READY TO CAST?</h2>
          <p className="text-[#A1A1B5] mb-10">Bring your devices together with Shadow Cast.</p>
        </motion.div>
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <div className="font-semibold mb-1">Shadow Cast for Windows</div>
              <div className="text-sm text-[#A1A1B5]">Version: coming soon · Windows 10/11 (x64)</div>
              <div className="text-sm text-[#A1A1B5] mt-1">Installer download will be available once published.</div>
            </div>
            <button disabled className="px-7 py-3.5 rounded-full bg-white/10 text-[#A1A1B5] font-medium cursor-not-allowed">
              Download coming soon
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#A1A1B5]">
            <span className="flex items-center gap-1"><HardDrive size={12} /> File size: TBD</span>
            <span className="flex items-center gap-1"><FileCheck size={12} /> Checksum: TBD</span>
          </div>
        </div>
      </div>
    </section>
  )
}
