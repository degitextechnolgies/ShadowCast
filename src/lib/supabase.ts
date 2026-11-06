import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://snnziouhxitblbzybesg.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_pf8-unU-ApyEhyppEY0e5g_8FBJb4MC'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[ShadowCast Auth] Missing Supabase environment variables. Using fallback configuration.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

