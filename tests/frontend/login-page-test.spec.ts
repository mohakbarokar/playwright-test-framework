import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { homePageLocators } from '../../locators/home-page-locators';
import { CommonPage } from '../../pages/common-page';
import { LoginPage } from '../../pages/login-page';
import { LOGIN_PAGE_CONSTANTS } from '../../constants/login-page-constants';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants';
import { loginPageLocators } from '../../locators/login-page-locators';

/**
 * Test suite for verifying Login Flow.
 * 
 * This test suite navigates to the login page and verifies login flow
 * Invalid credentials and Inocorrect mail id format
 */
test.describe('Login Page Verification', () => {
    test('Navigate to Login Page and verify login flow', async ({ page }) => {
        // Create an instance of the HomePage class
        const homePage = new HomePage(page);
        const commonPage = new CommonPage(page);
        const loginPage = new LoginPage(page);

        await test.step('Navigate to Home Page and verify if page loaded', async () => {
            await homePage.navigateToHomePage();
            await commonPage.verifyPageTitle(HOME_PAGE_CONSTANTS.HOME_PAGE_TITLE);
            await homePage.handleEULADialog();
        });

        await test.step('Click on User Profile Option and Verify login Page loads', async () => {
            await homePage.clickOnOptionByTitle(homePageLocators.NAVIGATION_ICONS.USER_ACCOUNT_BTN_TITLE);
            await commonPage.waitForPageToLoad(loginPageLocators.LOGIN_BTN_ID, LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_TITLE, LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_LOAD_TIMEOUT);
        });

        await test.step('Verify Login Page components and texts', async () => {
            await loginPage.verifyLoginPageComponents();
        });

        await test.step('Verify Invalid Email Id format as Input', async () => {
            await loginPage.verifyInvalidEmailFormat();
        });

        await test.step('Verify Login with Incorrect credentials', async () => {
            await loginPage.verifyIncorrectLogin();
        });

        await test.step('Verify Login with correct credentials', async () => {
            await loginPage.verifyCorrectLogin();
        });
    });
});