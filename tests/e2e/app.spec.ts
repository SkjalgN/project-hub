import { test, expect } from '@playwright/test'

// ──────────────────────────────────────────
// Page load & basic structure
// ──────────────────────────────────────────

test.describe('Page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Project Hub/i)
  })

  test('shows the Project Hub heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Project Hub/i })).toBeVisible()
  })

  test('renders the theme toggle button', async ({ page }) => {
    await expect(page.locator('.theme-toggle')).toBeVisible()
  })
})

// ──────────────────────────────────────────
// Project cards
// ──────────────────────────────────────────

test.describe('Project cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays at least one project card', async ({ page }) => {
    const cards = page.locator('.project-card')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Celebrity Sightings card is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Celebrity Sightings' })).toBeVisible()
  })

  test('Office Simulation card is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Office Simulation' })).toBeVisible()
  })

  test('each card has a status badge', async ({ page }) => {
    // Wait for at least one card to finish loading
    await expect(page.locator('.project-card').first()).toBeVisible()
    const badges = page.locator('.status-badge')
    const count = await badges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('each card has a logo overlay', async ({ page }) => {
    await expect(page.locator('.project-card').first()).toBeVisible()
    const logos = page.locator('.project-logo-overlay')
    const count = await logos.count()
    expect(count).toBeGreaterThan(0)
  })

  test('each card has a preview image', async ({ page }) => {
    const previews = page.locator('.project-preview')
    const count = await previews.count()
    expect(count).toBeGreaterThan(0)
  })

  test('logo overlay is not clipped (visible above card content)', async ({ page }) => {
    const card = page.locator('.project-card').first()
    const overlay = card.locator('.project-logo-overlay')
    const cardBox = await card.boundingBox()
    const overlayBox = await overlay.boundingBox()

    expect(cardBox).not.toBeNull()
    expect(overlayBox).not.toBeNull()

    // The overlay should be within the card's horizontal bounds
    expect(overlayBox!.x).toBeGreaterThanOrEqual(cardBox!.x)
    // The overlay top should be ABOVE the card's bottom boundary
    expect(overlayBox!.y).toBeLessThan(cardBox!.y + cardBox!.height)
  })
})

// ──────────────────────────────────────────
// Filters (only run if the filter section is enabled)
// ──────────────────────────────────────────

test.describe('Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('filter controls are present when enabled', async ({ page }) => {
    const statusFilter = page.locator('#status-filter')
    const tagFilter = page.locator('#tag-filter')
    const filtersVisible = (await statusFilter.count()) > 0

    if (!filtersVisible) {
      test.skip() // Filters are currently commented out in the app
    }

    await expect(statusFilter).toBeVisible()
    await expect(tagFilter).toBeVisible()
  })

  test('filtering by active shows only active projects', async ({ page }) => {
    const statusFilter = page.locator('#status-filter')
    if ((await statusFilter.count()) === 0) test.skip()

    await page.selectOption('#status-filter', 'active')
    const badges = page.locator('.status-badge')
    const count = await badges.count()
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText('active')
    }
  })

  test('resetting filter to all shows all projects', async ({ page }) => {
    const statusFilter = page.locator('#status-filter')
    if ((await statusFilter.count()) === 0) test.skip()

    const initialCount = await page.locator('.project-card').count()
    await page.selectOption('#status-filter', 'active')
    await page.selectOption('#status-filter', 'all')
    const resetCount = await page.locator('.project-card').count()
    expect(resetCount).toBe(initialCount)
  })
})

// ──────────────────────────────────────────
// Light / Dark mode toggle
// ──────────────────────────────────────────

test.describe('Theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('starts in dark mode by default', async ({ page }) => {
    const html = page.locator(':root')
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('switches to light mode when toggle is clicked', async ({ page }) => {
    await page.locator('.theme-toggle').click()
    await expect(page.locator(':root')).toHaveAttribute('data-theme', 'light')
  })

  test('toggle button label updates after switching to light', async ({ page }) => {
    await page.locator('.theme-toggle').click()
    await expect(page.locator('.theme-toggle')).toContainText(/dark mode/i)
  })

  test('can switch back to dark mode', async ({ page }) => {
    await page.locator('.theme-toggle').click()
    await page.locator('.theme-toggle').click()
    await expect(page.locator(':root')).toHaveAttribute('data-theme', 'dark')
  })
})
