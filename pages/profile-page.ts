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
     * Retrieves the current number of cars owned from the profile page
     * and verifies it against the number of tiles shown.
     * @returns {Promise<number>} The number of cars owned.
     */
    async getCurrentNumberOfCars(): Promise<number> {
        // Locate the "Dina bilar" button and wait for it to be visible
        const carsButtonLocator = this.page.locator(profilePageLocators.YOUR_CARS_LABEL_XPATH);
        await carsButtonLocator.waitFor();

        // Get the button text and extract the number of cars
        const buttonText = await carsButtonLocator.innerText();
        const numberOfCars = parseInt(buttonText.match(/\((\d+)\)/)?.[1] || '0', 10);

        console.log(`Extracted number of cars from button text: ${numberOfCars}`);

        // Wait for the car tiles to be present
        const carTilesLocator = this.page.locator(profilePageLocators.YOUR_CARS_TILE_XPATH);
        await carTilesLocator.waitFor();

        // Get the count of car tiles
        const carCount = await carTilesLocator.count();
        console.log(`Number of cars owned from tiles: ${carCount}`);

        // Verify that the number from the button matches the number of tiles found
        expect(carCount, `Verifying if Number of Cars and Tiles shown are same : ${numberOfCars}`).toBe(numberOfCars);

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