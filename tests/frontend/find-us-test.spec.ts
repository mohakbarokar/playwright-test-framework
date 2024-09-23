import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { homePageLocators } from '../../locators/home-page-locators';
import { CommonPage } from '../../pages/common-page';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants';
import { findUsPageLocators } from '../../locators/find-us-page-locators';
import { FIND_US_PAGE_CONSTANTS } from '../../constants/find-us-page-constants';
import { FindUsPage } from '../../pages/find-us-page';

/**
 * Test suite for verifying Find Us functionality.
 * 
 * This test suite navigates to the find us page and verifies find us feature
 */
test.describe('Find Us Page Verification', () => {
    test('Navigate to Find Us Page and verify find location functionality', async ({ page }) => {
        // Create an instance of the HomePage class
        const homePage = new HomePage(page);
        const commonPage = new CommonPage(page);
        const findUsPage = new FindUsPage(page);

        await test.step('Navigate to Home Page and verify if page loaded', async () => {
            await homePage.navigateToHomePage();
            await commonPage.verifyPageTitle(HOME_PAGE_CONSTANTS.HOME_PAGE_TITLE);
            await homePage.handleEULADialog();
        });

        await test.step('Click on Fund Us Option and Verify find us page loads', async () => {
            await homePage.clickOnOptionByTitle(homePageLocators.NAVIGATION_ICONS.FIND_US_BTN_TITLE);
            await commonPage.waitForPageToLoad(findUsPageLocators.SPACES_HEADING_LABEL_XPATH, FIND_US_PAGE_CONSTANTS.FIND_US_PAGE_TITLE, FIND_US_PAGE_CONSTANTS.FIND_US_PAGE_LOAD_TIMEOUT);
        });

        await test.step('Search string and verify options matches entered string with autocompletion', async () => {
            await findUsPage.findPolestarLocation(FIND_US_PAGE_CONSTANTS.SWEDEN_INITIALS_TEXT);
        });

        await test.step('Search string and verify options matches entered postal code', async () => {
            await findUsPage.findPolestarLocation(FIND_US_PAGE_CONSTANTS.FARSTA_POSTAL_CODE);
        });
    });
});