// tests/homePage.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants';
import { homePageLocators } from '../../locators/home-page-locators';

test.describe('Home Page Verification', () => {
  test('Navigate to Home Page and verify components', async ({ page }) => {
    // Create an instance of the HomePage class
    const homePage = new HomePage(page);

    // Step 1: Navigate to the home page
    await homePage.navigateToHomePage();
    await homePage.verifyHomePageTitle();
    await homePage.handleEULADialog();
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