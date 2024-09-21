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

    await test.step('Navigate to Home Page', async () => {
      await homePage.navigateToHomePage();
    });

    await test.step('Verify Page Title', async () => {
      await homePage.verifyHomePageTitle();
    });

    await test.step('Check EULA Dialog', async () => {
      await homePage.handleEULADialog();
    });

    await test.step('Verify highlighted models displayed on Home Page', async () => {
      await homePage.verifyDisplayedModels();
    });

    await test.step('Verify Polestar Discover buttons for each car model', async () => {
      const modelNumbers = Object.values(HOME_PAGE_CONSTANTS.POLESTAR_CAR_MODEL_NUMBERS);
      for (const number of modelNumbers) {
        await homePage.verifyPolestarDiscoverButton(number);
      }
    });

    await test.step('Verify icons in Navigation Bar', async () => {
      await homePage.verifyNavigationMenuIconsVisibility(homePageLocators.NAVIGATION_ICONS);
    });

    await test.step('Verify buttons and their text in Navigation Bar', async () => {
      await homePage.verifyNavigationMenuButtonsVisibility(homePageLocators.NAVIGATION_BUTTONS);
    });
  });
});