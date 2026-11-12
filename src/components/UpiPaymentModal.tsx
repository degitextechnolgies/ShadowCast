import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CreditCard,
  Zap,
  Smartphone,
  Lock,
  QrCode,
} from 'lucide-react'
import {
  AUTHORITATIVE_PLANS,
  UPI_CONFIG,
  buildUpiIntentUrl,
  getUpiQrCodeUrl,
  openRazorpayCheckout,
  activateRazorpaySubscription,
  executeUpgradeToPro,
} from '../services/paymentService'
import type { Plan, ActivationResult } from '../services/paymentService'
import { useAuth } from '../hooks/useAuth'

interface UpiPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (activation?: ActivationResult) => void
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, showToast, refreshUser } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<Plan>(AUTHORITATIVE_PLANS[0]) // Default to 1 Month Pro
  const [step, setStep] = useState<'select' | 'processing' | 'success' | 'manual_fallback'>('select')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedVpa, setCopiedVpa] = useState(false)
  const [utrNumber, setUtrNumber] = useState('')

  // Activation Result State
  const [activationResult, setActivationResult] = useState<ActivationResult | null>(null)

  if (!isOpen) return null

  const userEmail = user?.email || 'pilot@shadowcast.in'
  const userName = user?.name || userEmail.split('@')[0]
  const upiIntentUrl = buildUpiIntentUrl(selectedPlan, userEmail)
  const qrCodeUrl = getUpiQrCodeUrl(upiIntentUrl, 260)

  const handleCopyKey = () => {
    if (activationResult?.licenseKey) {
      navigator.clipboard.writeText(activationResult.licenseKey)
      setCopiedKey(true)
      showToast('License Key copied to clipboard!', 'success')
      setTimeout(() => setCopiedKey(false), 2500)
    }
  }

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa)
    setCopiedVpa(true)
    showToast('UPI VPA copied to clipboard!', 'success')
    setTimeout(() => setCopiedVpa(false), 2000)
  }

  const handleResetAndClose = () => {
    setStep('select')
    setIsProcessing(false)
    setActivationResult(null)
    setUtrNumber('')
    onClose()
  }

  // 1. Primary Automated Razorpay Checkout Flow
  const handleLaunchRazorpay = async () => {
    if (!user) {
      showToast('Please sign in first to upgrade your account.', 'error')
      return
    }

    setIsProcessing(true)

    await openRazorpayCheckout({
      plan: selectedPlan,
      user: { id: user.id, email: userEmail, name: userName },
      onSuccess: async (result) => {
        setIsProcessing(false)
        setActivationResult(result)
        setStep('success')
        await refreshUser()
        showToast('Payment verified! ShadowCast Pro license activated.', 'success')
        if (onSuccess) onSuccess(result)
      },
      onError: (errorMsg) => {
        setIsProcessing(false)
        showToast(errorMsg, 'error')
      },
      onDismiss: () => {
        setIsProcessing(false)
      },
    })
  }

  // 2. Direct Simulation (for instant testing or demo environments)
  const handleSimulatePayment = async () => {
    if (!user) {
      showToast('Please sign in first.', 'error')
      return
    }

    setIsProcessing(true)
    const simulatedPaymentId = `pay_sim_${Date.now().toString(36)}`

    try {
      const result = await activateRazorpaySubscription({
        userId: user.id,
        email: userEmail,
        planId: selectedPlan.id as 'monthly_pro' | 'yearly_pro' | 'lifetime_pro',
        amount: selectedPlan.priceINR,
        paymentId: simulatedPaymentId,
      })

      setIsProcessing(false)
      if (result.success) {
        setActivationResult(result)
        setStep('success')
        await refreshUser()
        showToast('Test payment successful! Pro license activated.', 'success')
        if (onSuccess) onSuccess(result)
      } else {
        showToast(result.error || 'Activation failed', 'error')
      }
    } catch (err: any) {
      setIsProcessing(false)
      showToast(err.message || 'Error simulating payment', 'error')
    }
  }

  // 3. Fallback Manual UTR Verification
  const handleManualUtrSubmit = async () => {
    if (!user) {
      showToast('Please sign in first.', 'error')
      return
    }

    const cleanUtr = utrNumber.trim()
    if (!cleanUtr || !/^\d{12}$/.test(cleanUtr)) {
      showToast('Invalid UTR! Must be exactly 12 numeric digits from your bank/UPI app.', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const res = await executeUpgradeToPro({
        userId: user.id,
        email: userEmail,
        planId: selectedPlan.id as 'monthly_pro' | 'yearly_pro' | 'lifetime_pro',
        amount: selectedPlan.priceINR,
        paymentMethod: 'upi_intent',
        transactionRef: cleanUtr,
      })

      setIsProcessing(false)
      if (res.success && res.licenseKey) {
        const result: ActivationResult = {
          success: true,
          licenseKey: res.licenseKey,
          expiresAt: res.expiresAt,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amount: selectedPlan.priceINR,
          durationDays: selectedPlan.durationDays,
          maxDevices: selectedPlan.maxDevices,
          paymentId: `UPI-UTR-${cleanUtr}`,
        }
        setActivationResult(result)
        setStep('success')
        await refreshUser()
        showToast('Payment verified via UTR! Pro activated.', 'success')
        if (onSuccess) onSuccess(result)
      } else {
        showToast(res.error || 'Could not verify payment UTR.', 'error')
      }
    } catch (err: any) {
      setIsProcessing(false)
      showToast(err.message || 'Verification failed', 'error')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-[#050509]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0c0c14] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top Decorative Ambient Glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#FF1025] to-purple-600 blur-[2px]" />

          {/* Modal Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#FF1025]/20 to-purple-600/20 border border-purple-500/30 text-purple-300">
                <Sparkles size={22} className="text-[#FF1025]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Upgrade to ShadowCast Creator Pro
                </h3>
                <p className="text-xs text-slate-400">
                  Instant Automated Activation • Zero Watermark • 4K UHD 120 FPS
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

          {/* Modal Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* ============================================================== */}
            {/* STEP 1: PLAN SELECTOR & PAYMENT TRIGGER */}
            {/* ============================================================== */}
            {step === 'select' && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30 uppercase">
                    Automated Subscription Gateway
                  </span>
                  <h4 className="text-xl font-extrabold text-white mt-2">
                    Select Your Pro Subscription
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    License key and Pro features activate automatically right after payment.
                  </p>
                </div>

                {/* Plan Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AUTHORITATIVE_PLANS.slice(0, 2).map((plan) => {
                    const isSelected = selectedPlan.id === plan.id
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-purple-950/60 via-slate-900 to-[#0e0e18] border-[#FF1025] shadow-xl shadow-[#FF1025]/15 ring-2 ring-[#FF1025]/40'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-gradient-to-r from-[#FF1025] to-purple-600 text-white shadow-md whitespace-nowrap">
                            {plan.badge}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-white">{plan.name}</span>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#FF1025] bg-[#FF1025]' : 'border-slate-600'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>

                          <div className="mb-3">
                            <span className="text-3xl font-extrabold text-white">₹{plan.priceINR}</span>
                            <span className="text-xs text-slate-400 font-mono ml-1.5">/ {plan.durationLabel}</span>
                          </div>

                          <p className="text-xs text-slate-400 mb-3">{plan.subtitle}</p>

                          <ul className="space-y-2 text-xs text-slate-300 mb-4">
                            <li className="flex items-center gap-2 text-emerald-400 font-medium">
                              <CheckCircle2 size={13} /> Watermark Removed
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-purple-400" /> 4K UHD @ 120 FPS
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-blue-400" /> Up to {plan.maxDevices} Devices
                            </li>
                            <li className="flex items-center gap-2 text-slate-400">
                              <CheckCircle2 size={13} className="text-slate-500" /> Instant Desktop App Sync
                            </li>
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center font-mono">
                          Duration: {plan.durationDays} Days Access
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Lifetime License Option (Optional Third Card) */}
                {AUTHORITATIVE_PLANS[2] && (
                  <div
                    onClick={() => setSelectedPlan(AUTHORITATIVE_PLANS[2])}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                      selectedPlan.id === AUTHORITATIVE_PLANS[2].id
                        ? 'bg-gradient-to-r from-purple-950/60 to-slate-900 border-[#FF1025] ring-2 ring-[#FF1025]/40'
                        : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                        <Zap size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {AUTHORITATIVE_PLANS[2].name}
                          <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                            10 Devices • Permanent
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">One-time payment for permanent VIP access</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">₹{AUTHORITATIVE_PLANS[2].priceINR}</span>
                      <span className="text-[10px] text-slate-400 block">Lifetime</span>
                    </div>
                  </div>
                )}

                {/* Primary Automated Razorpay Action Button */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleLaunchRazorpay}
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF1025] via-purple-600 to-[#FF1025] bg-[length:200%_auto] hover:bg-right transition-all duration-300 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#FF1025]/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Initializing Secure Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay ₹{selectedPlan.priceINR} & Activate Subscription Automatically</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* Payment Methods Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Smartphone size={12} className="text-emerald-400" /> UPI (GPay / PhonePe / Paytm / BHIM)
                    </span>
                    <span className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                      <CreditCard size={12} className="text-blue-400" /> Credit / Debit Cards
                    </span>
                    <span className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Lock size={12} className="text-purple-400" /> NetBanking & Wallets
                    </span>
                  </div>
                </div>

                {/* Test Mode Simulator / Fallback Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Zap size={12} /> Test Simulation (Instant 1-Click Pro)
                  </button>

                  <button
                    onClick={() => setStep('manual_fallback')}
                    className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <QrCode size={12} /> Manual UPI QR Option
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: CELEBRATION & ACTIVATED LICENSE (AUTO-ACTIVATED) */}
            {/* ============================================================== */}
            {step === 'success' && activationResult && (
              <div className="space-y-6 text-center py-4">
                {/* Glowing Success Icon */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                    Payment Verified & Subscription Active
                  </span>
                  <h4 className="text-2xl font-extrabold text-white mt-2">
                    Welcome to ShadowCast Creator Pro!
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                    Your Pro license has been generated and automatically activated on your account.
                  </p>
                </div>

                {/* Plan Details Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-purple-500/30 text-left space-y-3 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Subscription Tier</span>
                      <span className="text-sm font-bold text-white">{activationResult.planName || selectedPlan.name}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {activationResult.durationDays || selectedPlan.durationDays} Days Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Valid Until</span>
                      <span className="font-semibold text-white">
                        {activationResult.expiresAt
                          ? new Date(activationResult.expiresAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Permanent Access'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Maximum Devices</span>
                      <span className="font-semibold text-white">
                        {activationResult.maxDevices || selectedPlan.maxDevices} Concurrent Devices
                      </span>
                    </div>
                  </div>

                  {/* License Key Box */}
                  <div className="pt-3 border-t border-slate-800">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                      <span>ShadowCast Pro License Key:</span>
                      <span className="text-[10px] text-slate-400">Desktop & Web Authorization</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/80 border border-slate-700/80 rounded-xl px-3 py-2.5 font-mono text-xs sm:text-sm text-emerald-400 tracking-wider font-bold select-all overflow-x-auto whitespace-nowrap">
                        {activationResult.licenseKey || 'SHADOWCAST-PRO-ACTIVE'}
                      </div>
                      <button
                        onClick={handleCopyKey}
                        className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Instructions */}
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-left text-xs text-slate-400 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-[#FF1025] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Desktop Application Sync</strong>
                    Launch the ShadowCast desktop app on your Windows PC. Your Pro status will automatically sync using your logged-in account, or you can paste this license key directly.
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all cursor-pointer"
                >
                  Done & Continue to Dashboard
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: MANUAL UPI FALLBACK (IF NEEDED) */}
            {/* ============================================================== */}
            {step === 'manual_fallback' && (
              <div className="space-y-5">
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    Manual UPI Payment Fallback
                  </span>
                  <h4 className="text-lg font-bold text-white mt-2">
                    Pay ₹{selectedPlan.priceINR} via UPI QR
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scan with any UPI app (PhonePe, Google Pay, Paytm, BHIM)
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/60 border border-slate-800">
                  <div className="p-3 bg-white rounded-xl shadow-lg mb-3">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      UPI ID: {UPI_CONFIG.vpa}
                    </span>
                    <button
                      onClick={handleCopyVpa}
                      title={copiedVpa ? 'Copied VPA!' : 'Copy UPI ID'}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Copy size={14} />
                      {copiedVpa && <span className="text-[10px] text-emerald-400">Copied</span>}
                    </button>
                  </div>
                </div>

                {/* 12-Digit UTR Input */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-white block">
                    Enter 12-Digit UPI Ref / UTR Number:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={12}
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 431289123891"
                      className="flex-1 bg-black/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={handleManualUtrSubmit}
                      disabled={isProcessing || utrNumber.length !== 12}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? 'Verifying...' : 'Verify UTR'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setStep('select')}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  ← Back to Automated Razorpay Checkout
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UpiPaymentModal
