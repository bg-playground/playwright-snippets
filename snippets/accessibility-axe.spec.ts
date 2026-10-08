import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('main has no serious or critical axe findings for WCAG 2.1 A/AA tags', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .include('#main')
    // Illustrative exception: record an owner/reason and review date before use.
    // This subtree is untested, not proven accessible.
    .exclude('#third-party-chat')
    .analyze();

  // This gate permits moderate/minor findings; review all violations and incomplete results.
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});
