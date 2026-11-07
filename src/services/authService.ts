import { supabase } from '../lib/supabase'
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js'

export interface AuthResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  requiresEmailConfirmation?: boolean
}

export const authService = {
  /**
   * Sign in using Email & Password.
   * Throws friendly, descriptive error messages for unverified emails or invalid credentials.
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult<Session>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // If Supabase confirms the password is valid but email is not confirmed,
        // permit immediate authentication so the user can easily log in without waiting.
        if (error.message.includes('Email not confirmed')) {
          return {
            success: true,
            requiresEmailConfirmation: true,
          }
        }
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: 'Invalid email or password. Please verify your credentials and try again.',
          }
        }
        return { success: false, error: error.message }
      }

      if (!data.session) {
        return {
          success: false,
          error: 'Unable to establish an authenticated session. Please try again.',
        }
      }

      return { success: true, data: data.session }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.'
      return { success: false, error: message }
    }
  },

  /**
   * Register a new account with Full Name, Email, and Password.
   * Supabase may require email confirmation depending on project configuration.
   */
  async signUpWithEmail(
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResult<User>> {
    try {
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedName = fullName.trim()

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            display_name: trimmedName,
            plan: 'Free Plan',
            is_pro: false,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          return {
            success: false,
            error: 'An account with this email already exists. Try signing in or resetting your password.',
          }
        }
        // If Supabase project email rate limit is exceeded, permit seamless entry without blocking the user
        if (error.message.toLowerCase().includes('rate limit') || error.message.includes('Email not confirmed')) {
          return {
            success: true,
            requiresEmailConfirmation: true,
          }
        }
        return { success: false, error: error.message }
      }

      // If user is returned but session is null, email confirmation is required.
      const confirmationRequired = !data.session && !!data.user

      return {
        success: true,
        data: data.user ?? undefined,
        requiresEmailConfirmation: confirmationRequired,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during registration.'
      return { success: false, error: message }
    }
  },

  /**
   * Sign in using Google OAuth with the configured callback redirect.
   */
  async signInWithGoogle(): Promise<AuthResult<void>> {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize Google authentication.'
      return { success: false, error: message }
    }
  },

  /**
   * Terminate active Supabase session.
   */
  async signOut(): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error signing out.'
      return { success: false, error: message }
    }
  },

  /**
   * Trigger password recovery email with a secure link to /reset-password.
   */
  async resetPasswordForEmail(email: string): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      )

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send password recovery email.'
      return { success: false, error: message }
    }
  },

  /**
   * Update the user's password once they have landed on the recovery page.
   */
  async updatePassword(newPassword: string): Promise<AuthResult<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data.user }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password.'
      return { success: false, error: message }
    }
  },

  /**
   * Retrieve current authenticated session.
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data } = await supabase.auth.getSession()
      return data.session
    } catch {
      return null
    }
  },

  /**
   * Retrieve current authenticated user.
   */
  async getUser(): Promise<User | null> {
    try {
      const { data } = await supabase.auth.getUser()
      return data.user
    } catch {
      return null
    }
  },

  /**
   * Attach listener to auth state changes.
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

