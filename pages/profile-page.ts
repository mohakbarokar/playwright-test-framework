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

    /**
     * Constructor to initialize the LoginPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
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
}