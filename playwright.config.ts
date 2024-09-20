import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  retries: 0,
  reporter: [
    ['list'],  // Terminal list reporter
    ['html', { outputFolder: 'html-report', open: 'never' }],  // HTML report
    ['allure-playwright'],  // Allure reporter
    ['junit', { outputFile: 'test-results/results.xml' }] // JUnit report
  ],
  use: {
    headless: false,
    baseURL: 'https://www.polestar.com/se',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results/',

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
      use: {
        // baseURL: 'https://api.yourservice.com',  // Your API's base URL
        // extraHTTPHeaders: {
        //   'Authorization': `Bearer YOUR_API_TOKEN`,  // Add API-specific headers
        // },
      },
    }
  ],

  // Optional workers setup for parallel execution
  // workers: 4,
};

export default config;