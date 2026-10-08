import { test, expect } from '@playwright/test';

test('stub an order API and assert the POST body', async ({ page }) => {
  await page.route('**/api/orders', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    const body = route.request().postDataJSON() as { sku: string };
    expect(body.sku).toBe('WIDGET-1');
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'ord_123', status: 'created' }),
    });
  });

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByText('ord_123')).toBeVisible();
});

test('wait for the real response before asserting the UI', async ({ page }) => {
  await page.goto('/orders');
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/orders') && response.request().method() === 'GET',
  );
  await page.getByRole('button', { name: 'Refresh' }).click();
  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();
  // Scope to the body so the column-header row is not counted.
  await expect(page.locator('tbody').getByRole('row')).toHaveCount(3);
});
