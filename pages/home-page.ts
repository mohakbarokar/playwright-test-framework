/**
 * HomePage Class
 * 
 * This class encapsulates actions and verifications that can be performed on the home page of the application.
 * It leverages Playwright's Page object to interact with the web page elements.
 * 
 * Dependencies:
 * - Playwright test framework for handling page interactions.
 * - Locators for specific elements on the home page.
 * - URL constants for base navigation.
 * - Home page constants for expected values and titles.
 */

import { Page, expect } from '@playwright/test';
import { homePageLocators } from '../locators/home-page-locators'; // Importing locators for home page elements
import { URL } from '../constants/urls'; // Importing constants for URLs
import { HOME_PAGE_CONSTANTS } from '../constants/home-page-constants'; // Importing constants for home page verification

export class HomePage {
    readonly page: Page;

    /**
     * Constructor for HomePage class.
     * 
     * @param page - A Playwright Page object representing the browser tab.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigates to the home page of the application.
     * 
     * This method uses the base URL defined in the URL constants to navigate to the home page.
     */
    async navigateToHomePage() {
        await this.page.goto(URL.PORTAL_BASE_URL);
    }

    /**
     * Verifies the title of the home page.
     * 
     * This method retrieves the current title of the page and compares it to the expected title defined
     * in HOME_PAGE_CONSTANTS. If they do not match, an assertion error will be thrown.
     */
    async verifyHomePageTitle() {
        const title = await this.page.title();
        console.log(`The page title is: ${title}`);
        expect(title, `Title of Homepage found as ${title}`).toBe(HOME_PAGE_CONSTANTS.HOME_PAGE_TITLE);
    }

    /**
     * Clicks on an option by its title.
     * 
     * This method dynamically constructs a selector based on the provided title and clicks the corresponding
     * link on the page. This is useful for interacting with navigational elements that may change.
     * 
     * @param title - The title of the option to be clicked.
     */
    async clickOnOptionByTitle(title: string) {
        console.log(`Clicking on title: ${title}`);
        await this.page.locator(`a[title="${title}"]`).click();
    }

    /**
     * Handles the EULA dialog box, accepting or rejecting it based on the provided parameter.
     * 
     * This method checks if the EULA dialog is visible and verifies its components. If the dialog is present,
     * it can accept or reject the dialog based on the `accept` parameter.
     * 
     * @param accept - A boolean indicating whether to accept (true) or reject (false) the EULA dialog. Default is true.
     */
    async handleEULADialog(accept: boolean = true) {
        // Check if the dialog box title is visible
        const isDialogVisible = await this.page.isVisible(homePageLocators.EULA_DIALOG_BOX_TITLE);

        if (isDialogVisible) {
            console.log(`EULA Dialog is visible on Home Page`);

            // Verify dialog title
            const dialogTitle = await this.page.textContent(homePageLocators.EULA_DIALOG_BOX_TITLE);
            expect(dialogTitle, `Verifying Welcome Dialog title`).toBe(HOME_PAGE_CONSTANTS.EULA_DIALOG_BOX_TITLE);

            // Verify dialog text
            const dialogText = await this.page.textContent(homePageLocators.EULA_DIALOG_BOX_TEXT);
            expect(dialogText, `Verifying policy text`).toBe(HOME_PAGE_CONSTANTS.EULA_DIALOG_BOX_POLICY);

            // Verify accept button text
            const acceptBtnText = await this.page.textContent(homePageLocators.EULA_DIALOG_BOX_ACCEPT_BTN);
            expect(acceptBtnText, `Verifying accept button text`).toBe(HOME_PAGE_CONSTANTS.EULA_DIALOG_ACCEPT_BTN);

            // Verify reject button text
            const rejectBtnText = await this.page.textContent(homePageLocators.EULA_DIALOG_BOX_REJECT_BTN);
            expect(rejectBtnText, `Verifying reject button text`).toBe(HOME_PAGE_CONSTANTS.EULA_DIALOG_REJECT_BTN);

            // Click accept or reject based on the parameter
            if (accept) {
                console.log(`Clicking on EULA Dialog accept all button`);
                await this.page.click(homePageLocators.EULA_DIALOG_BOX_ACCEPT_BTN);
            } else {
                console.log(`Clicking on EULA Dialog reject all button`);
                await this.page.click(homePageLocators.EULA_DIALOG_BOX_REJECT_BTN);
            }
        }
    }
}