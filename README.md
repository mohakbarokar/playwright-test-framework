# Playwright Test Automation Framework

## Overview
The Playwright Test Automation Framework is designed for comprehensive testing of both frontend (UI) and backend (API) scenarios across multiple browsers, including Chromium, Firefox, and WebKit.

## Installation

### Install Playwright Dependencies
```bash
npm init playwright@latest
npx playwright install
```

### Install Allure Command Line Tool
```bash
npm install -g allure-commandline
```

## Framework Structure

### Directory Overview
- **/tests/**: Contains all test cases, organized into `frontend` and `backend` folders for better management.
- **/pages/**: Implements the Page Object Model (POM) where each web page corresponds to a class file containing methods for operations and verifications.
- **/constants/**: Stores framework/application-related constants in JSON format (e.g., URLs, user details).
- **/locators/**: Contains locators for specific pages in JSON format. Generic locators are stored separately in `generic-locators.ts`.
- **/utils/**: Houses utility methods for additional operations like string manipulation.
- **/test-results/**: Contains execution results in JSON and XML formats, aiding HTML and Allure report generation (generated post-execution).
- **/allure-report/**: Stores execution results, screenshots, and videos for Allure reports (generated after running the report command).
- **/allure-results/**: Keeps historical execution results in JSON and text formats.
- **package.json**: Lists all dependencies and custom execution commands.

## Script Explanation

- Test files are named in the format `{contextOfTest}-test.spec.ts`.
- The `expect` library is used for assertions, extended with Playwright-specific matchers.
- The `test.beforeAll` hook sets up shared resources for REST API tests.
- Each test begins with a `test.describe()` block, containing hooks and the actual test logic within `test()`.
- Test steps are encapsulated within `test.steps()`.

## Test Execution

### Standard Playwright Commands
- **Execute a single test case on Firefox**:
  ```bash
  npx playwright test --browser=firefox ./tests/test-login.spec.js
  ```
- **Execute a single test on all browsers**:
  ```bash
  npx playwright test --browser=all ./tests/test-login.spec.js
  ```
- **Execute all test cases across all browsers**:
  ```bash
  npx playwright test --browser=all
  ```
- **Execute tests in parallel with 3 workers**:
  ```bash
  npx playwright test --workers=3
  ```
- **Execute test case with a retry count of 3**:
  ```bash
  npx playwright test --retry=3
  ```

### Custom Commands
Execute tests using custom commands defined in `package.json`:
- **Execute only frontend tests**:
  ```bash
  npm run test:frontend
  ```
- **Execute only backend tests**:
  ```bash
  npm run test:backend
  ```
- **Execute all tests (frontend and backend)**:
  ```bash
  npm run test:all
  ```
- **Execute all tests in parallel with 50% CPU core**:
  ```bash
  npm run test:all:parallel
  ```

## Test Reporting

### HTML Report
An HTML report is generated in the `html-report` folder.
- **To open the HTML report**:
  ```bash
  npx playwright show-report html-report
  ```

### Allure Report
For a graphical representation of test execution:
- **Generate Allure report**:
  ```bash
  npm run report:generate
  ```
- **Open Allure report**:
  ```bash
  npm run report:open
  ```
- **Generate and open Allure report**:
  ```bash
  npm run report:allure
  ```