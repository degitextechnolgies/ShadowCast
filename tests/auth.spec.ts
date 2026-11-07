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

  test('homepage modal 1-click demo login grants user session and enables dashboard access', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /^Sign In$/i }).first().click()
    await expect(page.getByText('1-Click Demo Login')).toBeVisible()

    await page.getByRole('button', { name: /1-Click Demo Login/i }).click()

    await expect(page.getByText(/Logged in as Demo User/i)).toBeVisible()
    await expect(page.getByText('Alex Vance').first()).toBeVisible()

    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Alex Vance' })).toBeVisible()
    await expect(page.getByText('Pro Ultra (4K)')).toBeVisible()
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
})

