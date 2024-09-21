import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants';
import { homePageLocators } from '../../locators/home-page-locators';

/**
 * Test suite for verifying components on the Home Page.
 * 
 * This test suite navigates to the home page, verifies various components such as the title, displayed models,
 * EULA dialog, Polestar discover buttons, navigation icons, and navigation buttons.
 */
test.describe('Home Page Verification', () => {
  test('Navigate to Home Page and verify components', async ({ page }) => {
    // Create an instance of the HomePage class
    const homePage = new HomePage(page);

    // Navigate to the home page
    await homePage.navigateToHomePage();

    // Verify Page Title
    await homePage.verifyHomePageTitle();

    // Check if EULA Dialog is displayed and Verify components
    await homePage.handleEULADialog();

    // Verify highlighted models displayed on Home Page
    await homePage.verifyDisplayedModels();

    //Verifying the presence of Polestar Upptäck(discover) buttons for each car model.
    const modelNumbers = Object.values(HOME_PAGE_CONSTANTS.POLESTAR_CAR_MODEL_NUMBERS);
    for (const number of modelNumbers) {
      await homePage.verifyPolestarDiscoverButton(number);
    }

    //Verifying icons in Navigation Bar
    await homePage.verifyNavigationMenuIconsVisibility(homePageLocators.NAVIGATION_ICONS);
    
     //Verifying buttons and their text in Navigation Bar
     await homePage.verifyNavigationMenuButtonsVisibility(homePageLocators.NAVIGATION_BUTTONS);
  });
});