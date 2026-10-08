import { defineConfig } from '@playwright/test';

// Illustrative wiring: replace baseURL and copy only the snippets you need.
export default defineConfig({
  testDir: './snippets',
  use: { baseURL: 'https://example.com', browserName: 'chromium' },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'authenticated',
      testMatch: /(?:auth-storage-state|fixtures-role)\.spec\.ts/,
      dependencies: ['setup'],
      use: { storageState: 'playwright/.auth/user.json' },
    },
    {
      name: 'examples',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /(?:auth-storage-state|fixtures-role)\.spec\.ts/,
    },
  ],
});
