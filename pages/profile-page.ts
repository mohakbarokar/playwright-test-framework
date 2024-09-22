import { Page, expect } from '@playwright/test';
import { loginPageLocators } from '../locators/login-page-locators';
import { LOGIN_PAGE_CONSTANTS } from '../constants/login-page-constants';
import { PORTAL_USER_DETAILS } from '../constants/portal-user-details';
import { CommonPage } from './common-page';
import { genericLocators } from '../locators/generic-locators';
import { PROFILE_PAGE_CONSTANTS } from '../constants/profile-page-constants';
import { profilePageLocators } from '../locators/profile-page-locators';

/**
 * ProfilePage class provides utility methods for all Profile page interactions and verifications.
 */
export class ProfilePage {
    private page: Page;
    private commonPage: CommonPage;

    /**
     * Constructor to initialize the LoginPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
    }

    /**
     * Retrieves the current number of cars owned by the user by extracting the number from 
     * the "Dina bilar" button and comparing it with the count of car tiles displayed on the page.
     * 
     * @returns {Promise<number>} - The total number of cars found.
     */
    async getCurrentNumberOfCars(): Promise<number> {
        // Locate the "Dina bilar" button and wait for it to be visible
        const carsButtonLocator = this.page.locator(profilePageLocators.YOUR_CARS_LABEL_XPATH);
        await carsButtonLocator.waitFor();

        // Extract the button text (e.g., "Dina bilar (3)") and extract the number in parentheses
        const buttonText = await carsButtonLocator.innerText();
        const numberOfCars = parseInt(buttonText.match(/\((\d+)\)/)?.[1] || '0', 10);
        console.log(`Extracted number of cars from button text: ${numberOfCars}`);

        // Locate the car tiles and wait for at least one tile to be present
        const carTilesLocator = this.page.locator(profilePageLocators.YOUR_CARS_TILE_XPATH);
        await carTilesLocator.first().waitFor();

        // Get the actual count of car tiles displayed on the page
        const carCount = await carTilesLocator.count();
        console.log(`Number of car tiles found: ${carCount}`);

        // Verify that the number extracted from the button matches the count of car tiles
        expect(carCount, `Verifying the number of cars (${numberOfCars}) matches the number of tiles shown (${carCount})`).toBe(numberOfCars);

        // Return the number of cars as extracted from the "Dina bilar" button
        return numberOfCars;
    }

    /**
     * Clicks on the Design and Order link for Polestar 4.
     *
     * This method waits for the link to be visible and then clicks it.
     *
     * @throws {Error} If the Design and Order link is not visible or cannot be clicked.
     */
    async clickOnDesignAndOrderLink() {
        const locator = this.page.locator(profilePageLocators.DESIGN_AND_ORDER_LINK);

        // Wait for the link to be visible
        await expect(locator, 'Checking if Design and Order link is visible').toBeVisible();

        // Click the link
        await locator.click();

        console.log('Clicked on Design and Order link for Polestar 4');
    }

    /**
     * Cleans up by deleting all cars displayed using the three dots menu option.
     * This method handles multiple instances of the three dots option, confirming 
     * deletion for each car in sequence.
     *
     * @returns {Promise<void>} A promise that resolves when all cars have been deleted.
     */
    async cleanupCars(): Promise<void> {
        // Locate all three dots options and wait for them to be visible
        console.log('Trying to delete cars displayed in configurations.')
        let threeDotsOptions = this.page.locator(profilePageLocators.THREE_DOTS_OPTION_BTN_XPATH);
        let count = await threeDotsOptions.count();

        console.log(`Found ${count} cars to delete.`);

        for (let i = 0; i < count; i++) {
            // Click on the three dots option for the current car
            await threeDotsOptions.nth(i).click();

            // Wait for the delete option to be visible and click it
            const deleteCarOption = this.page.locator(profilePageLocators.DELETE_CAR_OPTION_BTN_XPATH);
            await deleteCarOption.click();

            // Wait for the confirmation dialog to be visible
            const confirmationDialog = this.page.getByText(profilePageLocators.DELETE_CONFIGURATION_TEXT);
            await confirmationDialog.waitFor({ state: 'visible' });

            // Click on the delete button in the confirmation dialog
            const deleteButton = this.page.locator(genericLocators.BUTTON_WITH_TEXT(profilePageLocators.DELETE_BTN_TEXT));
            await deleteButton.click();

            // Optional: Wait for a short duration to ensure the deletion is processed
            await this.page.waitForTimeout(PROFILE_PAGE_CONSTANTS.CAR_CLEANUP_TIMEOUT);

            // Refresh the page and wait for it to load
            await this.page.reload();
            await this.commonPage.waitForPageToLoad(genericLocators.ELEMENT_WITH_TEXT(profilePageLocators.PROFILE_NAME_ELEMENT_TYPE, PORTAL_USER_DETAILS.correct.name), PROFILE_PAGE_CONSTANTS.PROFILE_PAGE_TITLE, PROFILE_PAGE_CONSTANTS.PROFILE_PAGE_LOAD_TIMEOUT);
            
            // Re-locate the three dots options in case the list has changed
            threeDotsOptions = this.page.locator(profilePageLocators.THREE_DOTS_OPTION_BTN_XPATH);
            count = await threeDotsOptions.count();
        }

        console.log('Delete Action Performed.');
    }
}