import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, LogIn, LogOut, ChevronDown, Monitor, Sparkles, Settings, Shield } from 'lucide-react'
import { useAuth } from '../context/useAuth'

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
  const [userDropdown, setUserDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, openAuthModal, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 shadow-lg shadow-[#FF1025]/15' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <svg
            className="w-9 h-9 text-[#FF1025] group-hover:scale-105 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="font-bold tracking-tight text-white text-lg">
            Shadow<span className="text-[#FF1025]">Cast</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#C4C4CC] hover:text-[#FF1025] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#121218] border border-[#2a2228] hover:border-[#FF1025]/50 transition-all text-left group"
              >
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover bg-red-950/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF1025] to-[#D90020] flex items-center justify-center text-xs font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#121218]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white group-hover:text-red-300 transition-colors line-clamp-1 max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#FF1025] font-semibold uppercase tracking-wider">
                    {user.isPro ? 'PRO' : 'FREE'}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-[#71718A] transition-transform duration-200 ${
                    userDropdown ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#121218] border border-[#2a2228] shadow-2xl shadow-red-950/40 p-3 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-[#221c22] mb-2">
                      <div className="text-sm font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-[#A1A1B5] truncate">{user.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FF1025]/20 text-red-300 text-[11px] font-medium">
                        <Sparkles size={11} /> {user.plan}
                      </div>
                    </div>

                    <div className="px-3 py-2 text-xs text-[#A1A1B5] space-y-1.5 border-b border-[#221c22] mb-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Monitor size={12} /> Paired Devices
                        </span>
                        <span className="text-white font-medium">{user.connectedDevices} Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Latency Engine</span>
                        <span className="text-emerald-400 font-medium">Ultra Low (0.8ms)</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <a
                        href="/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#A1A1B5] hover:text-white hover:bg-white/5 transition-colors text-left"
                      >
                        <Settings size={14} /> Account &amp; Devices
                      </a>
                      <a
                        href="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-white hover:bg-red-500/10 transition-colors text-left font-medium"
                      >
                        <Shield size={14} className="text-[#FF1025]" /> Admin Console
                      </a>
                      <button
                        onClick={() => {
                          signOut()
                          setUserDropdown(false)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#FF1025]/40 hover:border-[#FF1025] bg-[#FF1025]/10 hover:bg-[#FF1025]/20 text-red-200 text-sm font-medium transition-all group"
            >
              <LogIn size={15} className="group-hover:translate-x-0.5 transition-transform text-[#FF1025]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Download CTA */}
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF1025] to-[#D90020] text-white font-bold text-sm shadow-lg shadow-[#FF1025]/40 hover:shadow-[#FF1025]/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Download size={14} /> Download
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass mx-4 mt-3 rounded-2xl overflow-hidden border border-[#2a2228]"
          >
            <div className="flex flex-col p-5 gap-3">
              {/* Mobile Auth Status */}
              {user ? (
                <>
                  <div className="p-3 rounded-xl bg-[#121218] border border-[#2a2228] mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover bg-red-950/30"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-red-400 font-medium">{user.plan}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setOpen(false)
                      }}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg text-xs"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <a
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="text-xs text-center py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    >
                      Member Hub
                    </a>
                    <a
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="text-xs text-center py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:text-white font-medium"
                    >
                      Admin Console
                    </a>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal('signin')
                    setOpen(false)
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF1025]/20 to-[#D90020]/20 border border-[#FF1025]/40 text-red-200 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn size={16} /> Sign In / Create Account
                </button>
              )}

              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-[#C4C4CC] hover:text-[#FF1025] py-1 transition-colors"
                >
                  {l.label}
                </a>
              ))}

              <a
                href="#download"
                onClick={() => setOpen(false)}
                className="mt-2 text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF1025] to-[#D90020] text-white text-sm font-bold shadow-md shadow-[#FF1025]/30"
              >
                Download Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
