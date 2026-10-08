import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('text meets the 4.5:1 contrast ratio', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  const violations = results.violations.filter((violation) => violation.id === 'color-contrast');
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
