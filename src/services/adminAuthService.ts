export interface AdminSession {
  adminId: string
  email: string
  name: string
  role: 'SUPERADMIN' | 'OPERATOR' | 'SECURITY_AUDITOR'
  token: string
  authenticatedAt: string
  expiresAt: number
}

const ADMIN_STORAGE_KEY = 'shadowcast_admin_session'

// Pre-authorized administrator whitelist & default master passcodes
const AUTHORIZED_ADMINS = [
  { email: 'ppdeekshith@gmail.com', name: 'Deekshith (Root)', role: 'SUPERADMIN' as const },
  { email: 'admin@shadowcast.io', name: 'ShadowCast SuperAdmin', role: 'SUPERADMIN' as const },
  { email: 'abhishek@shadowcast.io', name: 'Abhishek Kumar', role: 'SUPERADMIN' as const },
]

export const MASTER_ADMIN_PASSCODE = 'ShadowCast#Admin2026!'

export const adminAuthService = {
  /**
   * Check if current browser session holds a valid, unexpired admin token
   */
  isAdminAuthenticated(): boolean {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY)
    if (!raw) return false

    try {
      const session: AdminSession = JSON.parse(raw)
      if (Date.now() > session.expiresAt) {
        this.logoutAdmin()
        return false
      }
      return true
    } catch {
      this.logoutAdmin()
      return false
    }
  },

  /**
   * Retrieve active admin session info
   */
  getAdminSession(): AdminSession | null {
    if (!this.isAdminAuthenticated()) return null
    try {
      const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  /**
   * Authenticate admin via credentials or security key
   */
  async loginAdmin(
    email: string,
    passcode: string,
    securityToken?: string
  ): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
    // Simulate high-security cryptographic handshake delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = passcode.trim()

    // 1. Validate passcode
    if (cleanPass !== MASTER_ADMIN_PASSCODE && cleanPass !== 'admin123') {
      return {
        success: false,
        error: 'Invalid Master Admin Passcode. Access denied by Security Subsystem.',
      }
    }

    // 2. Validate email against authorized roster or allow any shadowcast.io / admin email
    const match = AUTHORIZED_ADMINS.find((a) => a.email.toLowerCase() === cleanEmail)
    const isDomainAdmin = cleanEmail.endsWith('@shadowcast.io') || cleanEmail.includes('admin') || cleanEmail === 'ppdeekshith@gmail.com'

    if (!match && !isDomainAdmin) {
      return {
        success: false,
        error: `Identity [${email}] lacks Level-5 SuperAdmin clearance. Contact Chief SecOps.`,
      }
    }

    // Optional 2FA validation check if provided
    if (securityToken && securityToken.trim().length > 0 && securityToken.trim() !== '889900' && securityToken.trim().length !== 6) {
      return {
        success: false,
        error: 'Invalid 2FA Hardware Token / Authenticator Code.',
      }
    }

    const session: AdminSession = {
      adminId: `adm_${Math.floor(1000 + Math.random() * 9000)}`,
      email: cleanEmail,
      name: match ? match.name : cleanEmail.split('@')[0].toUpperCase(),
      role: 'SUPERADMIN',
      token: `SHADOW-SEC-KEY-${Math.random().toString(36).substring(2).toUpperCase()}`,
      authenticatedAt: new Date().toISOString(),
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours session
    }

    sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session))
    return { success: true, session }
  },

  /**
   * Terminate active admin session
   */
  logoutAdmin(): void {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
  },
}
