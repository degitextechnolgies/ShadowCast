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

export const AUTHORITATIVE_PLANS: Plan[] = [
  {
    id: 'monthly_pro',
    name: 'ShadowCast Monthly Pro',
    subtitle: 'Flexible month-to-month streaming tier',
    priceINR: 1,
    durationDays: 30,
    durationLabel: '30 Days',
    maxDevices: 2,
    maxFps: 120,
    maxResolution: '4K UHD (3840×2160)',
    watermarkRemoved: true,
    features: [
      'Watermark Removed on All Streams',
      'Ultra HD 4K 120 FPS Video Pipeline',
      'Up to 2 Concurrent Device Connections',
      'Zero-Latency NVENC / QuickSync Engine',
      'Uncompressed 320 kbps Opus Studio Audio',
      'Cross-Device Instant Sync (Web + Desktop)',
    ],
  },
  {
    id: 'yearly_pro',
    name: 'ShadowCast Yearly VIP Pro',
    subtitle: 'Best value for serious creators & streamers',
    priceINR: 1,
    durationDays: 365,
    durationLabel: '365 Days (1 Year)',
    maxDevices: 5,
    maxFps: 120,
    maxResolution: '4K UHD (3840×2160)',
    watermarkRemoved: true,
    isPopular: true,
    badge: 'MOST POPULAR • LIVE TEST (₹1)',
    features: [
      'Watermark Removed on All Streams',
      'Ultra HD 4K 120 FPS Video Pipeline',
      'Up to 5 Concurrent Device Connections',
      'VIP Priority NVENC Cloud Relays',
      'Uncompressed 320 kbps Opus Studio Audio',
      '365 Days of Automatic Updates & Support',
    ],
  },
  {
    id: 'lifetime_pro',
    name: 'ShadowCast Lifetime License',
    subtitle: 'One-time investment for permanent VIP access',
    priceINR: 1,
    durationDays: 36500,
    durationLabel: 'Lifetime (100 Years)',
    maxDevices: 10,
    maxFps: 120,
    maxResolution: '4K UHD (3840×2160)',
    watermarkRemoved: true,
    badge: 'PERMANENT VIP LICENSE (₹1)',
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

export const UPI_CONFIG = {
  vpa: import.meta.env.VITE_UPI_VPA || 'degitextechnolgies@okaxis',
  merchantName: 'ShadowCast DEGiTEX',
  supportedApps: [
    { id: 'gpay', name: 'Google Pay', scheme: 'tez://upi/pay', color: 'from-blue-500 to-emerald-500' },
    { id: 'phonepe', name: 'PhonePe', scheme: 'phonepe://pay', color: 'from-purple-600 to-indigo-600' },
    { id: 'paytm', name: 'Paytm', scheme: 'paytmmp://pay', color: 'from-sky-500 to-blue-600' },
    { id: 'bhim', name: 'BHIM UPI', scheme: 'upi://pay', color: 'from-amber-500 to-orange-600' },
  ],
}

/**
 * Builds standard NPCI UPI Intent URL for QR code and mobile app deep links
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
 * Executes or records upgrade in Supabase profiles, licenses, subscriptions, and payments
 */
export async function executeUpgradeToPro(params: {
  userId: string
  email: string
  planId: 'monthly_pro' | 'yearly_pro' | 'lifetime_pro'
  amount: number
  paymentMethod: 'upi_intent' | 'upi_qr' | 'razorpay' | 'admin_grant'
  transactionRef?: string
}): Promise<{ success: boolean; error?: string; licenseKey?: string; expiresAt?: string }> {
  const { userId, email, planId, amount, paymentMethod, transactionRef } = params
  const targetPlan = AUTHORITATIVE_PLANS.find((p) => p.id === planId) || AUTHORITATIVE_PLANS[1]

  const cleanEmail = email.trim().toLowerCase()
  const proKey = `SHADOWCAST-PRO-${Math.random().toString(36).substring(2, 10).toUpperCase()}-PASS`

  const startsAt = new Date()
  const expiresAt = new Date(startsAt.getTime() + targetPlan.durationDays * 24 * 60 * 60 * 1000)
  const expiresIso = targetPlan.id === 'lifetime_pro' ? null : expiresAt.toISOString()

  try {
    // 1. First try calling the server-side RPC if available
    const { data: rpcData, error: rpcError } = await supabase.rpc('process_pro_upgrade', {
      p_user_id: userId,
      p_email: cleanEmail,
      p_plan_id: planId,
      p_amount: amount,
      p_payment_id: transactionRef || `UPI-${Date.now()}`,
      p_payment_method: paymentMethod,
    })

    if (!rpcError && rpcData && rpcData.success) {
      updateLocalUserCache(userId, true, targetPlan.maxDevices)
      return {
        success: true,
        licenseKey: rpcData.license_key || proKey,
        expiresAt: rpcData.expires_at || expiresIso || undefined,
      }
    }

    // 2. Direct Supabase Fallback Update (Profiles table)
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
      console.warn('Direct profile update warning:', profileError)
    }

    // 3. Update Licenses table
    const { error: licError } = await supabase
      .from('licenses')
      .upsert(
        {
          user_id: userId,
          license_key: proKey,
          tier: 'CREATOR PRO',
          status: 'ACTIVE',
          max_devices: targetPlan.maxDevices,
          expires_at: expiresIso,
        },
        { onConflict: 'user_id' }
      )

    if (licError) {
      console.warn('Licenses upsert warning:', licError)
    }

    // 4. Try updating Subscriptions table (if migrated)
    try {
      await supabase.from('subscriptions').insert({
        user_id: userId,
        user_email: cleanEmail,
        plan_id: planId,
        status: 'active',
        starts_at: startsAt.toISOString(),
        expires_at: expiresIso,
      })
    } catch (e) {
      // Subscriptions table will be populated once created in SQL editor
      console.info('Subscriptions insert skipped or table pending migration:', e)
    }

    // 5. Try updating Payments table (if migrated)
    try {
      await supabase.from('payments').insert({
        user_id: userId,
        user_email: cleanEmail,
        plan_id: planId,
        amount,
        currency: 'INR',
        payment_method: paymentMethod,
        payment_id: transactionRef || `UPI-${Date.now()}`,
        status: 'completed',
      })
    } catch (e) {
      console.info('Payments insert skipped or table pending migration:', e)
    }

    // 6. Record in Audit Logs
    try {
      await supabase.from('audit_logs').insert({
        category: 'PAYMENT',
        level: 'INFO',
        message: `Upgraded to Creator Pro (${targetPlan.name}) via ${paymentMethod.toUpperCase()} (Ref: ${transactionRef || 'N/A'})`,
        user_id: userId,
      })
    } catch {
      // ignore audit log error
    }

    // 7. Update browser local storage so user state switches immediately
    updateLocalUserCache(userId, true, targetPlan.maxDevices)

    return {
      success: true,
      licenseKey: proKey,
      expiresAt: expiresIso || undefined,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upgrade to Creator Pro.'
    return { success: false, error: msg }
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
      const plan = AUTHORITATIVE_PLANS.find((p) => p.id === sub.plan_id) || AUTHORITATIVE_PLANS[1]
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
        planName: 'ShadowCast Yearly VIP Pro',
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
    console.warn('Subscription fetch exception:', err)
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
