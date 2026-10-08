import { mkdir } from 'node:fs/promises';
import { test as setup, expect } from '@playwright/test';

// Copy alongside the consumer and config. Use a dedicated test account.
setup('authenticate and save storage state', async ({ page }) => {
  const email = process.env.DEMO_USER;
  const password = process.env.DEMO_PASSWORD;
  if (!email || !password) throw new Error('Set DEMO_USER and DEMO_PASSWORD');

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await mkdir('playwright/.auth', { recursive: true });
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
