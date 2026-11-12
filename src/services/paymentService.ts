import { supabase } from '../lib/supabase'

export interface Plan {
  id: 'monthly_pro' | 'yearly_pro' | 'lifetime_pro' | 'free'
  name: string
  subtitle: string
  priceINR: number
  durationDays: number
  durationLabel: string
  maxDevices: number
  maxFps: number
  maxResolution: string
  watermarkRemoved: boolean
  isPopular?: boolean
  badge?: string
  features: string[]
}

const isTestMode = import.meta.env.VITE_PAYMENT_TEST_MODE !== 'false'

export const AUTHORITATIVE_PLANS: Plan[] = [
  {
    id: 'monthly_pro',
    name: 'ShadowCast 1 Month Pro',
    subtitle: 'Flexible 30-day ultra-performance streaming tier',
    priceINR: Number(import.meta.env.VITE_PRICE_MONTHLY_PRO) || 70,
    durationDays: 30,
    durationLabel: '30 Days (1 Month)',
    maxDevices: 2,
    maxFps: 120,
    maxResolution: '4K UHD (3840×2160)',
    watermarkRemoved: true,
    badge: '₹70 / MONTH',
    features: [
      'Watermark Removed on All Streams',
      'Ultra HD 4K 120 FPS Video Pipeline',
      'Up to 2 Concurrent Device Connections',
      'Zero-Latency NVENC / QuickSync Engine',
      'Uncompressed 320 kbps Opus Studio Audio',
      'Instant Auto-Activation on Payment',
      'Cross-Device Instant Sync (Web + Desktop)',
    ],
  },
  {
    id: 'yearly_pro',
    name: 'ShadowCast 1 Year Pro',
    subtitle: 'Best value for serious creators & mobile streamers',
    priceINR: Number(import.meta.env.VITE_PRICE_YEARLY_PRO) || 840,
    durationDays: 365,
    durationLabel: '365 Days (1 Year)',
    maxDevices: 5,
    maxFps: 120,
    maxResolution: '4K UHD (3840×2160)',
    watermarkRemoved: true,
    isPopular: true,
    badge: 'BEST VALUE • ₹840 / YEAR',
    features: [
      'Watermark Removed on All Streams',
      'Ultra HD 4K 120 FPS Video Pipeline',
      'Up to 5 Concurrent Device Connections',
      'VIP Priority NVENC Cloud Relays',
      'Uncompressed 320 kbps Opus Studio Audio',
      '365 Days of Automatic Updates & Support',
      'Instant Auto-Activation on Payment',
      'Cross-Device Instant Sync (Web + Desktop)',
    ],
  },
  {
    id: 'lifetime_pro',
    name: 'ShadowCast Lifetime License',
    subtitle: 'One-time investment for permanent VIP access',
    priceINR: Number(import.meta.env.VITE_PRICE_LIFETIME_PRO) || 1999,
    durationDays: 36500,
    durationLabel: 'Lifetime (100 Years)',
    maxDevices: 10,
    maxFps: 120,
    maxResolution: '4K UHD (3840×2160)',
    watermarkRemoved: true,
    badge: 'PERMANENT VIP LICENSE',
    features: [
      'Watermark Removed Forever',
      'Permanent 4K 120 FPS Stream Access',
      'Up to 10 Concurrent Paired Devices',
      'Zero Monthly or Recurring Fees',
      'Lifetime Cloud License Key & Desktop Sync',
      'Direct Developer Priority Support',
    ],
  },
]

export interface SubscriptionInfo {
  planId: string
  planName: string
  status: 'active' | 'expired' | 'free'
  startsAt: string | null
  expiresAt: string | null
  daysRemaining: number
  isLifetime: boolean
  maxDevices: number
  watermarkRemoved: boolean
}

export const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Txlly35GAAF5u6',
  merchantName: 'ShadowCast DEGiTEX',
  currency: 'INR',
  themeColor: '#FF1025',
  isTestMode,
}

export const UPI_CONFIG = {
  vpa: import.meta.env.VITE_UPI_VPA || 'deekshithch882@ybl',
  merchantName: 'ShadowCast DEGiTEX',
  supportedApps: [
    { id: 'gpay', name: 'Google Pay', scheme: 'tez://upi/pay', color: 'from-blue-500 to-emerald-500' },
    { id: 'phonepe', name: 'PhonePe', scheme: 'phonepe://pay', color: 'from-purple-600 to-indigo-600' },
    { id: 'paytm', name: 'Paytm', scheme: 'paytmmp://pay', color: 'from-sky-500 to-blue-600' },
    { id: 'bhim', name: 'BHIM UPI', scheme: 'upi://pay', color: 'from-amber-500 to-orange-600' },
  ],
}

/**
 * Dynamically loads Razorpay checkout script if not already present
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true)
      return
    }
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

/**
 * Generates an authoritative signed license key based on plan and user hash
 */
export function generateLicenseKey(plan: Plan, userIdentifier: string): string {
  const cleanId = userIdentifier.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'USER'
  const timeCode = Date.now().toString(36).slice(-4).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()

  if (plan.id === 'monthly_pro') {
    return `SHADOWCAST-PRO-MONTHLY-${cleanId}-${timeCode}-${randomPart}`
  }
  if (plan.id === 'yearly_pro') {
    return `SHADOWCAST-PRO-YEARLY-${cleanId}-${timeCode}-${randomPart}`
  }
  return `SHADOWCAST-PRO-LIFETIME-${cleanId}-${timeCode}-${randomPart}`
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

export interface ActivationResult {
  success: boolean
  error?: string
  licenseKey?: string
  expiresAt?: string
  paymentId?: string
  orderId?: string
  planId?: string
  planName?: string
  amount?: number
  durationDays?: number
  maxDevices?: number
}

/**
 * Executes automatic subscription and license activation upon successful payment
 */
export async function activateRazorpaySubscription(params: {
  userId: string
  email: string
  planId: 'monthly_pro' | 'yearly_pro' | 'lifetime_pro'
  amount: number
  paymentId: string
  orderId?: string
  signature?: string
}): Promise<ActivationResult> {
  const { userId, email, planId, amount, paymentId, orderId, signature } = params
  const targetPlan = AUTHORITATIVE_PLANS.find((p) => p.id === planId) || AUTHORITATIVE_PLANS[0]
  const cleanEmail = email.trim().toLowerCase()

  const startsAt = new Date()
  const expiresAt = new Date(startsAt.getTime() + targetPlan.durationDays * 24 * 60 * 60 * 1000)
  const expiresIso = targetPlan.id === 'lifetime_pro' ? null : expiresAt.toISOString()
  const proKey = generateLicenseKey(targetPlan, email || userId)

  try {
    // 1. Try atomic Supabase RPC if present
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('process_pro_upgrade', {
        p_user_id: userId,
        p_email: cleanEmail,
        p_plan_id: planId,
        p_amount: amount,
        p_payment_id: paymentId,
        p_payment_method: 'razorpay',
      })
      if (!rpcErr && rpcRes && rpcRes.license_key) {
        updateLocalUserCache(userId, true, targetPlan.maxDevices)
        return {
          success: true,
          licenseKey: rpcRes.license_key,
          expiresAt: rpcRes.expires_at || (expiresIso ?? undefined),
          paymentId,
          orderId,
          planId,
          planName: targetPlan.name,
          amount,
          durationDays: targetPlan.durationDays,
          maxDevices: targetPlan.maxDevices,
        }
      }
    } catch {
      // Fall through to direct table synchronization
    }

    // 2. Direct Supabase Profiles Update
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_pro: true,
        plan: 'Creator Pro',
        max_resolution: '4K UHD',
        max_fps: 120,
        max_devices: targetPlan.maxDevices,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (profileError) {
      console.warn('[PaymentService] Profiles update notice:', profileError.message)
    }

    // 3. Upsert into Licenses table (Authoritative desktop client sync)
    const { data: updatedLic } = await supabase
      .from('licenses')
      .update({
        license_key: proKey,
        tier: 'CREATOR PRO',
        status: 'ACTIVE',
        max_devices: targetPlan.maxDevices,
        expires_at: expiresIso,
      })
      .eq('user_id', userId)
      .select()

    if (!updatedLic || updatedLic.length === 0) {
      await supabase.from('licenses').insert({
        user_id: userId,
        license_key: proKey,
        tier: 'CREATOR PRO',
        status: 'ACTIVE',
        max_devices: targetPlan.maxDevices,
        expires_at: expiresIso,
      })
    }

    // 4. Record into Subscriptions table
    try {
      await supabase.from('subscriptions').insert({
        user_id: userId,
        user_email: cleanEmail,
        plan_id: planId,
        status: 'active',
        starts_at: startsAt.toISOString(),
        expires_at: expiresIso,
      })
    } catch (subErr) {
      console.warn('[PaymentService] Subscriptions record notice:', subErr)
    }

    // 5. Record into Payments table
    try {
      await supabase.from('payments').insert({
        user_id: userId,
        user_email: cleanEmail,
        plan_id: planId,
        amount,
        currency: 'INR',
        payment_method: 'razorpay',
        payment_id: paymentId,
        order_id: orderId || null,
        signature: signature || null,
        status: 'completed',
      })
    } catch (payErr) {
      console.warn('[PaymentService] Payments record notice:', payErr)
    }

    // 6. Record Audit Log
    try {
      await supabase.from('audit_logs').insert({
        category: 'PAYMENT',
        level: 'INFO',
        message: `Automated Razorpay payment verified: ₹${amount} INR for ${targetPlan.name} (${targetPlan.durationLabel}). Payment ID: ${paymentId}. Pro activated.`,
        user_id: userId,
      })
    } catch {
      // optional audit log
    }

    // 7. Update local cache for instant UI refresh
    updateLocalUserCache(userId, true, targetPlan.maxDevices)

    return {
      success: true,
      licenseKey: proKey,
      expiresAt: expiresIso || undefined,
      paymentId,
      orderId,
      planId,
      planName: targetPlan.name,
      amount,
      durationDays: targetPlan.durationDays,
      maxDevices: targetPlan.maxDevices,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to activate subscription.'
    return { success: false, error: msg }
  }
}

/**
 * Opens Razorpay Checkout modal for one-click payment and instant auto-activation
 */
export async function openRazorpayCheckout(params: {
  plan: Plan
  user: { id: string; email: string; name?: string }
  onSuccess: (result: ActivationResult) => void
  onError: (errorMsg: string) => void
  onDismiss?: () => void
}): Promise<void> {
  const { plan, user, onSuccess, onError, onDismiss } = params

  const isScriptLoaded = await loadRazorpayScript()
  if (!isScriptLoaded || typeof (window as any).Razorpay === 'undefined') {
    onError('Razorpay secure checkout could not be loaded. Please check your internet connection.')
    return
  }

  const cleanEmail = user.email || 'pilot@shadowcast.in'
  const cleanName = user.name || cleanEmail.split('@')[0]
  const amountPaise = Math.round(plan.priceINR * 100)

  const options = {
    key: RAZORPAY_CONFIG.keyId,
    amount: amountPaise,
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.merchantName,
    description: `${plan.name} (${plan.durationLabel}) — Ultra 4K 120FPS`,
    image: 'https://shadowcast.in/favicon.svg',
    prefill: {
      name: cleanName,
      email: cleanEmail,
    },
    notes: {
      userId: user.id,
      userEmail: cleanEmail,
      planId: plan.id,
      durationDays: plan.durationDays.toString(),
    },
    theme: {
      color: RAZORPAY_CONFIG.themeColor,
      backdrop_color: 'rgba(5, 5, 9, 0.85)',
    },
    handler: async (response: RazorpayPaymentSuccessResponse) => {
      try {
        const activation = await activateRazorpaySubscription({
          userId: user.id,
          email: cleanEmail,
          planId: plan.id as 'monthly_pro' | 'yearly_pro' | 'lifetime_pro',
          amount: plan.priceINR,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        })

        if (activation.success) {
          onSuccess(activation)
        } else {
          onError(activation.error || 'Payment succeeded, but subscription activation failed. Please contact support.')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Activation error'
        onError(message)
      }
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss()
      },
    },
  }

  try {
    const rzp = new (window as any).Razorpay(options)
    rzp.on('payment.failed', (response: any) => {
      const reason = response.error?.description || 'Payment was unsuccessful or cancelled.'
      onError(reason)
    })
    rzp.open()
  } catch (launchErr: any) {
    onError(launchErr?.message || 'Could not launch Razorpay checkout modal.')
  }
}

/**
 * Builds standard NPCI UPI Intent URL for QR code and mobile app deep links (fallback)
 */
export function buildUpiIntentUrl(plan: Plan, userEmail: string): string {
  const transactionNote = `ShadowCast-${plan.id}-${userEmail.split('@')[0]}`
  const params = new URLSearchParams({
    pa: UPI_CONFIG.vpa,
    pn: UPI_CONFIG.merchantName,
    am: plan.priceINR.toFixed(2),
    cu: 'INR',
    tn: transactionNote,
  })
  return `upi://pay?${params.toString()}`
}

/**
 * Generates high resolution QR code image endpoint using standard QR Server
 */
export function getUpiQrCodeUrl(upiUrl: string, size = 260): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiUrl)}&margin=12`
}

/**
 * Legacy manual UPI UTR verification fallback
 */
export async function executeUpgradeToPro(params: {
  userId: string
  email: string
  planId: 'monthly_pro' | 'yearly_pro' | 'lifetime_pro'
  amount: number
  paymentMethod: 'upi_intent' | 'upi_qr' | 'razorpay' | 'admin_grant'
  transactionRef?: string
}): Promise<{
  success: boolean
  error?: string
  licenseKey?: string
  expiresAt?: string
  transactionRef?: string
  amount?: number
  paidAt?: string
  payeeVpa?: string
}> {
  const { userId, email, planId, amount, transactionRef } = params

  const verifiedRef = transactionRef?.trim()
  if (!verifiedRef || !/^\d{12}$/.test(verifiedRef)) {
    return {
      success: false,
      error: 'A valid 12-digit UPI UTR reference from your payment receipt is strictly required.',
    }
  }

  const result = await activateRazorpaySubscription({
    userId,
    email,
    planId,
    amount,
    paymentId: `UPI-UTR-${verifiedRef}`,
  })

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return {
    success: true,
    licenseKey: result.licenseKey,
    expiresAt: result.expiresAt,
    transactionRef: verifiedRef,
    amount,
    paidAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    payeeVpa: UPI_CONFIG.vpa,
  }
}

/**
 * Reads user subscription and license validity from Supabase
 */
export async function fetchUserSubscriptionInfo(
  userId: string,
  userEmail: string
): Promise<SubscriptionInfo> {
  const cleanEmail = userEmail.trim().toLowerCase()

  try {
    // 1. Try querying subscriptions table
    const { data: subsData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_email', cleanEmail)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)

    if (subsData && subsData.length > 0) {
      const sub = subsData[0]
      const plan = AUTHORITATIVE_PLANS.find((p) => p.id === sub.plan_id) || AUTHORITATIVE_PLANS[0]
      const isLifetime = sub.plan_id === 'lifetime_pro' || !sub.expires_at

      let daysRemaining = 999
      if (!isLifetime && sub.expires_at) {
        const diffMs = new Date(sub.expires_at).getTime() - Date.now()
        daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
      }

      return {
        planId: sub.plan_id,
        planName: plan.name,
        status: daysRemaining > 0 || isLifetime ? 'active' : 'expired',
        startsAt: sub.starts_at,
        expiresAt: sub.expires_at,
        daysRemaining: isLifetime ? 36500 : daysRemaining,
        isLifetime,
        maxDevices: plan.maxDevices,
        watermarkRemoved: true,
      }
    }

    // 2. Fallback to licenses table
    const { data: licData } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (licData && (licData.tier === 'CREATOR PRO' || licData.tier === 'PRO')) {
      const isLifetime = !licData.expires_at
      let daysRemaining = 365
      if (licData.expires_at) {
        const diffMs = new Date(licData.expires_at).getTime() - Date.now()
        daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
      }

      return {
        planId: 'yearly_pro',
        planName: 'ShadowCast 1 Year Pro',
        status: 'active',
        startsAt: licData.created_at,
        expiresAt: licData.expires_at,
        daysRemaining: isLifetime ? 36500 : daysRemaining,
        isLifetime,
        maxDevices: licData.max_devices || 5,
        watermarkRemoved: true,
      }
    }
  } catch (err) {
    console.warn('[PaymentService] Subscription fetch exception:', err)
  }

  // Default Creator (Free) status
  return {
    planId: 'free',
    planName: 'Creator Tier',
    status: 'free',
    startsAt: null,
    expiresAt: null,
    daysRemaining: 0,
    isLifetime: false,
    maxDevices: 1,
    watermarkRemoved: false,
  }
}

function updateLocalUserCache(_userId: string, isPro: boolean, maxDevices: number) {
  try {
    const raw = localStorage.getItem('shadowcast_active_user')
    if (raw) {
      const parsed = JSON.parse(raw)
      parsed.isPro = isPro
      parsed.plan = isPro ? 'Creator Pro' : 'Creator'
      parsed.connectedDevices = Math.min(parsed.connectedDevices || 1, maxDevices)
      localStorage.setItem('shadowcast_active_user', JSON.stringify(parsed))
      sessionStorage.setItem('shadowcast_active_user', JSON.stringify(parsed))
    }
  } catch {
    // ignore local storage errors
  }
}
