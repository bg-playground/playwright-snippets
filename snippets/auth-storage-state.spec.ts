import { test, expect } from '@playwright/test';

// The authenticated project loads state only after auth.setup.ts succeeds.
test('opens the dashboard with the saved session', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toHaveCount(0);
});
