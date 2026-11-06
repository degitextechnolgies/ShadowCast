import { test, expect } from '@playwright/test'

test.describe('ShadowCast Command Center Admin & Auth Suite', () => {
  test('unauthenticated visit to /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL('**/admin/login**')
    await expect(page.getByText('RESTRICTED AREA • SEC-LVL 5')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Command Center Login' })).toBeVisible()
  })

  test('admin login handles quick demo root access and grants entry to /admin', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: 'Command Center Login' })).toBeVisible()

    // Click 1-Click Root Demo Access
    await page.getByRole('button', { name: /1-Click Root Demo Access/i }).click()

    // Should navigate into /admin
    await page.waitForURL('**/admin')
    await expect(page.getByText('COMMAND CENTER')).toBeVisible()
    await expect(page.getByText('NVENC Relay Active (0.8ms)')).toBeVisible()
  })

  test('admin page tab navigation switches sections properly when authenticated', async ({ page }) => {
    // Authenticate via quick demo
    await page.goto('/admin/login')
    await page.getByRole('button', { name: /1-Click Root Demo Access/i }).click()
    await page.waitForURL('**/admin')

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

  test('lock terminal button terminates admin session and redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByRole('button', { name: /1-Click Root Demo Access/i }).click()
    await page.waitForURL('**/admin')

    // Click Lock Terminal
    await page.getByRole('button', { name: /Lock Terminal/i }).click()
    await page.waitForURL('**/admin/login')
    await expect(page.getByRole('heading', { name: 'Command Center Login' })).toBeVisible()
  })
})
