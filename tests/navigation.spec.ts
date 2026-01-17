import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Sunday AI Work/)
    await expect(page.getByText('Exploring the intersection of artificial intelligence')).toBeVisible()
  })

  test('should navigate to the blog page', async ({ page }) => {
    await page.goto('/blog')
    // Adjust expectation based on actual content, checking for "Blog" heading
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible()
  })

  test('should navigate to the about page', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { name: 'About Sunday AI Work' })).toBeVisible()
  })

  test('should navigate to the contact page', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible()
  })
})
