import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// WCAG AA: normal text 4.5:1; large text 3:1. Review axe incomplete results manually.
// This rule does not establish non-text contrast or full WCAG conformance.
test('axe finds no automatically detectable text contrast violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  const violations = results.violations.filter((violation) => violation.id === 'color-contrast');
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
