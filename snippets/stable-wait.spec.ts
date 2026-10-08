import { test, expect } from '@playwright/test';

test('wait for observable state instead of a fixed sleep', async ({ page }) => {
  await page.goto('/orders');
  // Register before the click so a fast response cannot be missed.
  const responsePromise = page.waitForResponse(
    (response) => new URL(response.url()).pathname === '/api/orders'
      && response.request().method() === 'GET',
  );
  await page.getByRole('button', { name: 'Refresh' }).click();
  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();
  // Auto-retries while the UI renders; sleeping 1000ms would only guess readiness.
  await expect(page.getByRole('status')).toHaveText('Orders updated');
});
