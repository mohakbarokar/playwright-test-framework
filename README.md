# playwright-test-automation-framework

## To install playwright dependencies

npm init playwright@latest

npx playwright install

## To install Allure command line tool

npm install -g allure-commandline

## Framework Details

The Playwright test automation framework is used for testing frontend(UI) across multiple browsers ( Chromimum, Firefox, Webkit) as well as backend(API) test scenarios. All tests are kept inside /tests/ folder. Further bifurcation is done for frontened and backend folder for batter managmenet of test. The automation tests follows POM (Page Object Model) to perform functions across different pages.(AKA consider each web page of an application as a class file kept inside /pages folder.)

i.	Constants: Framework/Application related constants are stored in the form of json objects in constants folder. Ex: urls, user details, page constants, api constants, etc.

ii.	Locators: Locators are stored in the form of json objects in locators folder for specific pages also generic locators which can be applicable to any page are kept separately in generic-locators.ts file

iii. node_modules: Contains all the dependencies required for scripting, executing, and creating the report. These modules can be generate after entering installation commands( See installation section above)

iv. Pages: The pages folder contains multiple page object files (each page of an application as a class file).These pages contains various methods or verification operations automated for the specific page which can be invoked with values in test.spec file 

v. Utilities: Utils folder contains utility methods which might be required for additional operations on data such as string manipulation etc.

vi. test-eesults: This folder contains all the execution results in the json format and xml format and helps in generation of html and allure report. Note: Generated only after test execution.

vii. allure-report: This folder contains all the execution results, screenshot, video to produce allure report and generated only after running command to generate report. Command: npm run report:allure

viii. allure-results: This folder contains all the historic execution results in the json and text format.

ix. package.json file: This file contains all the dependencies in. Json format. Also, this file contains multiple custom execution commands to execute test cases across different Projects. Details for custom execution commands are available further.

x. tests: Under this folder test cases are being stored. backend folder contains tests for API's and frontend folder contains tests for UI Portal.

## Script Explanation

•	All test files are stored in the tests directory with nomenclature such as {contextOfTest}-test.spec.ts
•	Used expect library for test assertions. It extends with the Playwright-specific matchers to achieve greater testing ergonomics.
•	Used test.beforeAll hook to set up resources shared between tests in Rest API tests.
•	Test case starts from from test.describe() block which contains the hooks mentioned in the above point and test() block contains the actual test code.
•	Used test.steps() contains the actual test steps implemented in test.

## Test Execution : Standard Playwright Commands

Test execution is performed by hitting following standard test execution commands 

## To Execute a single test case on firefox

npx playwright test --browser=firefox .\tests\test-login.spec.js

## To Execute a single test on all browsers i.e., (Trigger execution on all 3 browsers using 3 workers)

npx playwright test --browser=all .\tests\test-login.spec.js

## To Execute all test cases across all browsers( Chrome, Safari, Firefox )

npx playwright test --browser=all

##	To Execute test cases parallelly using workers support of 3

npx playwright test –workers=3 

##	To Execute test case with retry count 3

npx playwright test –retry=3 

## Test Execution : Custom Commands

Test execution is performed by hitting customs test execution commands defined in package.json file in Terminal.

## To Execute only frontend tests
    
npm run test:frontend

## To Execute only frontend tests in parallel

npm run test:frontend:parallel

## To Execute only frontend tests in Chrome

npm run test:frontend:chrome

## To Execute only frontend tests in Firefox

npm run test:frontend:firefox

## To Execute only frontend tests in Webkit(Safari)

npm run test:frontend:webkit

## To Execute only backend tests

npm run test:backend

## To Execute only backend tests in parallel

npm run test:backend:parallel

## To Execute all tests (frontend and backend)

npm run test:all

## To Execute all tests (frontend and backend) in parrallel with 50% cpu core

npm run test:all:parallel

##	Test Reporting

The test case execution reporting is taken care two different kind of reports -

1. HTML report:
HTML report is generated in html-report folder in html file format known as index.html

## To Open html report

npx playwright show-report html-report

2. Allure report: 
Though, html report provides detailed view of test execution, but does not provide any graphical representation. To get a better graphical representation of test execution report, allure report can be generated with below mentioned commands

## To Generate allure report (allure cmd line dependency needed, details in installation step)

npm run report:generate

## To Open allure report (allure cmd line dependency needed, details in installation step)

npm run report:open

## To Generate and Open allure report (allure cmd line dependency needed, details in installation step)
npm run report:allure
