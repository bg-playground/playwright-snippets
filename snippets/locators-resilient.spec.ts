import { test, expect } from '@playwright/test';

test('prefer role, label, and text over CSS', async ({ page }) => {
  await page.goto('/checkout');

  const email = page.getByLabel('Email');
  await email.fill('qa@example.com');

  await page.getByRole('combobox', { name: 'Country' }).selectOption('US');
  await page.getByRole('button', { name: 'Place order' }).click();

  const row = page.getByRole('row').filter({ hasText: 'Order total' });
  await expect(row.getByRole('cell').nth(1)).toHaveText('$42.00');

  await expect(page.getByText('Order confirmed', { exact: true })).toBeVisible();
});

test('disambiguate two buttons with the same name', async ({ page }) => {
  await page.goto('/cart');
  const dialog = page.getByRole('dialog', { name: 'Remove item' });
  await page.getByRole('button', { name: 'Remove' }).first().click();
  await dialog.getByRole('button', { name: 'Remove' }).click();
  await expect(dialog).toBeHidden();
});
