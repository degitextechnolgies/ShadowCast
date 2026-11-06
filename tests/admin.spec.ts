import { test, expect } from '@playwright/test'

test.describe('ShadowCast Command Center Admin Suite', () => {
  test('admin page renders Command Center header and KPI metrics', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText('COMMAND CENTER')).toBeVisible()
    await expect(page.getByText('Live Mirroring Streams')).toBeVisible()
    await expect(page.getByText('Total Registered Pilots')).toBeVisible()
    await expect(page.getByText('Throughput Bandwidth')).toBeVisible()
    await expect(page.getByText('NVENC Hardware Health')).toBeVisible()
  })

  test('admin page tab navigation switches sections properly', async ({ page }) => {
    await page.goto('/admin')

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

  test('user search filter filters pilots list in Users tab', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('button', { name: /Pilots & Licenses/i }).click()

    const searchInput = page.getByPlaceholder(/Search pilot by name/i)
    await searchInput.fill('Sarah Connor')

    await expect(page.getByText('Sarah Connor')).toBeVisible()
    await expect(page.getByText('Abhishek Kumar')).not.toBeVisible()
  })

  test('modal for issuing custom pro license opens and closes', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('button', { name: /Issue New Pro License/i }).first().click()

    await expect(page.getByRole('heading', { name: 'Issue Pro License Key' })).toBeVisible()
    await expect(page.getByPlaceholder('e.g. Elena Rostova')).toBeVisible()

    // Cancel modal
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('heading', { name: 'Issue Pro License Key' })).not.toBeVisible()
  })

  test('mobile responsiveness on /admin has no unexpected horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/admin')
    await page.waitForTimeout(500)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    expect(overflow).toBe(false)
  })
})
