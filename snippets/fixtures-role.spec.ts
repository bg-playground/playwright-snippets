import AxeBuilder from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';

type Fixtures = {
  authedPage: import('@playwright/test').Page;
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<Fixtures>({
  authedPage: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    try {
      await use(page);
    } finally {
      await context.close();
    }
  },
  makeAxeBuilder: async ({ authedPage }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page: authedPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .include('#main');
    await use(makeAxeBuilder);
  },
});

test('dashboard scan uses the shared axe fixture', async ({ authedPage, makeAxeBuilder }) => {
  await authedPage.goto('/dashboard');
  const results = await makeAxeBuilder().analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});
