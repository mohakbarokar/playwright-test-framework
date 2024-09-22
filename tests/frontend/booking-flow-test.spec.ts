import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { homePageLocators } from '../../locators/home-page-locators';
import { CommonPage } from '../../pages/common-page';
import { LoginPage } from '../../pages/login-page';
import { LOGIN_PAGE_CONSTANTS } from '../../constants/login-page-constants';
import { HOME_PAGE_CONSTANTS } from '../../constants/home-page-constants';
import { loginPageLocators } from '../../locators/login-page-locators';
import { ProfilePage } from '../../pages/profile-page';
import { configuratorPageLocators } from '../../locators/configurator-page-locators';
import { CONFIGURATOR_PAGE_CONSTANTS } from '../../constants/configurator-page-constants';
import { ConfiguratorPage } from '../../pages/configurator-page';
import { genericLocators } from '../../locators/generic-locators';
import { profilePageLocators } from '../../locators/profile-page-locators';
import { PORTAL_USER_DETAILS } from '../../constants/portal-user-details';
import { PROFILE_PAGE_CONSTANTS } from '../../constants/profile-page-constants';

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
        const configuratorPage = new ConfiguratorPage(page);

        let currentCars = 0;
        let carsAfterBooking = 0;
        let finalPriceConfigurationPage;
        let totalOrderValueCustomerDetailsSubmitPage;

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
            await commonPage.waitForPageToLoad(configuratorPageLocators.CONFIGURATOR_GALLERY_ID, CONFIGURATOR_PAGE_CONSTANTS.CONFIGURATOR_PAGE_TITLE, CONFIGURATOR_PAGE_CONSTANTS.CONFIGURATOR_PAGE_LOAD_TIMEOUT);
        });

        await test.step('Verify if there are any broken images on Configurator Page', async () => {
            await commonPage.checkAndVerifyBrokenImages();
        });

        await test.step('Selecting configuration for car and verifying price on configurator and checkout page', async () => {
            finalPriceConfigurationPage = await configuratorPage.selectConfigurationForCar();
            totalOrderValueCustomerDetailsSubmitPage = await configuratorPage.submitCustomerDetails();

            // Verify that the final price and total order value are equal
            expect(finalPriceConfigurationPage, `Verifying if final price from configuration page (${finalPriceConfigurationPage}) matches total order value from customer details submit page (${totalOrderValueCustomerDetailsSubmitPage})`).toBe(totalOrderValueCustomerDetailsSubmitPage);
            await configuratorPage.selectDirectPaymentAndConfirm();
        });

        await test.step('Selecting payment option and Navigating to Profile page to verify cars in account', async () => {
            await configuratorPage.selectDirectPaymentAndConfirm();
            await homePage.clickOnOptionByTitle(homePageLocators.NAVIGATION_ICONS.USER_ACCOUNT_BTN_TITLE);

            // Wait for the profile page to load
            await commonPage.waitForPageToLoad(genericLocators.ELEMENT_WITH_TEXT(profilePageLocators.PROFILE_NAME_ELEMENT_TYPE, PORTAL_USER_DETAILS.correct.name), PROFILE_PAGE_CONSTANTS.PROFILE_PAGE_TITLE, PROFILE_PAGE_CONSTANTS.PROFILE_PAGE_LOAD_TIMEOUT);

            //Getting number of cars after booking
            carsAfterBooking = await profilePage.getCurrentNumberOfCars();
            console.log(`Cars After Booking : ${carsAfterBooking}`);

            // Verify that the final price and total order value are equal
            expect(carsAfterBooking, `Verifying if number of cars after booking :(${carsAfterBooking}) is 1 more than prior to booking : (${currentCars})`).toBe(currentCars + 1);

        });
    });
});