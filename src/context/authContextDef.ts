import { createContext } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  isPro: boolean
  plan: string
  connectedDevices: number
  joinedAt: string
}

export interface ToastInfo {
  id: number
  message: string
  type: 'success' | 'info' | 'error'
}

export interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  loading: boolean
  isAuthModalOpen: boolean
  authModalMode: 'signin' | 'signup'
  toast: ToastInfo | null
  openAuthModal: (mode?: 'signin' | 'signup') => void
  closeAuthModal: () => void
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signInWithProvider: (provider: 'google' | 'github' | 'discord') => Promise<boolean>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  quickDemoLogin?: () => void
  signOut: () => Promise<void>
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
