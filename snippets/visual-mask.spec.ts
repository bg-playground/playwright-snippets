import { test, expect } from '@playwright/test';

test('homepage screenshot ignores unstable regions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { name: 'Welcome' }).waitFor();

  await expect(page).toHaveScreenshot('home.png', {
    mask: [
      page.getByTestId('ad-slot'),
      page.getByTestId('avatar'),
      page.getByText(/\d{1,2}:\d{2}/),
    ],
    maxDiffPixelRatio: 0.01,
  });
});
