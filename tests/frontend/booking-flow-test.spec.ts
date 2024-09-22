import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { homePageLocators } from '../../locators/home-page-locators';
import { CommonPage } from '../../pages/common-page';
import { LoginPage } from '../../pages/login-page';
import { LOGIN_PAGE_CONSTANTS } from '../../constants/login-page-constants';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants';
import { loginPageLocators } from '../../locators/login-page-locators';
import { ProfilePage } from '../../pages/profile-page';

/**
 * Test suite for verifying Booking Flow.
 * 
 * This test suite navigates to the login page
 * 
 */
test.describe('Booking Flow Verification', () => {
    test('Login in Portal and Book Vehicle Verification', async ({ page }) => {
        // Create instances of the page classes
        const homePage = new HomePage(page);
        const commonPage = new CommonPage(page);
        const loginPage = new LoginPage(page);
        const profilePage = new ProfilePage(page);
        let currentCars = 0;

        await test.step('Navigate to Home Page and verify if page loaded', async () => {
            await homePage.navigateToHomePage();
            await commonPage.verifyPageTitle(HOME_PAGE_CONSTANTS.HOME_PAGE_TITLE);
            await homePage.handleEULADialog();
        });

        await test.step('Click on User Profile Option and Verify login Page loads', async () => {
            await homePage.clickOnOptionByTitle(homePageLocators.NAVIGATION_ICONS.USER_ACCOUNT_BTN_TITLE);
            await commonPage.waitForPageToLoad(loginPageLocators.LOGIN_BTN_ID, LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_TITLE, LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_LOAD_TIMEOUT);
        });

        await test.step('Verify Login with correct credentials', async () => {
            await loginPage.verifyCorrectLogin();
        });

        await test.step('Get Current Cars in Your Cars section and Verify Your Cars', async () => {
            currentCars = await profilePage.getCurrentNumberOfCars();
            console.log(`Current cars : ${currentCars}`)
        });

        await test.step('Initiating Booking for Car', async () => {
            await commonPage.hoverOnNavigationButton(homePageLocators.NAVIGATION_BUTTONS.POLESTAR_4);
            await profilePage.clickOnDesignAndOrderLink();
            // await page.waitForTimeout(20000);

        });
    });
});