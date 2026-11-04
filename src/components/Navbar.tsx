import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'Download', href: '#download' },
  { label: 'Support', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-lg shadow-purple-900/20' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/40">
            S
          </div>
          <span className="font-semibold tracking-wide text-white">Shadow Cast</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-[#A1A1B5] hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#docs" className="text-sm text-[#A1A1B5] hover:text-white transition-colors">Documentation</a>
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            <Download size={14} /> Download
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen((v) => !v)} aria-label="menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass mx-4 mt-3 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-[#A1A1B5] hover:text-white">
                  {l.label}
                </a>
              ))}
              <a href="#download" onClick={() => setOpen(false)} className="text-sm text-white font-medium">Download for Windows</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
