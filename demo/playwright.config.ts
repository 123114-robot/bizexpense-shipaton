import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  use: {
    channel: 'chrome',
    baseURL: process.env.DEMO_BASE_URL || 'http://127.0.0.1:8081',
    viewport: { width: 390, height: 844 },
    video: { mode: 'on', size: { width: 390, height: 844 } },
    trace: 'retain-on-failure',
  },
  outputDir: 'test-results',
  reporter: [['line']],
});
