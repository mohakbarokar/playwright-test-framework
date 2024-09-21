// // tests/homePage.spec.ts
// import { test, expect } from '@playwright/test';
// // import { HomePage } from '../pages/HomePage'; // Import HomePage class
// // import { homePageConstants } from '../constants/homePageConstants'; // Import constants

// test.describe('Home Page Navigation and Actions', () => {
//   test('Navigate to Home Page and click on a title', async ({ page }) => {
//     // Create an instance of the HomePage class
//     const homePage = new HomePage(page);

//     // Step 1: Navigate to the home page
//     await homePage.navigateToHomePage();

//     // Verify that we have successfully navigated by checking the page title
//     const title = await homePage.homePageTitle();
//     expect(title).toBe('Expected Page Title');  // Replace with the expected page title

//     // Step 2: Click on a specific title (assuming the title link exists)
//     const titleToClick = 'About Us'; // Example title
//     await homePage.clickOnOptionByTitle(page, titleToClick);

//     // Optionally, you can add assertions here to verify the navigation after clicking the title
//     await expect(page).toHaveURL(/.*about-us/); // Check if URL contains 'about-us'
//   });
// });