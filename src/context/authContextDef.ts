import { createContext } from 'react'

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
  isAuthModalOpen: boolean
  authModalMode: 'signin' | 'signup'
  toast: ToastInfo | null
  openAuthModal: (mode?: 'signin' | 'signup') => void
  closeAuthModal: () => void
  signIn: (email: string, password?: string) => Promise<boolean>
  signUp: (name: string, email: string, password?: string) => Promise<boolean>
  signInWithProvider: (provider: 'google' | 'github' | 'discord') => Promise<boolean>
  quickDemoLogin: () => void
  signOut: () => void
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

