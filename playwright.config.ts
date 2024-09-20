// import { defineConfig, devices } from '@playwright/test';

// /**
//  * Read environment variables from file.
//  * https://github.com/motdotla/dotenv
//  */
// // import dotenv from 'dotenv';
// // import path from 'path';
// // dotenv.config({ path: path.resolve(__dirname, '.env') });

// /**
//  * See https://playwright.dev/docs/test-configuration.
//  */
// export default defineConfig({
//   testDir: './tests',
//   /* Run tests in files in parallel */
//   fullyParallel: true,
//   /* Fail the build on CI if you accidentally left test.only in the source code. */
//   forbidOnly: !!process.env.CI,
//   /* Retry on CI only */
//   retries: process.env.CI ? 2 : 0,
//   /* Opt out of parallel tests on CI. */
//   workers: process.env.CI ? 1 : undefined,
//   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//   reporter: 'html',
//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//   use: {
//     /* Base URL to use in actions like `await page.goto('/')`. */
//     baseURL: 'https://www.polestar.com/se',

//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     trace: 'on-first-retry',
//     headless: false,
//   },

//   /* Configure projects for major browsers */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },

//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },

//     /* Test against mobile viewports. */
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 5'] },
//     // },
//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },

//     /* Test against branded browsers. */
//     // {
//     //   name: 'Microsoft Edge',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//     // },
//     // {
//     //   name: 'Google Chrome',
//     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     // },
//   ],

//   /* Run your local dev server before starting the tests */
//   // webServer: {
//   //   command: 'npm run start',
//   //   url: 'http://127.0.0.1:3000',
//   //   reuseExistingServer: !process.env.CI,
//   // },
// });


// playwright.config.ts
// import { PlaywrightTestConfig } from '@playwright/test';

// const config: PlaywrightTestConfig = {
//   testDir: './tests',
//   retries: 1,  // If you want to configure test retries
//   reporter: [
//     ['line'],
//     ['allure-playwright']
//   ],
//   use: {
//     headless: false,  // Set headless mode as false if required
//     baseURL: 'https://www.polestar.com/se',  // Use your base URL here
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure', // Capture video for failed tests
//   },
//   outputDir: 'test-results/',  // Where the screenshots and videos will be saved
// };

// export default config;

// import { PlaywrightTestConfig } from '@playwright/test';

// const config: PlaywrightTestConfig = {
//   testDir: './tests',
//   retries: 1,  // Number of retries for failed tests
//   reporter: [
//     ['line'],
//     ['allure-playwright'],
//     ['html']
//   ],
//   use: {
//     headless: false,  // Run tests in headless mode or not
//     baseURL: 'https://www.polestar.com/se',  // Base URL for your tests
//     screenshot: 'only-on-failure',  // Capture screenshots only for failed tests
//     video: 'retain-on-failure',  // Capture video for failed tests
//   },
//   outputDir: 'test-results/',  // Directory for screenshots and videos
//   projects: [
//     {
//       name: 'Chromium',
//       use: { browserName: 'chromium' },
//     },
//     {
//       name: 'Firefox',
//       use: { browserName: 'firefox' },
//     },
//     {
//       name: 'WebKit',
//       use: { browserName: 'webkit' },
//     }
//   ],
//   // workers: 4,  // Number of workers to use for parallel execution
// };

// export default config;

import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  retries: 0,
  reporter: [
    ['list'],  // Terminal list reporter
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],  // HTML report in test-results
    ['allure-playwright'],  // Allure reporter
    ['junit', { outputFile: 'test-results/results.xml' }] //junit report
  ],
  use: {
    headless: false,
    baseURL: 'https://www.polestar.com/se',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results/',
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'WebKit', use: { browserName: 'webkit' } }
  ],
  // workers: 4,
};

export default config;