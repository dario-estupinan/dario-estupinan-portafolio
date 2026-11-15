import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'line',
  timeout: 20000,
  expect: { timeout: 4000 },
  use: { baseURL: process.env.URL_BASE || 'http://localhost:4321', channel: 'chrome' },
  webServer: process.env.URL_BASE ? undefined : { command: 'npm run preview', url: 'http://localhost:4321', reuseExistingServer: true },
});
