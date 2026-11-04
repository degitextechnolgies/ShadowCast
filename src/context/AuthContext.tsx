import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext, type User, type ToastInfo } from './authContextDef'

const STORAGE_KEY = 'shadowcast_user_session'

const DEFAULT_DEMO_USER: User = {
  id: 'usr_sc_001',
  name: 'Alex Vance',
  email: 'alex.vance@shadowcast.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isPro: true,
  plan: 'Pro Ultra (4K)',
  connectedDevices: 2,
  joinedAt: 'November 2026',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin')
  const [toast, setToast] = useState<ToastInfo | null>(null)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now()
    setToast({ id, message, type })
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const saveUser = (newUser: User) => {
    setUser(newUser)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    } catch (e) {
      console.error('Failed to save session to localStorage', e)
    }
  }

  const signIn = async (email: string, _password?: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const fallbackName = email.split('@')[0] || 'Member'
    const capitalizedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1)
    
    const loggedUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: capitalizedName,
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      isPro: true,
      plan: 'Pro Tier',
      connectedDevices: 1,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    }

    saveUser(loggedUser)
    closeAuthModal()
    showToast(`Welcome back, ${loggedUser.name}!`, 'success')
    return true
  }

  const signUp = async (name: string, email: string, _password?: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 650))
    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: name.trim() || 'New Member',
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
      isPro: true,
      plan: 'Free Tier (14d Pro Trial)',
      connectedDevices: 0,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    }

    saveUser(newUser)
    closeAuthModal()
    showToast(`Account created! Welcome to Shadow Cast, ${newUser.name}.`, 'success')
    return true
  }

  const signInWithProvider = async (provider: 'google' | 'github' | 'discord'): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const providerNames: Record<string, string> = {
      google: 'Google User',
      github: 'GitHub Developer',
      discord: 'Discord Gamer',
    }
    const displayName = providerNames[provider] || 'Shadow Caster'
    const loggedUser: User = {
      id: `usr_${provider}_${Date.now().toString(36)}`,
      name: displayName,
      email: `${provider}.user@shadowcast.io`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${provider}`,
      isPro: true,
      plan: 'Pro Ultra (4K)',
      connectedDevices: 2,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    }

    saveUser(loggedUser)
    closeAuthModal()
    showToast(`Signed in via ${provider.toUpperCase()} successfully!`, 'success')
    return true
  }

  const quickDemoLogin = () => {
    saveUser(DEFAULT_DEMO_USER)
    closeAuthModal()
    showToast(`Logged in as Demo User (${DEFAULT_DEMO_USER.name})!`, 'success')
  }

  const signOut = () => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear session', e)
    }
    showToast('Signed out successfully.', 'info')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authModalMode,
        toast,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInWithProvider,
        quickDemoLogin,
        signOut,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
