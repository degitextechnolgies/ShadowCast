import { test, expect } from '@playwright/test'

test.describe('ShadowCast Authentication Suite', () => {
  test('unauthenticated access to /dashboard redirects to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login**')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  })

  test('login page renders two-column layout with brand headline and auth card', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Your Screen. Beyond Limits.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
    await expect(page.getByLabel(/email address/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('login validation alerts for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email address/i).fill('test-pilot@example.com')
    await page.getByLabel(/^password$/i).fill('invalid-pass-1234')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Expect error alert notice to appear
    const alert = page.locator('text=/Invalid email or password|credentials|error/i').first()
    await expect(alert).toBeVisible({ timeout: 10000 })
  })

  test('registration page has password strength meter and validation', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()

    const passwordInput = page.getByLabel(/^password$/i)
    await passwordInput.fill('Weak1')
    await expect(page.getByText(/password strength:/i)).toBeVisible()

    await passwordInput.fill('UltraStrong#2026!Key')
    await expect(page.getByText(/ultra strong/i)).toBeVisible()
  })

  test('forgot password page dispatches reset link', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible()
    await page.getByLabel(/email address/i).fill('reset-test@shadowcast.io')
    await page.getByRole('button', { name: 'Send Reset Link' }).click()

    await expect(
      page.locator('text=/recovery link dispatched|sent a password reset link/i').first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('mobile responsiveness on /login has no horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')
    await page.waitForTimeout(500)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    expect(overflow).toBe(false)
  })

  test('login page with credentials admin/admin grants admin clearance and opens /kyareadmin', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email address/i).fill('admin')
    await page.getByLabel(/^password$/i).fill('admin')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await page.waitForURL('**/kyareadmin')
    await expect(page.getByText('COMMAND CENTER')).toBeVisible()
    await expect(page.getByText('NVENC Relay Active (0.8ms)')).toBeVisible()
  })

  test('account creation logs user in directly to dashboard without requiring confirmation', async ({ page }) => {
    const randomEmail = `pilot-${Date.now()}@shadowcast.io`
    await page.goto('/register')
    await page.getByLabel(/full name/i).fill('Marcus Vance')
    await page.getByLabel(/email address/i).fill(randomEmail)
    await page.getByLabel(/^password$/i).fill('StrongPass#2026!')
    await page.getByLabel(/confirm password/i).fill('StrongPass#2026!')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Create Account' }).click()

    await page.waitForURL('**/dashboard', { timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Marcus Vance' })).toBeVisible()
  })

  test('once logged in, visiting root / redirects straight to /dashboard and landing page never pops up', async ({ page }) => {
    const randomEmail = `pilot-route-${Date.now()}@shadowcast.io`
    await page.goto('/register')
    await page.getByLabel(/full name/i).fill('Elena Vance')
    await page.getByLabel(/email address/i).fill(randomEmail)
    await page.getByLabel(/^password$/i).fill('StrongPass#2026!')
    await page.getByLabel(/confirm password/i).fill('StrongPass#2026!')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Create Account' }).click()
    await page.waitForURL('**/dashboard')
    await expect(page.getByRole('heading', { name: 'Elena Vance' })).toBeVisible()

    // Navigate to root /
    await page.goto('/')

    // Should automatically bounce to /dashboard
    await page.waitForURL('**/dashboard')
    await expect(page.getByRole('heading', { name: 'Elena Vance' })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Sign In$/i })).toHaveCount(0)
  })

  test('homepage AuthModal accepts admin/admin without browser validation block and navigates to /kyareadmin', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign In' }).first().click()
    await expect(page.getByRole('heading', { name: 'Welcome to Shadow Cast' })).toBeVisible()

    // Fill admin credentials without '@' symbol
    await page.getByPlaceholder('name@example.com').fill('admin')
    await page.getByPlaceholder('••••••••').fill('admin')
    await page.getByRole('button', { name: /Sign In to Dashboard/i }).click()

    // Verified: routes to /kyareadmin
    await page.waitForURL('**/kyareadmin')
    await expect(page.getByText('COMMAND CENTER')).toBeVisible()
    await expect(page.getByText('NVENC Relay Active (0.8ms)')).toBeVisible()
  })

  test('Google OAuth initiation triggers Supabase OAuth redirect', async ({ page }) => {
    await page.goto('/login')
    const googleBtn = page.getByRole('button', { name: 'Continue with Google' })
    await expect(googleBtn).toBeVisible()

    // Intercept outbound navigation to verify correct OAuth URL construction
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('supabase.co/auth/v1/authorize?provider=google')),
      googleBtn.click(),
    ])

    expect(request.url()).toContain('provider=google')
    expect(request.url()).toContain('redirect_to=')
  })

  test('/auth/callback handles cancelled or denied OAuth request cleanly', async ({ page }) => {
    await page.goto('/auth/callback?error=access_denied&error_description=The+user+denied+the+request')
    await expect(page.getByText('Authentication Failed')).toBeVisible()
    await expect(page.getByText(/cancelled or access denied/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Return to Sign In' })).toBeVisible()

    // Clicking return routes back to /login
    await page.getByRole('button', { name: 'Return to Sign In' }).click()
    await page.waitForURL('**/login')
  })

  test('session persistence and logout functions properly', async ({ page }) => {
    const randomEmail = `persist-${Date.now()}@shadowcast.io`
    await page.goto('/register')
    await page.getByLabel(/full name/i).fill('Session Tester')
    await page.getByLabel(/email address/i).fill(randomEmail)
    await page.getByLabel(/^password$/i).fill('StrongPass#2026!')
    await page.getByLabel(/confirm password/i).fill('StrongPass#2026!')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Create Account' }).click()
    await page.waitForURL('**/dashboard')

    // Reload page to verify session persistence
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Session Tester' })).toBeVisible()

    // Sign out
    await page.getByRole('button', { name: /Sign Out/i }).first().click()
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  })

  test('landing page with OAuth hash automatically forwards to callback and does not leave user stranded', async ({ page }) => {
    // When Google OAuth returns to root /#access_token=..., forward directly
    await page.goto('/#access_token=dummy_token&token_type=bearer&expires_in=3600')
    await page.waitForURL('**/auth/callback#access_token=**')
  })
})


