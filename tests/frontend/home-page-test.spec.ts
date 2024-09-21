// tests/homePage.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants'; 

test.describe('Home Page Navigation and Actions', () => {
  test('Navigate to Home Page and click on a title', async ({ page }) => {
    // Create an instance of the HomePage class
    const homePage = new HomePage(page);

    // Step 1: Navigate to the home page
    await homePage.navigateToHomePage();
    await homePage.verifyHomePageTitle();
    await homePage.handleEULADialog();
  });
});