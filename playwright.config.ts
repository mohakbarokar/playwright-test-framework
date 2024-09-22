import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,  // Enable retries in CI environments
  reporter: [
    ['list'],  // Terminal list reporter
    ['html', { outputFolder: 'html-report', open: 'never' }],  // HTML report
    ['allure-playwright'],  // Allure reporter
    ['junit', { outputFile: 'test-results/results.xml' }] // JUnit report
  ],
  use: {
    headless: process.env.CI ? true : false,  // Headless true in CI, false locally
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results/',

  // Default test timeout
  timeout: 360 * 1000,  // 6 minutes

  expect: {
    timeout: 90000,  // Timeout for expect assertions (90 seconds)
  },

  // Define projects for UI and API testing
  projects: [
    {
      name: 'Chromium',
      testDir: './tests/frontend',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      testDir: './tests/frontend',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      testDir: './tests/frontend',
      use: { browserName: 'webkit' },
    },
    {
      name: 'API',  // Separate project for API tests
      testDir: './tests/backend',
      use: {},
    }
  ],

  // Optional workers setup for parallel execution
  workers: process.env.CI ? 4 : undefined,  // Use 4 workers in CI, undefined locally
};

export default config;