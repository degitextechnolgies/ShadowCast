import { test, expect } from '@playwright/test'

test.describe('ShadowCast Command Center Admin & Unified Auth Suite', () => {
  test('unauthenticated visit to /kyareadmin redirects to unified /login with clearance notice', async ({ page }) => {
    await page.goto('/kyareadmin')
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
    await expect(page.getByText('Command Center Clearance')).toBeVisible()
  })

  test('legacy /kyareadmin/login and /admin/login redirect directly to unified /login', async ({ page }) => {
    await page.goto('/kyareadmin/login')
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()

    await page.goto('/admin/login')
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  })

  test('admin login handles credentials admin/admin on unified /login and grants entry to /kyareadmin', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()

    // Sign in with admin / admin
    await page.getByLabel(/email address or admin id/i).fill('admin')
    await page.getByLabel(/^password$/i).fill('admin')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Should navigate into /kyareadmin
    await page.waitForURL('**/kyareadmin')
    await expect(page.getByText('COMMAND CENTER')).toBeVisible()
    await expect(page.getByText('NVENC Relay Active (0.8ms)')).toBeVisible()
  })

  test('admin page tab navigation switches sections properly when authenticated', async ({ page }) => {
    // Authenticate via admin / admin on unified login
    await page.goto('/login')
    await page.getByLabel(/email address or admin id/i).fill('admin')
    await page.getByLabel(/^password$/i).fill('admin')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/kyareadmin')

    // Switch to Live Streams & Clients
    await page.getByRole('button', { name: /Live Streams & Clients/i }).click()
    await expect(page.getByRole('heading', { name: 'Live Mirroring Streams' })).toBeVisible()
    await expect(page.getByText('AP-South-1 (Mumbai)')).toBeVisible()

    // Switch to Pilots & Licenses
    await page.getByRole('button', { name: /Pilots & Licenses/i }).click()
    await expect(page.getByRole('heading', { name: 'Pilots & License Provisioning' })).toBeVisible()
    await expect(page.getByText('Abhishek Kumar')).toBeVisible()

    // Switch to Relay Nodes (GPU)
    await page.getByRole('button', { name: /Relay Nodes \(GPU\)/i }).click()
    await expect(page.getByRole('heading', { name: 'Global Edge Relay Nodes' })).toBeVisible()
    await expect(page.getByText('RTX 4090 Dual NVENC').first()).toBeVisible()

    // Switch to Engine Configuration
    await page.getByRole('button', { name: /Engine Configuration/i }).click()
    await expect(page.getByRole('heading', { name: 'Low-Latency Engine Parameters' })).toBeVisible()
    await expect(page.getByText('Default Hardware Video Encoder')).toBeVisible()

    // Switch to Audit & Telemetry Logs
    await page.getByRole('button', { name: /Audit & Telemetry Logs/i }).click()
    await expect(page.getByRole('heading', { name: 'Security & Hardware Telemetry Logs' })).toBeVisible()
  })

  test('lock terminal button terminates admin session and redirects to unified /login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email address or admin id/i).fill('admin')
    await page.getByLabel(/^password$/i).fill('admin')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/kyareadmin')

    // Click Lock Terminal
    await page.getByRole('button', { name: /Lock Terminal/i }).click()
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  })
})
