import { Page, expect, request } from '@playwright/test';
import { loginPageLocators } from '../locators/login-page-locators';
import { LOGIN_PAGE_CONSTANTS } from '../constants/login-page-constants';
import { PORTAL_USER_DETAILS } from '../constants/portal-user-details';
import { CommonPage } from './common-page';
import { genericLocators } from '../locators/generic-locators';
import { PROFILE_PAGE_CONSTANTS } from '../constants/profile-page-constants';
import { profilePageLocators } from '../locators/profile-page-locators';

/**
 * LoginPage class provides utility methods for all login page interactions and verifications.
 */
export class LoginPage {
    private page: Page;
    private commonPage: CommonPage

    /**
     * Constructor to initialize the LoginPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
    }

    /**
     * Verifies the components of the login page.
     */
    async verifyLoginPageComponents() {
        // Verify link to the homepage
        const homePageLink = this.page.locator(loginPageLocators.HOME_PAGE_LINK_ROLE);
        await expect(homePageLink, 'Verifying the visibility of the Polestar homepage link').toBeVisible();

        // Verify username input field
        const usernameInput = this.page.locator(loginPageLocators.USERNAME_INPUT_ID);
        await expect(usernameInput, 'Verifying the visibility of the username input field').toBeVisible();

        // Verify password input field
        const passwordInput = this.page.locator(loginPageLocators.PASSWORD_INPUT_ID);
        await expect(passwordInput, 'Verifying the visibility of the password input field').toBeVisible();

        // Verify forgot password link
        const forgotPwdLink = this.page.locator(loginPageLocators.FORGOT_PWD_LINK);
        await expect(forgotPwdLink, 'Verifying the visibility of the forgot password link').toBeVisible();

        // Verify "Get Polestar ID" button
        const getPolestarIdBtn = this.page.locator(loginPageLocators.GET_POLESTAR_ID_BTN_ID);
        await expect(getPolestarIdBtn, 'Verifying the visibility of the Get Polestar ID button').toBeVisible();
        await expect(getPolestarIdBtn, 'Verifying text of Get Polestar ID button').toHaveText(LOGIN_PAGE_CONSTANTS.GET_POLESTAR_ID_BTN_TEXT);

        // Verify login button
        const loginBtn = this.page.locator(loginPageLocators.LOGIN_BTN_ID);
        await expect(loginBtn, 'Verifying the visibility of the login button').toBeVisible();
        await expect(loginBtn, 'Verifying text of login button').toHaveText(LOGIN_PAGE_CONSTANTS.LOGIN_BTN_TEXT);

        // Verify radio buttons
        const loginWithEmailRadioBtn = this.page.locator(loginPageLocators.LOGIN_WITH_EMAIL_RADIO_BTN_ID);
        const isEmailUnchecked = await loginWithEmailRadioBtn.isChecked();
        expect(isEmailUnchecked, 'Verifying if login with email radio button is checked by default').toBe(true);
        const loginWithPhoneRadioBtn = this.page.locator(loginPageLocators.LOGIN_WITH_PHONE_RADIO_BTN_ID);
        const isPhoneChecked = await loginWithPhoneRadioBtn.isChecked();
        expect(isPhoneChecked, 'Verifying if login with phone radio button is unchecked by default').toBe(false);

        // Verify cookie notice text
        const cookieNoticeText = this.page.locator(loginPageLocators.COOKIE_NOTICE_TEXT_ID);
        await expect(cookieNoticeText, 'Verifying the visibility of the cookie notice text').toBeVisible();
        await expect(cookieNoticeText, 'Verifying the cookie notice text').toHaveText(LOGIN_PAGE_CONSTANTS.COOKIE_NOTICE_TEXT);

        // Verify copyright text
        const copyrightText = this.page.locator(loginPageLocators.COPYRIGHT_TEXT_XPATH);
        await expect(copyrightText, 'Verifying the visibility of the copyright text').toBeVisible();
        await expect(copyrightText, 'Verifying the copyright text').toHaveText(LOGIN_PAGE_CONSTANTS.COPYRIGHT_TEXT);
    }

    /**
     * Logs in with correct credentials and verifies no error is shown.
     */
    async verifyCorrectLogin() {
        // Enter correct email and password
        await this.page.fill(loginPageLocators.USERNAME_INPUT_ID, PORTAL_USER_DETAILS.correct.email);
        await this.page.fill(loginPageLocators.PASSWORD_INPUT_ID, PORTAL_USER_DETAILS.correct.password);

        // Click on the login button
        await this.page.click(loginPageLocators.LOGIN_BTN_ID);

        // Wait for the successful login (assuming a redirection)
        await this.page.waitForSelector(loginPageLocators.LOGIN_ERROR_SECTION_ID, { state: 'hidden', timeout: LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_LOAD_TIMEOUT });

        // Verify login success by checking absence of error section or presence of dashboard element
        const errorSectionVisible = await this.page.isVisible(loginPageLocators.LOGIN_ERROR_SECTION_ID);
        expect(errorSectionVisible, 'Verifying no error section after correct login').toBeFalsy();

        // Wait for the profile page to load
        await this.commonPage.waitForPageToLoad(genericLocators.ELEMENT_WITH_TEXT(profilePageLocators.PROFILE_NAME_ELEMENT_TYPE, PORTAL_USER_DETAILS.correct.name), PROFILE_PAGE_CONSTANTS.PROFILE_PAGE_TITLE, PROFILE_PAGE_CONSTANTS.PROFILE_PAGE_LOAD_TIMEOUT);

        // Validate that the user has landed on the profile page by checking for the user's name
        const profileNameLocator = this.page.getByText(PORTAL_USER_DETAILS.correct.name);
        await expect(profileNameLocator, `Verify User Name section is displayed`).toBeVisible();
        // await expect(profileNameLocator.textContent(0),`Verify User Name section is displayed`).toBeVisible({ timeout: LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_LOAD_TIMEOUT });
        const profileName = await profileNameLocator.textContent();
        expect(profileName?.trim(), `Verifying user name is displayed as : ${PORTAL_USER_DETAILS.correct.name}`).toBe(PORTAL_USER_DETAILS.correct.name);

        // Adding Login Successful Message in console
        console.log('User successfully logged in and profile page is displayed.');
    }

    /**
     * Logs in with incorrect credentials and verifies the error message.
     */
    async verifyIncorrectLogin() {
        // Enter incorrect email and password
        await this.page.fill(loginPageLocators.USERNAME_INPUT_ID, PORTAL_USER_DETAILS.incorrect.email);
        await this.page.fill(loginPageLocators.PASSWORD_INPUT_ID, PORTAL_USER_DETAILS.incorrect.password);

        // Click on the login button
        await this.page.click(loginPageLocators.LOGIN_BTN_ID);

        // Wait for the login error message to appear
        await this.page.waitForSelector(loginPageLocators.LOGIN_ERROR_SECTION_ID, { state: 'visible', timeout: LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_LOAD_TIMEOUT });

        // Verify the login error message
        const errorMessage = await this.page.locator(loginPageLocators.LOGIN_ERROR_SECTION_ID).textContent();
        expect(errorMessage, 'Verifying the incorrect login error message').toContain(LOGIN_PAGE_CONSTANTS.INCORRECT_LOGIN_ERROR_MSG_TEXT);
    }

    /**
     * Logs in with an invalid email format and checks the format error message.
     */
    async verifyInvalidEmailFormat() {
        // Enter invalid email format and a password
        await this.page.fill(loginPageLocators.USERNAME_INPUT_ID, PORTAL_USER_DETAILS.invalidEmail.email);
        await this.page.fill(loginPageLocators.PASSWORD_INPUT_ID, PORTAL_USER_DETAILS.invalidEmail.password);

        // Click on the login button
        await this.page.click(loginPageLocators.LOGIN_BTN_ID);

        // Wait for the email format error message to appear
        await this.page.waitForSelector(loginPageLocators.EMAIL_ERROR_MESSAGE_TEXT_XPATH, { state: 'visible', timeout: LOGIN_PAGE_CONSTANTS.LOGIN_PAGE_LOAD_TIMEOUT });

        // Verify the email format error message
        const emailErrorMessage = await this.page.locator(loginPageLocators.EMAIL_ERROR_MESSAGE_TEXT_XPATH).textContent();
        expect(emailErrorMessage, 'Verifying the invalid email format error message').toBe(LOGIN_PAGE_CONSTANTS.INCORRECT_EMAIL_FORMAT_ERROR_MSG_TEXT);
    }
}