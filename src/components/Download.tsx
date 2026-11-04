import { motion } from 'framer-motion'
import { FileCheck, HardDrive } from 'lucide-react'

export default function Download() {
  return (
    <section id="download" className="py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-3">Download</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Ready to Enter the Shadow?</h2>
          <p className="text-[#92929E] mb-10">Download ShadowCast and experience seamless screen mirroring.</p>
        </motion.div>
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <div className="font-semibold mb-1">Shadow Cast for Windows</div>
              <div className="text-sm text-[#92929E]">Version: coming soon · Windows 10/11 (x64)</div>
              <div className="text-sm text-[#92929E] mt-1">Installer download will be available once published.</div>
            </div>
            <button disabled className="px-8 py-4 rounded-full bg-[#1a151a] text-[#92929E] font-bold cursor-not-allowed hover:bg-[#1a151a] transition-all">
              Download coming soon
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#92929E]">
            <span className="flex items-center gap-1"><HardDrive size={12} /> File size: TBD</span>
            <span className="flex items-center gap-1"><FileCheck size={12} /> Checksum: TBD</span>
          </div>
        </div>
      </div>
    </section>
  )
}
