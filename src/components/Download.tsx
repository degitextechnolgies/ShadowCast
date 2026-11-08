import { motion } from 'framer-motion'
import { FileCheck, HardDrive, LogIn, Download as DownloadIcon, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Download() {
  const { user, openAuthModal, showToast } = useAuth()
  const navigate = useNavigate()

  const handleAction = () => {
    if (!user) {
      openAuthModal('signin')
      showToast('Please sign in first to download the ShadowCast installer.', 'info')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <section id="download" className="py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.4em] text-[#FF1025] font-semibold mb-3">Download</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Ready to Enter the Shadow?</h2>
          <p className="text-[#92929E] mb-10">
            {user
              ? 'Pilot session active. Download your authenticated installer directly from your dashboard.'
              : 'Sign in to access your license token and download the official ShadowCast Windows executable.'}
          </p>
        </motion.div>
        <div className="glass rounded-2xl p-8 border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <div className="font-bold text-white text-lg mb-1 flex items-center gap-2">
                <span>ShadowCast for Windows</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF1025]/20 text-red-300 border border-[#FF1025]/30">
                  .EXE
                </span>
              </div>
              <div className="text-sm text-[#92929E]">Version: v1.8.5 · Windows 10/11 (x64)</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>
                  {user
                    ? 'Authenticated Pilot clearance verified. Download unlocked.'
                    : 'Download locked · Requires active pilot login to authenticate hardware license.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAction}
              className={`px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                user
                  ? 'bg-gradient-to-r from-[#FF1025] to-purple-600 text-white shadow-purple-900/40 hover:opacity-90 hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-[#FF1025] via-[#E6001F] to-[#B30018] text-white shadow-[#FF1025]/40 hover:shadow-[#FF1025]/60 hover:-translate-y-0.5'
              }`}
            >
              {user ? (
                <>
                  <DownloadIcon size={16} />
                  <span>Go to Dashboard to Download</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In to Download</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#92929E] pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1"><HardDrive size={13} className="text-purple-400" /> Package: ShadowCast-Setup-v1.8.5.exe</span>
            <span className="flex items-center gap-1"><FileCheck size={13} className="text-emerald-400" /> SHA-256 Verified · AirPlay 2 + USB Drivers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
