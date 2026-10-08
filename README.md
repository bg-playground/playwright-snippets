# Playwright snippets

Copy-paste specs for `@playwright/test` 1.49+. This is not a sample app and not a style guide. Drop a file into `tests/`, change the URL, and run it.

Star if a snippet saved you a debugging hour.

## Snippets

| File | Use it when |
| --- | --- |
| [snippets/auth-storage-state.spec.ts](snippets/auth-storage-state.spec.ts) | Login once, reuse `storageState`, never log in inside every test |
| [snippets/locators-resilient.spec.ts](snippets/locators-resilient.spec.ts) | Role, label, and text locators instead of CSS that breaks on a class rename |
| [snippets/network-mock.spec.ts](snippets/network-mock.spec.ts) | Stub an API, assert the request, wait for the real response |
| [snippets/accessibility-axe.spec.ts](snippets/accessibility-axe.spec.ts) | WCAG 2.1 A/AA scan with axe, scoped to `#main`, known issues excluded |
| [snippets/color-contrast.spec.ts](snippets/color-contrast.spec.ts) | Color contrast only, so a 4.03 ratio is not buried in a full scan |
| [snippets/visual-mask.spec.ts](snippets/visual-mask.spec.ts) | Screenshot diff that ignores ads, avatars, and timestamps |
| [snippets/fixtures-role.spec.ts](snippets/fixtures-role.spec.ts) | A fixture that hands every test an authenticated page and a preconfigured axe builder |

## Paste into a project

```bash
npm init -y
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'https://example.com' },
});
```

The accessibility snippet needs `@axe-core/playwright`. The others need only `@playwright/test`.

Related, not duplicated here: [playwright-field-guide](https://github.com/bg-playground/playwright-field-guide) for practices, [Playwright-Onboarding-Lab](https://github.com/bg-playground/Playwright-Onboarding-Lab) for a first CI run. Accessibility scanning as a product lives at [nat-testing.io](https://nat-testing.io). More at [BradGuider.com](https://BradGuider.com).
