import { Page, expect, request } from '@playwright/test';
import { genericLocators } from '../locators/generic-locators';

/**
 * CommonPage class provides utility methods for all pages interactions and verifications.
 */
export class CommonPage {
    private page: Page;

    /**
     * Constructor to initialize the CommonPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Verifies the title of the page.
     * @param expectedTitle The expected title of the page.
     */
    async verifyPageTitle(expectedTitle: string) {
        const title = await this.page.title();
        console.log(`The page title is: ${title}`);
        expect(title, `Expected title : "${expectedTitle}" :: Found title : "${title}"`).toBe(expectedTitle);
    }

    /**
     * Check and Verify Broken Images on the Page
     * 
     * This method locates all image elements (`<img>`) on the page, checks if their source URLs
     * return a successful HTTP status (200), and logs the URLs of any broken images. If any image fails
     * to load or returns a non-200 status, its URL will be logged and an assertion will be made.
     * 
     * @returns A promise that resolves after verifying that no broken images are found on the page.
     * If broken images are found, an assertion error will be thrown with the count of broken images.
     */
    async checkAndVerifyBrokenImages(): Promise<void> {
        console.log('Checking and Verifying Broken Images on Page');
        const brokenImages: string[] = [];

        // Find all image elements on the page
        const images = await this.page.locator('img');

        // Get the count of images found
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const src = await img.getAttribute('src');

            if (src) {
                try {
                    // Make a request to the image URL
                    const response = await this.page.request.get(src);
                    // Log the response status along with the current index and total count
                    console.log(`Image ${i + 1}/${count} - URL: ${src}, Status: ${response.status()}`);
                    // Check if the response status is not OK (not 200)
                    if (!response.ok()) {
                        brokenImages.push(src);
                    }
                } catch (error) {
                    // If there is an error in the request, consider it as broken
                    brokenImages.push(src);
                }
            } else {
                // If the src attribute is missing, consider the image broken
                brokenImages.push('Image missing src attribute');
            }
        }

        // If any broken images are found, log and assert that no broken images should exist
        if (brokenImages.length > 0) {
            console.error('Broken images found:', brokenImages);
            expect(brokenImages.length, `Broken Images Found on Page : ${brokenImages.length}`).toBe(0);
        } else {
            console.log('No broken images found.');
        }
    }

    /**
    * Verifies if all video elements on the page are present, loaded, and playing.
    * @param timeout - Timeout in milliseconds to wait for each video to load. default set to 10000.
    * @throws Will throw an error if any video is not present, not loaded, or not playing.
    */
    async verifyAllVideosArePlaying(timeout: number = 30000) {
        // Get all video elements on the page
        const videoElements = this.page.locator('video');

        // Get the count of video elements on the page
        const videoCount = await videoElements.count();
        console.log(`Total number of videos on the page: ${videoCount}`);

        // Iterate through each video element and verify its state
        for (let i = 0; i < videoCount; i++) {
            const videoElement = videoElements.nth(i);

            // Wait for the video element to be visible
            await expect(videoElement, `Checking if video ${i + 1} is visible`).toBeVisible({ timeout });

            // Check if the video is loaded by accessing its 'readyState'
            const videoLoaded = await videoElement.evaluate((video: HTMLVideoElement) => video.readyState >= 3);
            expect(videoLoaded, `Expecting video ${i + 1} to be loaded`).toBeTruthy();

            // Check if the video is playing
            const isPlaying = await videoElement.evaluate((video: HTMLVideoElement) => {
                return !video.paused && !video.ended && video.currentTime > 0;
            });
            expect(isPlaying, `Expecting video ${i + 1} to be playing`).toBeTruthy();

            // Log success message for each video
            console.log(`Video ${i + 1} is present, loaded, and playing.`);
        }
    }

    /**
    * Verifies if all video elements with .mp4 source URLs are valid and return a status of 200.
    * @param timeout - Timeout in milliseconds for each video request (default: 10000 ms).
    */
    async verifyAllMp4VideosAreValid(timeout: number = 10000) {
        const videoElements = this.page.locator('video');

        // Get the count of video elements on the page
        const videoCount = await videoElements.count();
        console.log(`Total number of videos on the page: ${videoCount}`);

        for (let i = 0; i < videoCount; i++) {
            const videoElement = videoElements.nth(i);
            const videoSrc = await videoElement.getAttribute('src');

            // Check if the video source URL ends with .mp4
            if (videoSrc && videoSrc.endsWith('.mp4')) {
                console.log(`Checking video URL: ${videoSrc}`);

                // Fetch the video URL directly using the browser context
                try {
                    const response = await this.page.request.get(videoSrc, {
                        timeout: timeout,
                    });

                    expect(response.status(), `Video ${i + 1} returned status : ${response.status()}`).toBe(200);
                    console.log(`Video ${i + 1} is a valid .mp4 and returned status 200.`);
                } catch (error) {
                    console.error(`Error fetching video ${i + 1}:`, error);
                }
            } else {
                console.warn(`Video ${i + 1} does not have a valid .mp4 URL, skipping.`);
            }
        }
    }

    /**
     * Waits for a page to fully load by checking the visibility of a key element.
     * @param elementLocator The locator for the element that should be visible when the page is fully loaded.
     * @param pageTitle The expected title of the page to verify after it loads. (Optional)
     * @param timeout The maximum time to wait for the element to become visible (default: 10 seconds). (Optional)
     */
    async waitForPageToLoad(elementLocator: string, pageTitle?: string, timeout: number = 200000) {
        console.log(`Waiting for the page to fully load with element: ${elementLocator}`);

        // Try to wait for the page's network activity to idle
        try {
            await this.page.waitForLoadState('networkidle', { timeout });
        } catch (error) {
            console.warn(`Warning : networkidle state not found : ${error.message}. Continuing the execution after timeout...`);
        }

        // Wait for the key element to be visible
        await this.page.waitForSelector(elementLocator, { state: 'visible', timeout });

        // Verify the page title if provided
        if (pageTitle) {
            const title = await this.page.title();
            console.log(`The page title is: ${title}`);
            expect(title, `Expected title : "${pageTitle}" :: Found title : "${title}"`).toBe(pageTitle);
        }
        console.log('Page is fully loaded.');
    }

    /**
    * Clicks on a navigation button with the specified text.
    *
    * @param {string} buttonText - The text of the button to be clicked.
    * @throws {Error} If the button is not visible or cannot be clicked.
    *
    * @example
    * await homePage.clickOnNavigationButton('Profile');
    */
    async clickOnNavigationButton(buttonText: string) {
        // Get the dynamic locator using button text
        const locator = this.page.locator(genericLocators.BUTTON_WITH_TEXT(buttonText));

        // Wait for the button to be visible
        await expect(locator, `Checking if ${buttonText} button is visible in Navigation menu`).toBeVisible();

        // Click the button
        await locator.click();

        console.log(`Clicked on ${buttonText} button in Navigation menu`);
    }

    /**
     * Hovers over a navigation button identified by its text.
     * 
     * @param {string} buttonText - The text of the button to hover over.
     */
    async hoverOnNavigationButton(buttonText: string) {
        // Get the dynamic locator using button text
        const locator = this.page.locator(genericLocators.BUTTON_WITH_TEXT(buttonText));
        await locator.hover();
    }
}