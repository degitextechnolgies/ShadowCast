import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'What is Shadow Cast?', a: 'Shadow Cast is a Windows application for screen mirroring from supported devices.' },
  { q: 'Which devices are supported?', a: 'Android and iPhone devices, connected wirelessly or via USB where supported.' },
  { q: 'How does wireless mirroring work?', a: 'Devices are discovered on the network and connected using supported workflows.' },
  { q: 'Can I connect using USB?', a: 'Yes, where the device and driver support it.' },
  { q: 'Does it support iPhone?', a: 'Yes, iPhone is supported via wireless and USB where available.' },
  { q: 'Does it support Android?', a: 'Yes, Android is supported via wireless and USB where available.' },
  { q: 'Can I record my screen?', a: 'Screen recording functionality is included where implemented.' },
  { q: 'What if a device is not detected?', a: 'Use the troubleshooting and diagnostics tools in the app.' },
  { q: 'What are the system requirements?', a: 'Windows 10/11 (x64). Additional requirements depend on features used.' },
  { q: 'How do I install Shadow Cast?', a: 'Run the installer when available and follow the setup wizard.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A1A1B5] mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold">Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="glass rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5 text-sm text-[#A1A1B5]">
                    {f.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
