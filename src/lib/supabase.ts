import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://cuosddpjfpkwlsfazpen.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_SHZPy1cmxmNlBfo43jMRzg_Aq2dbb-Y'

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

