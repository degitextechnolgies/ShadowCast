import { test, expect } from '@playwright/test'

const viewports = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]

for (const w of viewports) {
  test(`no horizontal overflow at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 })
    await page.goto('/')
    await page.waitForTimeout(1000)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    expect(overflow, `overflow at ${w}`).toBe(false)
  })
}

test('mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/')
  await page.click('button[aria-label="menu"]')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Download for Windows' })).toBeVisible()
})
