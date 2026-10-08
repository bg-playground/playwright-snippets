import { test, expect } from '@playwright/test';

/**
 * Log in once, save storageState, reuse it.
 * Replace the URL, selectors, and credential source before pasting.
 * Do not commit the storage file if it contains a real session.
 */
const authFile = 'playwright/.auth/user.json';

test('authenticate and save storage state', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.DEMO_USER ?? 'qa@example.com');
  await page.getByLabel('Password').fill(process.env.DEMO_PASSWORD ?? 'correct-horse');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.context().storageState({ path: authFile });
});

test.describe('already signed in', () => {
  test.use({ storageState: authFile });

  test('opens the dashboard without a login form', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveCount(0);
  });
});
