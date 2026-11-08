import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import {
  AUTHORITATIVE_PLANS,
  UPI_CONFIG,
  buildUpiIntentUrl,
  getUpiQrCodeUrl,
  executeUpgradeToPro,
} from '../services/paymentService'
import type { Plan } from '../services/paymentService'
import { useAuth } from '../hooks/useAuth'

interface UpiPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, showToast } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<Plan>(AUTHORITATIVE_PLANS[1]) // Default to Yearly VIP Pro
  const [step, setStep] = useState<'select' | 'pay' | 'success'>('select')
  const [utrNumber, setUtrNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedVpa, setCopiedVpa] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [issuedKey, setIssuedKey] = useState('')

  if (!isOpen) return null

  const userEmail = user?.email || 'pilot@shadowcast.in'
  const upiIntentUrl = buildUpiIntentUrl(selectedPlan, userEmail)
  const qrCodeUrl = getUpiQrCodeUrl(upiIntentUrl, 280)

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa)
    setCopiedVpa(true)
    showToast('UPI ID copied to clipboard!', 'success')
    setTimeout(() => setCopiedVpa(false), 2000)
  }

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(selectedPlan.priceINR.toString())
    setCopiedAmount(true)
    showToast('Amount copied to clipboard!', 'success')
    setTimeout(() => setCopiedAmount(false), 2000)
  }

  const handleOpenUpiApp = (schemePrefix?: string) => {
    if (schemePrefix && schemePrefix !== 'upi://pay') {
      const intentWithScheme = upiIntentUrl.replace('upi://pay', schemePrefix)
      window.location.href = intentWithScheme
    } else {
      window.location.href = upiIntentUrl
    }
  }

  const handleVerifyAndActivate = async () => {
    if (!user) {
      showToast('Please log in first to activate your subscription.', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const res = await executeUpgradeToPro({
        userId: user.id,
        email: user.email,
        planId: selectedPlan.id as 'monthly_pro' | 'yearly_pro' | 'lifetime_pro',
        amount: selectedPlan.priceINR,
        paymentMethod: 'upi_intent',
        transactionRef: utrNumber.trim() || `UPI-TXN-${Date.now().toString(36).toUpperCase()}`,
      })

      if (res.success) {
        setIssuedKey(res.licenseKey || `SHADOWCAST-PRO-${user.id.slice(0, 8).toUpperCase()}-PASS`)
        setStep('success')
        showToast(`Congratulations! Upgraded to ${selectedPlan.name}!`, 'success')
        if (onSuccess) onSuccess()
      } else {
        showToast(res.error || 'Failed to verify payment. Please try again.', 'error')
      }
    } catch {
      showToast('An unexpected error occurred during activation.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetAndClose = () => {
    setStep('select')
    setUtrNumber('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#090A10] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Ambient Top Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF1025] to-purple-600" />
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#FF1025]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#FF1025]/20 to-purple-600/20 border border-purple-500/30 text-purple-300">
                <Sparkles size={20} className="text-[#FF1025]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Upgrade to ShadowCast Creator Pro
                </h3>
                <p className="text-xs text-slate-400">
                  Instant UPI Activation • Zero Watermark • 4K 120 FPS Video Relays
                </p>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 relative z-10 max-h-[78vh] overflow-y-auto">
            {/* STEP 1: PLAN SELECTOR */}
            {step === 'select' && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30 uppercase">
                    Step 1 of 2: Select Your VIP Entitlement
                  </span>
                  <h4 className="text-xl font-extrabold text-white mt-2">
                    Choose Your ShadowCast Pro Plan
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    All plans remove the watermark and unlock uncompressed 4K 120 FPS streaming.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {AUTHORITATIVE_PLANS.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-purple-950/50 to-slate-900 border-[#FF1025] shadow-lg shadow-[#FF1025]/15 ring-1 ring-[#FF1025]/40'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-gradient-to-r from-[#FF1025] to-purple-600 text-white shadow-sm whitespace-nowrap">
                            {plan.badge}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mt-1 mb-2">
                            <span className="text-xs font-bold text-white">{plan.name.replace('ShadowCast ', '')}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#FF1025] bg-[#FF1025]' : 'border-slate-600'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>

                          <div className="mb-3">
                            <span className="text-2xl font-extrabold text-white">₹{plan.priceINR}</span>
                            <span className="text-[11px] text-slate-400 font-mono ml-1">/ {plan.durationLabel}</span>
                          </div>

                          <ul className="space-y-1.5 text-[11px] text-slate-300 mb-4">
                            <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                              <CheckCircle2 size={12} /> Watermark Removed
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 size={12} className="text-purple-400" /> 4K UHD 120 FPS
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 size={12} className="text-blue-400" /> {plan.maxDevices} Paired Devices
                            </li>
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center font-mono">
                          {plan.durationLabel} Access
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Plan Highlights */}
                <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    <div>
                      <span className="text-white font-semibold block">Automatic Cloud &amp; Desktop Sync</span>
                      <span className="text-[11px] text-slate-400">
                        Works on Windows Desktop App (`ShadowCast.exe`) instantly after payment.
                      </span>
                    </div>
                  </div>
                  <span className="text-purple-300 font-mono font-bold">0% Transaction Fees</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={handleResetAndClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep('pay')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to UPI Payment (₹{selectedPlan.priceINR})</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: UPI PAYMENT SCREEN */}
            {step === 'pay' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <button
                    onClick={() => setStep('select')}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    ← Change Plan ({selectedPlan.name})
                  </button>
                  <span className="text-xs font-mono font-bold text-white bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">
                    Total: ₹{selectedPlan.priceINR} INR
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left: Dynamic QR Code */}
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/60 border border-slate-800 text-center">
                    <div className="p-2.5 bg-white rounded-2xl shadow-xl mb-3">
                      <img
                        src={qrCodeUrl}
                        alt="Scan UPI QR Code"
                        className="w-48 h-48 object-contain rounded-xl"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                      <QrCode size={14} /> Scan with Any UPI App
                    </div>
                    <p className="text-[10px] text-slate-400">
                      GPay, PhonePe, Paytm, Cred, BHIM, Amazon Pay
                    </p>
                  </div>

                  {/* Right: Payment Details & Direct UPI Buttons */}
                  <div className="space-y-4">
                    {/* Payee VPA Box */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                        Payee UPI VPA (DEGiTEX Official)
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-mono font-bold text-purple-300 select-all">
                          {UPI_CONFIG.vpa}
                        </code>
                        <button
                          onClick={handleCopyVpa}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedVpa ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Amount Box */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                        Amount to Pay
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-extrabold text-white">
                          ₹{selectedPlan.priceINR}.00
                        </span>
                        <button
                          onClick={handleCopyAmount}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedAmount ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedAmount ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Direct Mobile UPI Apps */}
                    <div>
                      <div className="text-[11px] text-slate-400 mb-2 font-medium">
                        On Mobile? Open directly in your UPI app:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {UPI_CONFIG.supportedApps.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => handleOpenUpiApp(app.scheme)}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{app.name}</span>
                            <ExternalLink size={11} className="text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification & UTR Submission */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      UPI Reference / UTR Number (Optional, 12 digits from receipt)
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 431289123891 or leave blank for instant activation"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      ⚡ Instant auto-activation upon clicking confirm
                    </span>
                    <button
                      onClick={handleVerifyAndActivate}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Verifying &amp; Activating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          <span>I Have Paid • Activate Creator Pro</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {step === 'success' && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h4 className="text-2xl font-extrabold text-white">
                    Creator Pro Activated!
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Your account has been upgraded to <strong className="text-white">{selectedPlan.name}</strong>.
                    All features are immediately active across Web and Windows Desktop.
                  </p>
                </div>

                {/* Entitlement Summary Card */}
                <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 max-w-md mx-auto space-y-2.5 text-xs text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Issued License Token</span>
                    <code className="text-purple-300 font-mono font-bold">{issuedKey}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Watermark Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> REMOVED (Clean 4K Feed)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stream Pipeline</span>
                    <span className="text-white font-mono font-semibold">4K UHD @ 120 FPS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Allowed Concurrent Devices</span>
                    <span className="text-purple-300 font-mono font-semibold">{selectedPlan.maxDevices} Devices</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleResetAndClose()
                      window.location.reload()
                    }}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-900/30 cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UpiPaymentModal