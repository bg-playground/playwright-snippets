import { test, expect } from '@playwright/test';

test('stub a slow API and assert the request body', async ({ page }) => {
  await page.route('**/api/orders', async (route) => {
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
  await expect(page.getByRole('row')).toHaveCount(3);
});
