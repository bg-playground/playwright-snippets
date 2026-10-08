<div align="center">

# 🎭 Playwright snippets

**Small examples. Clear intent. Copy → adapt → run.**

[![Validate snippets](https://github.com/bg-playground/playwright-snippets/actions/workflows/validate.yml/badge.svg)](https://github.com/bg-playground/playwright-snippets/actions/workflows/validate.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-2563eb)](LICENSE)
[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2e7d32)](https://playwright.dev/)

Auth · Locators · Network · Accessibility · Visual checks · Fixtures

</div>

A lightweight, copy-paste-first reference for Playwright Test. Choose one pattern and adapt it to your app. The routes, UI labels, responses, and credentials are illustrative; this repository does not ship a working application or a test framework.

## Quick reference

| Need | Snippet | Adapt before running |
| --- | --- | --- |
| Reuse a login | [Auth consumer](snippets/auth-storage-state.spec.ts) + [setup](snippets/auth.setup.ts) | Login flow, credentials, setup dependency |
| Resilient selectors | [Locators](snippets/locators-resilient.spec.ts) | Accessible names, dialog scope, table cells |
| Control an API response | [Network mock](snippets/network-mock.spec.ts) | Endpoint, POST body, response, table shape |
| Gate selected axe findings | [Accessibility](snippets/accessibility-axe.spec.ts) | Scan scope, severity policy, documented exclusions |
| Check text contrast | [Color contrast](snippets/color-contrast.spec.ts) | Page state and manual review of incomplete checks |
| Compare a screenshot | [Visual masks](snippets/visual-mask.spec.ts) | Mask targets, reviewed baseline, diff tolerance |
| Scan an authenticated page | [Fixtures](snippets/fixtures-role.spec.ts) | Saved state, base URL, scan scope |
| Wait for readiness | [Stable wait](snippets/stable-wait.spec.ts) | Response predicate and observable UI state |
| Test an API directly | [API request](snippets/api-request.spec.ts) | Endpoint, status, JSON contract, auth if required |
| Keep failure evidence | [Failure evidence](snippets/failure-evidence.spec.ts) | Screenshot scope, reporter and trace settings |

## Use in your project

Prerequisites: a supported Node.js version (this repo validates on Node 22), npm, a reachable app, and permission to use a dedicated test account. Browser snippets need installed Playwright browsers.

1. Copy only the needed spec into your project's test directory.
2. Install Playwright; add axe only for accessibility, contrast, or the axe fixture.
3. Replace all illustrative URLs, labels, data, and assertions with your app's contract.
4. Configure a base URL and run the chosen example.

For a new TypeScript project:

```bash
npm init -y
npm install -D @playwright/test typescript @types/node
# Only needed by the three axe examples:
npm install -D @axe-core/playwright
npx playwright install chromium
```

A minimal `playwright.config.ts` for independent examples:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000', browserName: 'chromium' },
});
```

```bash
npx playwright test tests/stable-wait.spec.ts
```

### Auth is a setup dependency

Copy [auth.setup.ts](snippets/auth.setup.ts), the [consumer](snippets/auth-storage-state.spec.ts), and the relevant project wiring from [playwright.config.ts](playwright.config.ts). Change `testDir` to your destination directory and set `baseURL` to your app. The setup project starts without saved state; the authenticated project depends on it and loads `playwright/.auth/user.json` only after login succeeds. File order alone does not guarantee this.

Set `DEMO_USER` and `DEMO_PASSWORD` in your shell or CI secret store; no fallback credentials are supplied. Add `playwright/.auth/` to **your** project's `.gitignore` too. State files contain impersonatable session data. Refresh expired state; do not use `--no-deps` on a fresh run. In UI mode, run the setup project explicitly when state needs refreshing.

The fixture example creates its own context with the configured base URL and saved state, and binds axe to that same authenticated page. It is a single-account pattern, not a role-switching system. Shared accounts are suitable only when parallel tests do not mutate shared server state. Adapt isolation/account allocation for mutating tests. See [Playwright authentication](https://playwright.dev/docs/auth).

## What the examples prove—and what they don't

- **Accessibility:** WCAG 2.1 A/AA tags select axe rules; the gate fails only serious/critical violations. Moderate/minor findings and `incomplete` results still need review. `#main` limits coverage, and excluding `#third-party-chat` leaves it untested. Keep an owner, reason, and review date for each real exclusion. An automated pass is not WCAG conformance; add keyboard, screen reader, and other manual checks. [Accessibility guidance](https://playwright.dev/docs/accessibility-testing).
- **Contrast:** AA text contrast normally requires 4.5:1, or 3:1 for large text (at least 18pt, or 14pt bold). Exceptions include inactive controls, incidental text, and logotypes. Do not round a failing ratio upward. The axe text rule does not prove non-text contrast; images, complex backgrounds, and incomplete checks may need manual assessment. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- **Waits and APIs:** register a response wait before its triggering action, then assert the UI with a retrying assertion. A successful response alone does not prove rendering finished. The request fixture checks an API without a browser; authenticated endpoints need suitable credentials or storage state. [Auto-waiting](https://playwright.dev/docs/actionability) · [API testing](https://playwright.dev/docs/api-testing).
- **Visuals and evidence:** create and review screenshot baselines in a consistent browser/OS/font environment. Masks intentionally hide regions from comparison; a 1% pixel tolerance is an example policy, not a guarantee. Failure screenshots appear in supporting reporters, such as HTML; configure `trace: 'retain-on-failure'` for richer evidence. Review artifacts for sensitive data before sharing. [Visual comparisons](https://playwright.dev/docs/test-snapshots) · [Trace viewer](https://playwright.dev/docs/trace-viewer).

## Validate this reference

```bash
npm ci
npm run typecheck
npm run validate
```

Exact direct dependency versions and the committed lockfile make installs reproducible. Validation checks local README links and asks Playwright to list the tests, catching discovery/configuration errors **without running examples, logging in, or installing browsers**. CI runs the same commands on Node 22. It does not prove selectors, endpoints, accessibility outcomes, or screenshot baselines against a real app. Run those checks in the destination project after adaptation.

## Keep exploring

- [playwright-field-guide](https://github.com/bg-playground/playwright-field-guide) — broader practices and decision guidance.
- [Playwright-Onboarding-Lab](https://github.com/bg-playground/Playwright-Onboarding-Lab) — a hands-on path to a first CI run.
- [Playwright docs](https://playwright.dev/docs/intro) — authoritative API and setup reference.
- [nat-testing.io](https://nat-testing.io) — accessibility scanning as a product.
- [BradGuider.com](https://BradGuider.com) — more from the author.

Contributions: keep each example focused, document its assumptions, and run both validation commands. Prefer small, readable patterns over abstractions. [MIT licensed](LICENSE).
