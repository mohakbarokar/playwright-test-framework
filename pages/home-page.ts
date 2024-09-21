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
import { replaceUnderscoresWithSpaces } from '../utils/string-utils';
import { genericLocators } from '../locators/generic-locators';

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
        const isDialogVisible = await this.page.isVisible(homePageLocators.EULA_DIALOG_BOX_TITLE_ID);

        if (isDialogVisible) {
            console.log(`EULA Dialog is visible on Home Page`);

            // Verify dialog title
            const dialogTitle = await this.page.textContent(homePageLocators.EULA_DIALOG_BOX_TITLE_ID);
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

    /**
     * Verify the currently displayed models on the home page.
     * This method checks if the model names displayed on the home page
     * match the expected model names defined in HOME_PAGE_CONSTANTS.
     *
     * @throws {Error} Throws an error if any expected model is not found
     * in the displayed models.
     */
    async verifyDisplayedModels() {
        // Retrieve the expected model names from the constants
        const modelNames = HOME_PAGE_CONSTANTS.CURRENT_DISPLAYED_MODEL_NAMES;

        // Get the elements matching the XPath for current displayed models
        const displayedModels = await this.page.$$(homePageLocators.CURRENT_DISPLAYED_MODELS_ON_HOME_PAGE);

        // Extract the text content from the displayed elements
        const displayedModelTexts = await Promise.all(
            displayedModels.map(async model => await model.textContent())
        );

        // Verify that all expected models are displayed on the home page
        modelNames.forEach(expectedModel => {
            expect(displayedModelTexts, `Verifying if Model Name : ${expectedModel} is present on home page`).toContain(expectedModel);
        });
    }

    /**
     * Verifies the presence and text of a Polestar link.
     *
     * @param {number} number - The model identifier (2, 3, or 4) for the Polestar link. Can be easily updated from variable
     *
     * @throws {Error} If the link is not visible or the text is not "Upptäck".
     *
     * Example:
     * await carPage.verifyPolestarLink(2); // Verifies the Polestar 2 link
     */
    async verifyPolestarDiscoverButton(number: number) {
        const locator = homePageLocators.GET_POLESTAR_DISCOVER_BUTTON(number);
        const polestarLink = this.page.locator(locator);

        // Check if the link is visible
        await expect(polestarLink, `Checking if ${HOME_PAGE_CONSTANTS.DISCOVER_BTN_TEXT} Button is Visible for Model : Polestar ${number}`).toBeVisible();

        // Verify the text content of the button
        const buttonText = await polestarLink.textContent();
        expect(buttonText?.trim(), `Verifying text of Button for Model : Polestar ${number} to be ${HOME_PAGE_CONSTANTS.DISCOVER_BTN_TEXT} `).toBe(HOME_PAGE_CONSTANTS.DISCOVER_BTN_TEXT);
    }

    /**
     * Verifies the visibility of navigation menu icons based on the provided titles.
     * 
     * @param icons - An object containing titles of the navigation icons to be verified.
     * 
     * This method iterates through the provided titles, checks if each navigation icon is visible on the page,
     * and asserts their visibility using Playwright's 'expect' function.
     */
    async verifyNavigationMenuIconsVisibility(icons: Record<string, string>) {
        for (const [key, title] of Object.entries(icons)) {
            const locator = this.page.getByTitle(title);
            // Assert visibility of the icon in Navigation Menu
            await expect(locator, `Checking if ${key} icon is visible in Navigation menu`).toBeVisible();
        }
    }

    /**
     * Verifies the visibility of navigation menu buttons based on the provided IDs.
     * 
     * @param buttons - An object containing IDs of the navigation buttons to be verified.
     * 
     * This method iterates through the provided IDs, checks if each navigation button is visible on the page,
     * and asserts their visibility and text content using Playwright's 'expect' function.
     */
    async verifyNavigationMenuButtonsVisibility(buttons: Record<string, string>) {
        for (const [key, buttonText] of Object.entries(buttons)) {
            // Get the dynamic locator using button text
            const locator = this.page.locator(genericLocators.BUTTON_WITH_TEXT(buttonText));

            // Wait for the button to be visible
            await expect(locator, `Checking if ${buttonText} button is visible in Navigation menu`).toBeVisible();

            // Await the textContent() and check if the button contains the correct text
            const actualText = await locator.textContent();
            expect(actualText?.trim(), `Checking if button text is displayed as ${buttonText}`).toBe(buttonText);
        }
    }

}